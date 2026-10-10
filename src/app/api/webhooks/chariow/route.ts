import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

// ─────────────────────────────────────────────────────────────
// Détection de pack — plus robuste :
//   1. Match exact sur nom normalisé
//   2. Match sur "credits" / "crédits" suivi/précédé d'un nombre
//   3. Match sur "pack"/"recharge" + nombre
// ─────────────────────────────────────────────────────────────
const RECHARGE_NAMES: Record<string, number> = {
  'recharge 10': 10,
  'recharge 30': 30,
  'recharge 80': 80,
  'pack 10': 10,
  'pack 30': 30,
  'pack 80': 80,
};

const RECHARGE_PRICES: Record<number, number> = {
  10: 1500,
  30: 4000,
  80: 9000,
};

const PLAN_PRICES: Record<string, number> = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

/**
 * Détecte un pack de crédits dans le nom du produit.
 * Retourne le nombre de crédits ou null.
 */
function detectRechargePack(payload: any): number | null {
  const productName = extractProductName(payload);
  if (!productName) return null;

  // 1) Match exact sur les noms connus
  for (const [key, credits] of Object.entries(RECHARGE_NAMES)) {
    if (productName.includes(key)) return credits;
  }

  // 2) Pattern "X crédits" ou "X credits" (nombre avant)
  const beforeCredits = productName.match(/(\d+)\s*(cr[ée]dits?|credits?)/i);
  if (beforeCredits) {
    const num = parseInt(beforeCredits[1], 10);
    if (num > 0 && num <= 1000) return num;
  }

  // 3) Pattern "crédits X" ou "credits X" (nombre après)
  const afterCredits = productName.match(/(cr[ée]dits?|credits?)\s*\+?\s*(\d+)/i);
  if (afterCredits) {
    const num = parseInt(afterCredits[2], 10);
    if (num > 0 && num <= 1000) return num;
  }

  // 4) Pattern "pack" / "recharge" suivi d'un nombre
  if (productName.includes('recharge') || productName.includes('pack')) {
    const match = productName.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0 && num <= 1000) return num;
    }
  }

  return null;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function extractEmail(payload: any): string | null {
  const candidates = [
    payload?.customer_email, payload?.email, payload?.customer?.email,
    payload?.buyer?.email, payload?.data?.customer_email, payload?.data?.email,
    payload?.data?.customer?.email, payload?.data?.buyer?.email,
    payload?.data?.customer?.user?.email, payload?.sale?.customer_email,
    payload?.sale?.email, payload?.sale?.customer?.email,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.includes('@')) return c.toLowerCase().trim();
  }
  return null;
}

