import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

// ============================================
// CONFIGURATION DES PACKS DE RECHARGE
// ============================================

const RECHARGE_PACKS: Record<string, number> = {
  'recharge 10': 10,
  'recharge 30': 30,
  'recharge 80': 80,
  'pack 10': 10,
  'pack 30': 30,
  'pack 80': 80,
};

function detectRechargePack(payload: any): number | null {
  const productName = extractProductName(payload);
  if (!productName) return null;

  for (const [key, credits] of Object.entries(RECHARGE_PACKS)) {
    if (productName.includes(key)) {
      return credits;
    }
  }

  if (productName.includes('recharge') || productName.includes('pack')) {
    const match = productName.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0 && num <= 1000) return num;
    }
  }

  return null;
}

// ============================================
// CLIENT SUPABASE ADMIN
// ============================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Variables Supabase manquantes');
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
  for (const c of candidates) {
    if (typeof c === 'string' && c.includes('@')) return c.toLowerCase().trim();
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
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
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
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.toLowerCase().trim();
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
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
    if (typeof c === 'number') return String(c);
  }
  return null;
}

function detectPlan(payload: any): PlanId | null {
  const productName = extractProductName(payload);
  if (!productName) return null;

  if (productName.includes('elite') || productName.includes('élite')) return 'enterprise';
  if (productName.includes('premium')) return 'premium';
  if (productName.includes('pro')) return 'pro';
  return null;
}

// ============================================
// POST
// ============================================

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log('=== WEBHOOK CHARIOW RECU ===');

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = extractEmail(payload);
    if (!email) {
      console.error('Pas d email trouve');
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Trouver l'utilisateur
    let userId: string | null = null;
    let currentPlan: PlanId = 'free';
    let currentCredits = 0;

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, plan, credits_balance')
      .ilike('email', email)
      .maybeSingle();

    if (existingProfile?.id) {
      userId = existingProfile.id;
      currentPlan = (existingProfile.plan as PlanId) || 'free';
      currentCredits = existingProfile.credits_balance || 0;
      console.log(`Utilisateur trouve : ${userId}`);
    } else {
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
      const match = usersList?.users?.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        userId = match.id;
        console.log(`Utilisateur dans auth.users : ${userId}`);
      }
    }

    // 2. Détecter le type d'achat
    const rechargeCredits = detectRechargePack(payload);
    const plan = detectPlan(payload);

    // ─── CAS A : Pack de recharge ───
    if (rechargeCredits) {
      console.log(`Recharge detectee : +${rechargeCredits} credits`);

      if (!userId) {
        console.error(`Aucun compte pour ${email} — impossible de recharger`);
        return NextResponse.json(
          { error: 'Recharge sans compte existant' },
          { status: 400 }
        );
      }

      const newBalance = currentCredits + rechargeCredits;

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          credits_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Erreur update credits:', updateError);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }

      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        type: 'recharge',
        amount: rechargeCredits,
        balance_after: newBalance,
        description: `Recharge de ${rechargeCredits} crédits via Chariow (${extractOrderId(payload) || 'order inconnu'})`,
      });

      console.log(`SUCCES recharge : +${rechargeCredits} (solde: ${newBalance})`);

      return NextResponse.json({
        success: true,
        type: 'recharge',
        userId,
        creditsAdded: rechargeCredits,
        newBalance,
      });
    }

    // ─── CAS B : Achat d'un plan ───
    if (plan) {
      console.log(`Achat plan detecte : ${plan}`);

      const planConfig = PRICING_CONFIG[plan];
      const monthlyCredits = planConfig.monthlyCredits;
      const customerName = extractCustomerName(payload) || 'Client';
      const orderId = extractOrderId(payload);

      // Calcul date d'expiration : +365 jours
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

      // Si pas d'utilisateur → créer
      if (!userId) {
        console.log(`Creation automatique : ${email}`);

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: customerName, created_from: 'chariow_purchase' },
        });

        if (createError || !newUser?.user) {
          console.error('Erreur creation utilisateur:', createError);
          return NextResponse.json(
            { error: 'User creation failed', details: createError?.message },
            { status: 500 }
          );
        }

        userId = newUser.user.id;

        await supabaseAdmin.from('profiles').insert({
          id: userId,
          email,
          plan,
          credits_balance: monthlyCredits,
          plan_expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // Update du profil
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            plan,
            credits_balance: monthlyCredits,
            plan_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Erreur update profil:', updateError);
          return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }
      }

      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        type: 'purchase',
        amount: monthlyCredits,
        balance_after: monthlyCredits,
        description: `Achat du plan ${plan} via Chariow (${orderId || 'order inconnu'})`,
      });

      console.log(`SUCCES plan : ${plan} + ${monthlyCredits} credits, expire ${expiresAt.toISOString()}`);

      return NextResponse.json({
        success: true,
        type: 'plan',
        userId,
        plan,
        creditsAdded: monthlyCredits,
        expiresAt: expiresAt.toISOString(),
      });
    }

    console.error('Produit non reconnu:', extractProductName(payload));
    return NextResponse.json(
      { error: 'Produit non reconnu', productName: extractProductName(payload) },
      { status: 400 }
    );
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