import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

// ============================================
// CLIENT SUPABASE ADMIN (bypass RLS)
// ============================================

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

// ============================================
// TYPES
// ============================================

interface ChariowWebhookPayload {
  event?: string;
  customer_email?: string;
  customer_name?: string;
  product_name?: string;
  product_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  order_id?: string;
  // Chariow peut envoyer les données à plat ou dans un objet "data"
  data?: {
    customer_email?: string;
    customer_name?: string;
    product_name?: string;
    product_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    order_id?: string;
  };
}

// ============================================
// DÉTECTION DU PLAN
// ============================================

function detectPlan(payload: ChariowWebhookPayload): PlanId | null {
  const data = payload.data || payload;
  const productName = (data.product_name || '').toLowerCase();

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
    const secret = req.headers.get('x-chariow-secret');
    const expectedSecret = process.env.CHARIOW_WEBHOOK_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      console.warn('Webhook Chariow : secret invalide');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: ChariowWebhookPayload = await req.json();
    console.log('Webhook Chariow recu:', JSON.stringify(payload).slice(0, 500));

    const data = payload.data || payload;
    const email = (data.customer_email || '').toLowerCase().trim();

    if (!email) {
      console.error('Pas d email dans le payload');
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    const plan = detectPlan(payload);
    if (!plan) {
      console.error('Plan introuvable dans:', data.product_name);
      return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
    }

    console.log(`Vente detectee : ${email} -> Plan ${plan}`);

    const planConfig = PRICING_CONFIG[plan];
    const monthlyCredits = planConfig.monthlyCredits;

    // Trouver l'utilisateur par email
    const { data: usersList, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Erreur listUsers:', listError);
      return NextResponse.json({ error: 'Users fetch failed' }, { status: 500 });
    }

    const matchingUser = usersList.users.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (!matchingUser) {
      console.warn(`Aucun utilisateur pour ${email}`);
      return NextResponse.json({
        success: true,
        warning: 'No matching user',
        email,
        plan,
      });
    }

    // Mettre à jour le profil
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: plan,
        credits_balance: monthlyCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchingUser.id);

    if (updateError) {
      console.error('Erreur update profil:', updateError);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    // Enregistrer la transaction
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: matchingUser.id,
      type: 'purchase',
      amount: monthlyCredits,
      balance_after: monthlyCredits,
      description: `Achat du plan ${plan} via Chariow (${data.order_id || 'order inconnu'})`,
    });

    console.log(`Profil mis a jour : ${email} -> ${plan} + ${monthlyCredits} credits`);

    return NextResponse.json({
      success: true,
      userId: matchingUser.id,
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
// GET — pour tester que l'endpoint existe
// ============================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Chariow MakeItAds operationnel',
    timestamp: new Date().toISOString(),
  });
}