function extractCustomerName(payload: any): string | null {
  const candidates = [
    payload?.customer_name, payload?.customer?.name, payload?.buyer?.name,
    payload?.data?.customer_name, payload?.data?.customer?.name, payload?.data?.buyer?.name,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

function extractProductName(payload: any): string | null {
  const candidates = [
    payload?.product_name, payload?.product?.name, payload?.product?.title,
    payload?.data?.product_name, payload?.data?.product?.name, payload?.data?.product?.title,
    payload?.sale?.product_name, payload?.sale?.product?.name,
    payload?.items?.[0]?.product_name, payload?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product_name, payload?.data?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product?.name,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.toLowerCase().trim();
  }
  return null;
}

function extractOrderId(payload: any): string | null {
  const candidates = [
    payload?.order_id, payload?.order?.id, payload?.sale_id, payload?.sale?.id,
    payload?.id, payload?.data?.order_id, payload?.data?.order?.id,
    payload?.data?.sale_id, payload?.data?.sale?.id, payload?.data?.id,
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

// ─────────────────────────────────────────────────────────────
// POST — Traite les paiements Chariow
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log('=== WEBHOOK CHARIOW RECU ===');

    // ✅ On lit userId depuis les query params (injectés dans l'URL Chariow)
    const userIdFromQuery = req.nextUrl.searchParams.get('userId');
    const emailFromQuery = req.nextUrl.searchParams.get('email');

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // ✅ Email : on préfère celui du payload (source de vérité Chariow),
    //    mais on accepte celui de l'URL en fallback
    const email = extractEmail(payload) || emailFromQuery?.toLowerCase().trim() || null;
    if (!email) return NextResponse.json({ error: 'No email found' }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();

    let userId: string | null = null;
    let currentPlan: PlanId = 'free';
    let currentCredits = 0;

    // ✅ PRIORITÉ 1 : userId depuis l'URL (le plus fiable)
    if (userIdFromQuery) {
      const { data: profileById } = await supabaseAdmin
        .from('profiles')
        .select('id, email, plan, credits_balance')
        .eq('id', userIdFromQuery)
        .maybeSingle();

      if (profileById?.id) {
        userId = profileById.id;
        currentPlan = (profileById.plan as PlanId) || 'free';
        currentCredits = profileById.credits_balance || 0;
        console.log(`[chariow] User trouvé via query userId: ${userId}`);
      }
    }

    // ✅ PRIORITÉ 2 : email depuis profiles
    if (!userId) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, plan, credits_balance')
        .ilike('email', email)
        .maybeSingle();

      if (existingProfile?.id) {
        userId = existingProfile.id;
        currentPlan = (existingProfile.plan as PlanId) || 'free';
        currentCredits = existingProfile.credits_balance || 0;
        console.log(`[chariow] User trouvé via email: ${userId}`);
      }
    }

    // ✅ PRIORITÉ 3 : email depuis auth.users
    if (!userId) {
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
      const match = usersList?.users?.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        userId = match.id;
        console.log(`[chariow] User trouvé via auth.users: ${userId}`);
      }
    }

    const rechargeCredits = detectRechargePack(payload);
    const plan = detectPlan(payload);
    const orderId = extractOrderId(payload);

    console.log(
      `[chariow] Detect — recharge=${rechargeCredits} plan=${plan} orderId=${orderId} email=${email} userId=${userId}`
    );

    // ─── CAS A : RECHARGE DE CRÉDITS ───
    if (rechargeCredits) {
      console.log(`[chariow] Recharge détectée : +${rechargeCredits} crédits`);

      if (!userId) {
        console.error(`[chariow] Recharge SANS user correspondant (email=${email})`);
        return NextResponse.json(
          {
            error: 'Recharge sans compte existant',
            email,
            hint: 'Le compte doit être créé avant achat',
          },
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
        console.error('[chariow] Update balance failed:', updateError.message);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }

      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        type: 'recharge',
        amount: rechargeCredits,
        balance_after: newBalance,
        description: `Recharge de ${rechargeCredits} crédits via Chariow (${orderId || 'order inconnu'})`,
      });

      // Tracking revenu
      const rechargePrice = RECHARGE_PRICES[rechargeCredits] || 0;
      await supabaseAdmin.from('revenue_transactions').insert({
        user_id: userId,
        email,
        plan_id: `recharge_${rechargeCredits}`,
        amount_fcfa: rechargePrice,
        source: 'chariow',
        order_id: orderId,
      });

      console.log(
        `[chariow] ✅ SUCCÈS recharge : +${rechargeCredits} (nouveau solde: ${newBalance}) — ${rechargePrice} FCFA`
      );

      return NextResponse.json({
        success: true,
        type: 'recharge',
        userId,
        creditsAdded: rechargeCredits,
        newBalance,
        revenue: rechargePrice,
      });
    }

    // ─── CAS B : ACHAT DE PLAN ───
    if (plan) {
      console.log(`[chariow] Achat plan détecté : ${plan}`);

      const planConfig = PRICING_CONFIG[plan];
      const monthlyCredits = planConfig.monthlyCredits;
      const customerName = extractCustomerName(payload) || 'Client';

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

      if (!userId) {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: customerName, created_from: 'chariow_purchase' },
        });

        if (createError || !newUser?.user) {
          console.error('[chariow] User creation failed:', createError?.message);
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
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
          console.error('[chariow] Plan update failed:', updateError.message);
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

      // Tracking revenu
      const planPrice = PLAN_PRICES[plan] || 0;
      await supabaseAdmin.from('revenue_transactions').insert({
        user_id: userId,
        email,
        plan_id: plan,
        amount_fcfa: planPrice,
        source: 'chariow',
        order_id: orderId,
      });

      console.log(`[chariow] ✅ SUCCÈS plan : ${plan} + ${monthlyCredits} crédits — ${planPrice} FCFA`);

      return NextResponse.json({
        success: true,
        type: 'plan',
        userId,
        plan,
        creditsAdded: monthlyCredits,
        expiresAt: expiresAt.toISOString(),
        revenue: planPrice,
      });
    }

    // ─── CAS C : inconnu ───
    console.warn('[chariow] Produit non reconnu, payload:', JSON.stringify(payload).slice(0, 500));
    return NextResponse.json(
      { error: 'Produit non reconnu', productName: extractProductName(payload) },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[chariow] Erreur webhook :', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// GET — Health check
// ─────────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Chariow MakeItAds opérationnel',
    timestamp: new Date().toISOString(),
  });
}