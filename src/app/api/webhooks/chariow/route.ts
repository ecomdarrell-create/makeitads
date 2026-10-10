import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

const RECHARGE_NAMES: Record<string, number> = {
  'recharge 10': 10, 'recharge 30': 30, 'recharge 80': 80,
  'pack 10': 10, 'pack 30': 30, 'pack 80': 80,
};

const RECHARGE_PRICES: Record<number, number> = { 10: 1500, 30: 4000, 80: 9000 };
const PLAN_PRICES: Record<string, number> = { pro: 10000, premium: 25000, enterprise: 100000 };

// ─────────────────────────────────────────────────────────────
// DÉTECTION STRICTE
// ─────────────────────────────────────────────────────────────
function detectRechargePack(payload: any): number | null {
  const p = extractProductName(payload);
  if (!p) return null;

  // Match exact sur les noms connus
  for (const [key, credits] of Object.entries(RECHARGE_NAMES)) {
    if (p.includes(key)) return credits;
  }

  // Pattern "X crédits" (nombre avant)
  const before = p.match(/(\d+)\s*(cr[ée]dits?|credits?)/i);
  if (before) {
    const n = parseInt(before[1], 10);
    if (n > 0 && n <= 1000) return n;
  }

  // Pattern "crédits X" (nombre après)
  const after = p.match(/(cr[ée]dits?|credits?)\s*\+?\s*(\d+)/i);
  if (after) {
    const n = parseInt(after[2], 10);
    if (n > 0 && n <= 1000) return n;
  }

  // Fallback : "pack" OU "recharge" + nombre (doit contenir le mot-clé)
  if (p.includes('recharge') || p.includes('pack')) {
    const m = p.match(/(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 1000) return n;
    }
  }

  return null;
}

