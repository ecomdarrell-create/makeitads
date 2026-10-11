import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import { generateStrategy, getSystemPrompt, getSchema, DEFAULT_AI_CONFIG, type PlanTier } from '@/lib/ai/provider';
import { reserveCredits, confirmReservation, refundCredits, CREDIT_COSTS } from '@/lib/credits/manager';
import { normalizePlanId, PRICING_CONFIG, type PlanId } from '@/config/pricing.config';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

const ADMIN_EMAILS = ['ecomdarrell@gmail.com', 'darrellkamga@gmail.com'];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false;
    const profile = await ensureUserProfile(user);
    const effectivePlan: PlanTier = isAdmin ? 'enterprise' : (normalizePlanId(profile?.plan) as PlanTier);
    let creditsBalance = isAdmin ? 9999 : profile?.credits_balance || 0;

    // ✅ Devise du user (fallback XOF)
    const userCurrencyCode = profile?.currency || 'XOF';
    const userCurrency = normalizeCurrency(userCurrencyCode);
    const userCurrencySymbol = getCurrencySymbol(userCurrencyCode);

    const userFirstName = profile?.first_name || user.email?.split('@')[0] || 'toi';

    console.log(`[generate] User=${user.email} Admin=${isAdmin} Plan=${effectivePlan} Credits=${creditsBalance} Currency=${userCurrency} (${userCurrencySymbol})`);

    if (!isAdmin && effectivePlan !== 'free' && creditsBalance === 0) {
      const planCredits = PRICING_CONFIG[effectivePlan as PlanId]?.monthlyCredits || 0;
      if (planCredits > 0) {
        await supabase.from('profiles').update({ credits_balance: planCredits, updated_at: new Date().toISOString() }).eq('id', user.id);
        creditsBalance = planCredits;
      }
    }

    const { strategyType, formData } = await req.json();
    if (!['flash', 'complete'].includes(strategyType) || !formData || typeof formData !== 'object') {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // ✅ RÈGLE : Plan payant → Complète uniquement
    if (effectivePlan !== 'free' && strategyType === 'flash') {
      return NextResponse.json(
        {
          error: 'Votre plan donne accès aux stratégies complètes uniquement. Le diagnostic Flash est réservé au plan Démo.',
          code: 'PLAN_RESTRICTION',
        },
        { status: 403 }
      );
    }

    const requiredFields = ['companyName', 'companyDescription', 'sector', 'mainProduct', 'idealClient', 'country', 'mainCountry', 'mainObjective'];
    if (requiredFields.some((field) => typeof formData[field] !== 'string' || !formData[field].trim())) {
      return NextResponse.json({ error: 'Renseignez les champs obligatoires du brief.' }, { status: 400 });
    }

    const creditAction = strategyType === 'complete' ? 'STRATEGIE_COMPLETE' : 'DIAGNOSTIC_FLASH';
    const creditCost = CREDIT_COSTS[creditAction];

    if (!isAdmin && creditsBalance < creditCost) {
      return NextResponse.json({
        error: `Crédits insuffisants. Il vous reste ${creditsBalance} crédit${creditsBalance > 1 ? 's' : ''} mais cette génération en coûte ${creditCost}.`,
        creditsBalance,
        creditCost,
        code: 'INSUFFICIENT_CREDITS',
      }, { status: 402 });
    }

    const { data: previousStrategies } = await supabase
      .from('strategies')
      .select('title, type, platform, data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    const priorStrategyContext = (previousStrategies || [])
      .map((strategy, index) => `${index + 1}. ${strategy.title} (${strategy.type}): ${JSON.stringify(strategy.data).slice(0, 1200)}`)
      .join('\n');

    const generationId = randomUUID();

    let reservation = null;
    if (!isAdmin) {
      reservation = await reserveCredits(user.id, creditAction, undefined, creditCost);
      if (!reservation) return NextResponse.json({ error: 'Erreur de réservation des crédits' }, { status: 500 });
    }

    try {
      // ✅ PROMPT SYSTÈME AVEC DEVISE DYNAMIQUE
      const basePrompt = getSystemPrompt(strategyType, effectivePlan, userCurrency, userCurrencySymbol);

      const planContext =
        effectivePlan === 'free' ? "\n\nNIVEAU D'OFFRE : Démo."
        : effectivePlan === 'pro' ? "\n\nNIVEAU D'OFFRE : Pro."
        : effectivePlan === 'premium' ? "\n\nNIVEAU D'OFFRE : Premium."
        : "\n\nNIVEAU D'OFFRE : Élite.";

      const dataIntegrityContext = `\n\nGARDE-FOUS :\n- Utilise précisément les données fournies.\n- Toutes les valeurs monétaires dans la devise ${userCurrencySymbol}.\n- Identifiant : ${generationId}.\n\nSTRATÉGIES ANTÉRIEURES :\n${priorStrategyContext || 'Aucune.'}`;

      const systemPrompt = basePrompt + planContext + dataIntegrityContext;

      const contextualFormData = {
        ...formData,
        generationId,
        plan: effectivePlan,
        userFirstName,
        currency: userCurrency,
        currencySymbol: userCurrencySymbol,
      };
      const schema = getSchema(strategyType, effectivePlan);

      const aiResult = await generateStrategy(DEFAULT_AI_CONFIG, systemPrompt, contextualFormData, schema);

      const safePlatform = formData.platform && typeof formData.platform === 'string' && formData.platform.trim() !== '' ? formData.platform.trim() : null;

      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          title: (formData.companyName || 'Stratégie générée').trim(),
          type: strategyType,
          platform: safePlatform,
          status: 'completed',
          credits_cost: isAdmin ? 0 : creditCost,
          data: aiResult,
        })
        .select()
        .single();

      if (strategyError || !strategy) throw new Error(`Erreur sauvegarde: ${strategyError?.message || 'aucune'}`);

      if (!isAdmin && reservation) await confirmReservation(user.id, reservation.transactionId, strategy.id);

      const finalBalance = isAdmin ? 9999 : creditsBalance - creditCost;
      console.log(`[generate] SUCCESS — Balance: ${finalBalance}`);

      return NextResponse.json({
        success: true,
        data: aiResult,
        strategyId: strategy.id,
        creditsRemaining: finalBalance,
        creditsCost: creditCost,
      });
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : 'Erreur inconnue';
      if (!isAdmin && reservation) await refundCredits(user.id, creditCost, 'Génération échouée');
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[generate] Erreur globale:', message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}