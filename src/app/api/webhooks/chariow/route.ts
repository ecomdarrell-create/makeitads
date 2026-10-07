import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

// ============================================
// CLIENT SUPABASE ADMIN
// ============================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requises.'
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ============================================
// EXTRACTION DES CHAMPS
// ============================================

function extractEmail(payload: any): string | null {
  const candidates = [
    payload?.customer_email,
    payload?.email,
    payload?.customer?.email,
    payload?.buyer?.email,
    payload?.data?.customer_email,
    payload?.data?.email,
    payload?.data?.customer?.email,
    payload?.data?.buyer?.email,
    payload?.data?.customer?.user?.email,
    payload?.sale?.customer_email,
    payload?.sale?.email,
    payload?.sale?.customer?.email,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.includes('@')) {
      return candidate.toLowerCase().trim();
    }
  }
  return null;
}

function extractCustomerName(payload: any): string | null {
  const candidates = [
    payload?.customer_name,
    payload?.customer?.name,
    payload?.buyer?.name,
    payload?.data?.customer_name,
    payload?.data?.customer?.name,
    payload?.data?.buyer?.name,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

function extractProductName(payload: any): string | null {
  const candidates = [
    payload?.product_name,
    payload?.product?.name,
    payload?.product?.title,
    payload?.data?.product_name,
    payload?.data?.product?.name,
    payload?.data?.product?.title,
    payload?.sale?.product_name,
    payload?.sale?.product?.name,
    payload?.items?.[0]?.product_name,
    payload?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product_name,
    payload?.data?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product?.name,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.toLowerCase().trim();
    }
  }
  return null;
}

function extractOrderId(payload: any): string | null {
  const candidates = [
    payload?.order_id,
    payload?.order?.id,
    payload?.sale_id,
    payload?.sale?.id,
    payload?.id,
    payload?.data?.order_id,
    payload?.data?.order?.id,
    payload?.data?.sale_id,
    payload?.data?.sale?.id,
    payload?.data?.id,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
    if (typeof candidate === 'number') {
      return String(candidate);
    }
  }
  return null;
}

function detectPlan(payload: any): PlanId | null {
  const productName = extractProductName(payload);
  if (!productName) return null;

  if (productName.includes('elite') || productName.includes('élite')) {
    return 'enterprise';
  }
  if (productName.includes('premium')) {
    return 'premium';
  }
  if (productName.includes('pro')) {
    return 'pro';
  }

  return null;
}

// ============================================
// POST /api/webhooks/chariow
// ============================================

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log('=== WEBHOOK CHARIOW RECU ===');

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('Impossible de parser le JSON');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = extractEmail(payload);
    if (!email) {
      console.error('Pas d email trouve');
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const plan = detectPlan(payload);
    if (!plan) {
      console.error('Plan introuvable. Product name:', extractProductName(payload));
      return NextResponse.json(
        { error: 'Unknown plan', productName: extractProductName(payload) },
        { status: 400 }
      );
    }

    const orderId = extractOrderId(payload);
    const customerName = extractCustomerName(payload) || 'Client';
    console.log(`Vente detectee : ${email} -> Plan ${plan}`);

    const planConfig = PRICING_CONFIG[plan];
    const monthlyCredits = planConfig.monthlyCredits;

    const supabaseAdmin = getSupabaseAdmin();

    // ============================================
    // 1. RECHERCHER L'UTILISATEUR
    // ============================================

    let userId: string | null = null;
    let isNewUser = false;

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .ilike('email', email)
      .maybeSingle();

    if (existingProfile?.id) {
      userId = existingProfile.id;
      console.log(`Utilisateur trouve dans profiles : ${userId}`);
    }

    if (!userId) {
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
      const match = usersList?.users?.find(
        (u) => u.email?.toLowerCase() === email
      );
      if (match) {
        userId = match.id;
        console.log(`Utilisateur trouve dans auth.users : ${userId}`);
      }
    }

    // ============================================
    // 2. SI PAS D'UTILISATEUR → LE CRÉER SANS EMAIL
    // ============================================
    // L'utilisateur pourra utiliser "Mot de passe oublié" pour accéder à son compte

    if (!userId) {
      console.log(`Creation automatique de l'utilisateur : ${email}`);
      isNewUser = true;

      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            full_name: customerName,
            created_from: 'chariow_purchase',
          },
        });

      if (createError || !newUser?.user) {
        console.error('Erreur creation utilisateur:', createError);
        return NextResponse.json(
          { error: 'User creation failed', details: createError?.message },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
      console.log(`Utilisateur cree : ${userId}`);

      // Créer son profil
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          plan: plan,
          credits_balance: monthlyCredits,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Erreur creation profil:', profileError);
      }
    } else {
      // ============================================
      // 3. UTILISATEUR EXISTANT → METTRE À JOUR
      // ============================================

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          plan: plan,
          credits_balance: monthlyCredits,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Erreur update profil:', updateError);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }
    }

    // ============================================
    // 4. ENREGISTRER LA TRANSACTION
    // ============================================

    await supabaseAdmin.from('credit_transactions').insert({
      user_id: userId,
      type: 'purchase',
      amount: monthlyCredits,
      balance_after: monthlyCredits,
      description: `Achat du plan ${plan} via Chariow (${orderId || 'order inconnu'})`,
    });

    console.log(`SUCCES : ${email} -> ${plan} + ${monthlyCredits} credits`);

    return NextResponse.json({
      success: true,
      userId,
      plan,
      creditsAdded: monthlyCredits,
      isNewUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur webhook Chariow:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================
// GET — test de l'endpoint
// ============================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Chariow MakeItAds operationnel',
    timestamp: new Date().toISOString(),
  });
}