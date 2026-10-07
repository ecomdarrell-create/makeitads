import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import {
  generateStrategy,
  getSystemPrompt,
  getSchema,
  DEFAULT_AI_CONFIG,
  type PlanTier,
} from '@/lib/ai/provider';
import {
  reserveCredits,
  confirmReservation,
  refundCredits,
  CREDIT_COSTS,
} from '@/lib/credits/manager';
import { normalizePlanId, PRICING_CONFIG, type PlanId } from '@/config/pricing.config';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

const ADMIN_EMAILS = [
  'ecomdarrell@gmail.com',
  'darrellkamga@gmail.com',
];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const isAdmin = user.email
      ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
      : false;

    const profile = await ensureUserProfile(user);

    const effectivePlan: PlanTier = isAdmin
      ? 'enterprise'
      : (normalizePlanId(profile?.plan) as PlanTier);

    let creditsBalance = isAdmin ? 9999 : profile?.credits_balance || 0;

    console.log(`[generate] User=${user.email} Admin=${isAdmin} Plan=${effectivePlan} Credits=${creditsBalance}`);

    // Auto-refill si plan payant avec 0 crédits (protection bug)
    if (!isAdmin && effectivePlan !== 'free' && creditsBalance === 0) {
      const planCredits = PRICING_CONFIG[effectivePlan as PlanId]?.monthlyCredits || 0;
      if (planCredits > 0) {
        console.log(`[generate] AUTO-REFILL: ${planCredits} crédits pour ${user.email}`);
        await supabase
          .from('profiles')
          .update({
            credits_balance: planCredits,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        creditsBalance = planCredits;
      }
    }

    const { strategyType, formData } = await req.json();

    if (
      !['flash', 'complete'].includes(strategyType) ||
      !formData ||
      typeof formData !== 'object'
    ) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════
    // RESTRICTION PAR PLAN : Free → Flash uniquement / Pro+ → Complète uniquement
    // ═══════════════════════════════════════════════════════════
    if (effectivePlan === 'free' && strategyType === 'complete') {
      return NextResponse.json(
        {
          error: 'Les stratégies complètes sont réservées aux plans Pro et supérieurs.',
          code: 'PLAN_RESTRICTION',
        },
        { status: 403 }
      );
    }

    if (effectivePlan !== 'free' && strategyType === 'flash') {
      return NextResponse.json(
        {
          error: 'Votre plan donne accès aux stratégies complètes. Le mode Flash est réservé au plan Démo.',
          code: 'PLAN_RESTRICTION',
        },
        { status: 403 }
      );
    }

    // Validation des champs obligatoires
    const requiredFields = [
      'companyName',
      'companyDescription',
      'sector',
      'mainProduct',
      'idealClient',
      'country',
      'mainCountry',
      'mainObjective',
    ];

    if (
      requiredFields.some(
        (field) =>
          typeof formData[field] !== 'string' || !formData[field].trim()
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Renseignez les champs obligatoires du brief : entreprise, offre, audience, pays et objectif.',
        },
        { status: 400 }
      );
    }

    const creditAction =
      strategyType === 'complete' ? 'STRATEGIE_COMPLETE' : 'DIAGNOSTIC_FLASH';
    const creditCost = CREDIT_COSTS[creditAction];

    console.log(`[generate] Type=${strategyType} Coût=${creditCost} Solde=${creditsBalance}`);

    if (!isAdmin && creditsBalance < creditCost) {
      console.warn(`[generate] INSUFFISANT: ${creditsBalance} < ${creditCost}`);
      return NextResponse.json(
        {
          error: `Crédits insuffisants. Il vous reste ${creditsBalance} crédit${creditsBalance > 1 ? 's' : ''} mais cette génération en coûte ${creditCost}.`,
          creditsBalance,
          creditCost,
          code: 'INSUFFICIENT_CREDITS',
        },
        { status: 402 }
      );
    }

    // Contexte stratégies antérieures
    const { data: previousStrategies } = await supabase
      .from('strategies')
      .select('title, type, platform, data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const priorStrategyContext = (previousStrategies || [])
      .map(
        (strategy, index) =>
          `${index + 1}. ${strategy.title} (${strategy.type}, ${
            strategy.platform || 'plateforme non précisée'
          }): ${JSON.stringify(strategy.data).slice(0, 1200)}`
      )
      .join('\n');

    const generationId = randomUUID();

    let reservation = null;
    if (!isAdmin) {
      reservation = await reserveCredits(
        user.id,
        creditAction,
        undefined,
        creditCost
      );
      if (!reservation) {
        console.error('[generate] Erreur réservation crédits');
        return NextResponse.json(
          { error: 'Erreur de réservation des crédits' },
          { status: 500 }
        );
      }
      console.log('[generate] Crédits réservés:', reservation);
    }

    try {
      const basePrompt = getSystemPrompt(strategyType, effectivePlan);

      const planContext =
        effectivePlan === 'free'
          ? "\n\nNIVEAU D'OFFRE : Démo. Fournis uniquement un diagnostic concis et actionnable."
          : effectivePlan === 'pro'
            ? "\n\nNIVEAU D'OFFRE : Pro. Fournis une stratégie opérationnelle complète."
            : effectivePlan === 'premium'
              ? "\n\nNIVEAU D'OFFRE : Premium. Approfondis l'analyse concurrentielle et les angles."
              : "\n\nNIVEAU D'OFFRE : Élite. Fournis une stratégie complète de niveau agence.";

      const dataIntegrityContext = `\n\nGARDE-FOUS :
- Utilise précisément l'activité, l'offre, le pays, l'audience et l'objectif fournis.
- Ne fabrique aucun chiffre de ventes, ROAS, taux de conversion.
- Identifiant de cette génération : ${generationId}.

STRATÉGIES ANTÉRIEURES (à ne pas recopier) :
${priorStrategyContext || 'Aucune stratégie antérieure.'}`;

      const systemPrompt = basePrompt + planContext + dataIntegrityContext;

      const contextualFormData = {
        ...formData,
        generationId,
        plan: effectivePlan,
      };

      const schema = getSchema(strategyType, effectivePlan);

      console.log(`[generate] Appel DeepSeek — ${strategyType} / ${effectivePlan}`);

      const aiResult = await generateStrategy(
        DEFAULT_AI_CONFIG,
        systemPrompt,
        contextualFormData,
        schema
      );

      console.log('[generate] Réponse IA OK');

      const safePlatform =
        formData.platform &&
        typeof formData.platform === 'string' &&
        formData.platform.trim() !== ''
          ? formData.platform.trim()
          : null;

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

      if (strategyError || !strategy) {
        console.error('[generate] Erreur Supabase:', strategyError);
        throw new Error(
          `Erreur sauvegarde stratégie: ${
            strategyError?.message || 'aucune stratégie retournée'
          }`
        );
      }

      if (!isAdmin && reservation) {
        await confirmReservation(
          user.id,
          reservation.transactionId,
          strategy.id
        );
      }

      const finalBalance = isAdmin ? 9999 : creditsBalance - creditCost;

      console.log(`[generate] SUCCESS — Balance finale: ${finalBalance}`);

      return NextResponse.json({
        success: true,
        data: aiResult,
        strategyId: strategy.id,
        creditsRemaining: finalBalance,
        creditsCost: creditCost,
      });
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : 'Erreur inconnue';
      console.error('[generate] Erreur IA:', message);

      if (!isAdmin && reservation) {
        await refundCredits(
          user.id,
          creditCost,
          'Génération échouée - Remboursement automatique'
        );
      }

      return NextResponse.json(
        {
          error:
            message ||
            "Erreur lors de la génération. Aucun crédit n'a été consommé.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[generate] Erreur globale:', message);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}