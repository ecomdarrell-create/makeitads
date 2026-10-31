import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateStrategy, getSystemPrompt, getSchema, DEFAULT_AI_CONFIG, type PlanTier } from '@/lib/ai/provider';
import { reserveCredits, confirmReservation, refundCredits, CREDIT_COSTS } from '@/lib/credits/manager';
import { normalizePlanId } from '@/config/pricing.config';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';
import { randomUUID } from 'node:crypto';

// ✅ CRUCIAL : Force Next.js 16 à utiliser Node.js (évite le crash des SDK IA)
export const runtime = 'nodejs';
export const maxDuration = 60; // Autorise jusqu'à 60s de génération

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const profile = await ensureUserProfile(user);
    const effectivePlan: PlanTier = normalizePlanId(profile?.plan) as PlanTier;
    let creditsBalance = profile?.credits_balance || 0;

    const userCurrencyCode = profile?.currency || 'XOF';
    const userCurrency = normalizeCurrency(userCurrencyCode);
    const userCurrencySymbol = getCurrencySymbol(userCurrencyCode);
    const userFirstName = profile?.first_name || user.email?.split('@')[0] || 'toi';

    const { strategyType, formData } = await req.json();
    if (!['flash', 'complete'].includes(strategyType) || !formData || typeof formData !== 'object') {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    if (effectivePlan !== 'free' && strategyType === 'flash') {
      return NextResponse.json({ error: 'Le diagnostic Flash est réservé au plan Démo.', code: 'PLAN_RESTRICTION' }, { status: 403 });
    }

    const requiredFields = ['companyName', 'companyDescription', 'sector', 'mainProduct', 'idealClient', 'country', 'mainObjective'];
    if (requiredFields.some((field) => typeof formData[field] !== 'string' || !formData[field].trim())) {
      return NextResponse.json({ error: 'Renseignez les champs obligatoires du brief.' }, { status: 400 });
    }

    const creditAction = strategyType === 'complete' ? 'STRATEGIE_COMPLETE' : 'DIAGNOSTIC_FLASH';
    const creditCost = CREDIT_COSTS[creditAction];

    if (creditsBalance < creditCost) {
      return NextResponse.json({
        error: `Crédits insuffisants. Il vous reste ${creditsBalance} crédit(s).`,
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

    const reservation = await reserveCredits(user.id, creditAction, undefined, creditCost);
    if (!reservation) {
      return NextResponse.json({ error: 'Erreur de réservation des crédits.' }, { status: 402 });
    }

    try {
      const basePrompt = getSystemPrompt(strategyType, effectivePlan, userCurrency, userCurrencySymbol);
      const planContext = `\n\nNIVEAU D'OFFRE : ${effectivePlan.toUpperCase()}.`;
      const dataIntegrityContext = `\n\nGARDE-FOUS :\n- Identifiant : ${generationId}.\n\nSTRATÉGIES ANTÉRIEURES :\n${priorStrategyContext || 'Aucune.'}`;
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

      // ✅ APPEL IA
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
          credits_cost: creditCost,
          data: aiResult,
        })
        .select()
        .single();

      if (strategyError || !strategy) throw new Error(`Erreur sauvegarde: ${strategyError?.message || 'aucune'}`);

      await confirmReservation(user.id, reservation.transactionId, strategy.id);

      return NextResponse.json({
        success: true,
        data: aiResult,
        strategyId: strategy.id,
        creditsRemaining: creditsBalance - creditCost,
        creditsCost: creditCost,
      });
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : 'Erreur inconnue';
      console.error('🚨 Erreur génération IA:', message);
      await refundCredits(user.id, creditCost, 'Génération échouée');
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('🚨 Erreur globale API generate:', message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}