// ✅ CORRIGÉ : word boundaries pour ne PAS matcher "product" → "pro"
function detectPlan(payload: any): PlanId | null {
  const p = extractProductName(payload);
  if (!p) return null;

  // \b = frontière de mot : "pro" matche "makeitads pro" mais PAS "product"
  if (/\b(elite|élite)\b/i.test(p)) return 'enterprise';
  if (/\bpremium\b/i.test(p)) return 'premium';
  if (/\bpro\b/i.test(p)) return 'pro';

  return null;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function extractEmail(payload: any): string | null {
  const c = [
    payload?.customer_email, payload?.email, payload?.customer?.email,
    payload?.buyer?.email, payload?.data?.customer_email, payload?.data?.email,
    payload?.data?.customer?.email, payload?.data?.buyer?.email,
    payload?.data?.customer?.user?.email, payload?.sale?.customer_email,
    payload?.sale?.email, payload?.sale?.customer?.email,
  ];
  for (const x of c) if (typeof x === 'string' && x.includes('@')) return x.toLowerCase().trim();
  return null;
}

function extractProductName(payload: any): string | null {
  const c = [
    payload?.product_name, payload?.product?.name, payload?.product?.title,
    payload?.data?.product_name, payload?.data?.product?.name, payload?.data?.product?.title,
    payload?.sale?.product_name, payload?.sale?.product?.name,
    payload?.items?.[0]?.product_name, payload?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product_name, payload?.data?.items?.[0]?.name,
    payload?.data?.items?.[0]?.product?.name,
  ];
  for (const x of c) if (typeof x === 'string' && x.trim()) return x.toLowerCase().trim();
  return null;
}

function extractOrderId(payload: any): string | null {
  const c = [
    payload?.order_id, payload?.order?.id, payload?.sale_id, payload?.sale?.id,
    payload?.id, payload?.data?.order_id, payload?.data?.order?.id,
    payload?.data?.sale_id, payload?.data?.sale?.id, payload?.data?.id,
  ];
  for (const x of c) {
    if (typeof x === 'string' && x.trim()) return x;
    if (typeof x === 'number') return String(x);
  }
  return null;
}

// Insert tolérant — ne fait jamais planter le webhook
async function safeInsert(supabaseAdmin: any, table: string, data: any, label: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from(table).insert(data);
    if (error) {
      console.error(`[chariow] ⚠️ Insert ${label} échoué:`, error.message, '| code:', error.code);
    } else {
      console.log(`[chariow] ✅ Insert ${label} OK`);
    }
  } catch (e: any) {
    console.error(`[chariow] ⚠️ Exception insert ${label}:`, e?.message || e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log('=== [chariow] WEBHOOK REÇU ===');

    const userIdFromQuery = req.nextUrl.searchParams.get('userId');
    const emailFromQuery = req.nextUrl.searchParams.get('email');
    console.log('[chariow] Query — userId:', userIdFromQuery, '| email:', emailFromQuery);

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Log payload pour debug
    console.log('[chariow] PAYLOAD:', JSON.stringify(payload).slice(0, 3000));

    const email = extractEmail(payload) || emailFromQuery?.toLowerCase().trim() || null;
    if (!email) {
      console.error('[chariow] ❌ Aucun email');
      return NextResponse.json({ error: 'No email', success: false }, { status: 200 });
    }

    // ✅ Ignorer les emails de test Chariow
    if (email.endsWith('@example.com') || email.startsWith('test@')) {
      console.log('[chariow] ⏭️ Email de test ignoré:', email);
      return NextResponse.json({ success: true, ignored: true, reason: 'test_email' }, { status: 200 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    let userId: string | null = null;
    let currentPlan: PlanId = 'free';
    let currentCredits = 0;

    // Priorité 1 : userId depuis query
    if (userIdFromQuery) {
      const { data: p } = await supabaseAdmin
        .from('profiles').select('id, email, plan, credits_balance')
        .eq('id', userIdFromQuery).maybeSingle();
      if (p?.id) {
        userId = p.id;
        currentPlan = (p.plan as PlanId) || 'free';
        currentCredits = p.credits_balance || 0;
        console.log('[chariow] User via query userId:', userId);
      }
    }

    // Priorité 2 : email dans profiles
    if (!userId) {
      const { data: p } = await supabaseAdmin
        .from('profiles').select('id, email, plan, credits_balance')
        .ilike('email', email).maybeSingle();
      if (p?.id) {
        userId = p.id;
        currentPlan = (p.plan as PlanId) || 'free';
        currentCredits = p.credits_balance || 0;
        console.log('[chariow] User via email:', userId);
      }
    }

    const rechargeCredits = detectRechargePack(payload);
    const plan = detectPlan(payload);
    const orderId = extractOrderId(payload);
    const productName = extractProductName(payload);

    console.log('[chariow] Détection:', { productName, rechargeCredits, plan, orderId, email, userId });

    // ─── CAS A : RECHARGE ───
    if (rechargeCredits) {
      if (!userId) {
        console.error('[chariow] ⚠️ Recharge sans compte:', email);
        return NextResponse.json(
          { success: false, error: 'Aucun compte MakeItAds pour cet email', email },
          { status: 200 }
        );
      }

      const newBalance = currentCredits + rechargeCredits;
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ credits_balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error('[chariow] ❌ Update balance échoué:', updateError.message);
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      console.log(`[chariow] ✅ Balance : ${currentCredits} → ${newBalance}`);

      await safeInsert(supabaseAdmin, 'credit_transactions', {
        user_id: userId,
        type: 'recharge',
        amount: rechargeCredits,
        balance_after: newBalance,
        description: `Recharge de ${rechargeCredits} crédits via Chariow (${orderId || 'order inconnu'})`,
      }, 'credit_transactions');

      const rechargePrice = RECHARGE_PRICES[rechargeCredits] || 0;
      await safeInsert(supabaseAdmin, 'revenue_transactions', {
        user_id: userId,
        email,
        plan_id: `recharge_${rechargeCredits}`,
        amount_fcfa: rechargePrice,
        source: 'chariow',
        order_id: orderId,
      }, 'revenue_transactions');

      return NextResponse.json({
        success: true, type: 'recharge', userId,
        creditsAdded: rechargeCredits, newBalance, revenue: rechargePrice,
      }, { status: 200 });
    }

    // ─── CAS B : PLAN ───
    if (plan) {
      console.log('[chariow] Plan détecté:', plan);

      if (!userId) {
        // ✅ On ne crée PLUS de user automatiquement.
        // L'user doit d'abord s'inscrire sur MakeItAds puis payer.
        console.warn('[chariow] ⚠️ Achat plan sans compte:', email);
        return NextResponse.json({
          success: false,
          error: 'Aucun compte MakeItAds pour cet email',
          email,
          hint: 'L\'utilisateur doit d\'abord s\'inscrire sur makeitads.pro',
        }, { status: 200 });
      }

      const planConfig = PRICING_CONFIG[plan];
      const monthlyCredits = planConfig.monthlyCredits;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

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
        console.error('[chariow] ❌ Update plan échoué:', updateError.message);
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      await safeInsert(supabaseAdmin, 'credit_transactions', {
        user_id: userId, type: 'purchase', amount: monthlyCredits,
        balance_after: monthlyCredits,
        description: `Achat du plan ${plan} via Chariow (${orderId || 'order inconnu'})`,
      }, 'credit_transactions');

      const planPrice = PLAN_PRICES[plan] || 0;
      await safeInsert(supabaseAdmin, 'revenue_transactions', {
        user_id: userId, email, plan_id: plan,
        amount_fcfa: planPrice, source: 'chariow', order_id: orderId,
      }, 'revenue_transactions');

      console.log(`[chariow] ✅ Plan ${plan} activé pour user ${userId}`);

      return NextResponse.json({
        success: true, type: 'plan', userId, plan,
        creditsAdded: monthlyCredits,
        expiresAt: expiresAt.toISOString(),
        revenue: planPrice,
      }, { status: 200 });
    }

    // ─── CAS C : inconnu ───
    console.warn('[chariow] ⚠️ Produit non reconnu:', productName);
    return NextResponse.json({
      success: false,
      error: 'Produit non reconnu',
      productName,
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[chariow] ❌ Exception:', message);
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Chariow MakeItAds opérationnel',
    timestamp: new Date().toISOString(),
  });
}