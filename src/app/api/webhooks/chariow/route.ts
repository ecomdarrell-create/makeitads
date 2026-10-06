import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

// ============================================
// CRÉATION DU CLIENT SUPABASE (à l'appel)
// ============================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.'
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ============================================
// EXTRACTION ROBUSTE DES CHAMPS
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
// RECHERCHE UTILISATEUR (via profiles)
// ============================================

async function findUserByEmail(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string
): Promise<{ id: string; email: string } | null> {
  // Tentative 1 : chercher dans la table profiles
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .ilike('email', email)
      .maybeSingle();

    if (profile?.id) {
      return { id: profile.id, email: profile.email || email };
    }
  } catch (e) {
    console.warn('Recherche via profiles echouee, fallback listUsers:', e);
  }

  // Tentative 2 : pagination complète sur auth.users
  try {
    let page = 1;
    const perPage = 1000;
    const maxPages = 20; // sécurité : 20 000 utilisateurs max

    while (page <= maxPages) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        console.error('Erreur listUsers page', page, error);
        break;
      }

      const users = data?.users || [];
      const match = users.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        return { id: match.id, email: match.email || email };
      }

      if (users.length < perPage) break;
      page++;
    }
  } catch (e) {
    console.error('Erreur fallback listUsers:', e);
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
    console.log('Body brut:', rawBody.slice(0, 2000));

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('Impossible de parser le JSON');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = extractEmail(payload);
    if (!email) {
      console.error('Pas d email trouve. Cles du payload:', Object.keys(payload));
      return NextResponse.json(
        { error: 'No email found', keys: Object.keys(payload) },
        { status: 400 }
      );
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
    console.log(`Vente detectee : ${email} -> Plan ${plan} (order: ${orderId})`);

    const planConfig = PRICING_CONFIG[plan];
    const monthlyCredits = planConfig.monthlyCredits;

    const supabaseAdmin = getSupabaseAdmin();

    const user = await findUserByEmail(supabaseAdmin, email);

    if (!user) {
      console.warn(`Aucun utilisateur Supabase pour ${email}`);
      return NextResponse.json({
        success: true,
        warning: 'No matching user',
        email,
        plan,
      });
    }

    // Mise à jour du profil
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: plan,
        credits_balance: monthlyCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Erreur update profil:', updateError);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    // Enregistrement de la transaction
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: user.id,
      type: 'purchase',
      amount: monthlyCredits,
      balance_after: monthlyCredits,
      description: `Achat du plan ${plan} via Chariow (${orderId || 'order inconnu'})`,
    });

    console.log(`SUCCES : ${email} -> ${plan} + ${monthlyCredits} credits`);

    return NextResponse.json({
      success: true,
      userId: user.id,
      plan,
      creditsAdded: monthlyCredits,
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