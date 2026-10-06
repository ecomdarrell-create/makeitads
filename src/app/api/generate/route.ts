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
import { hasFeature, normalizePlanId } from '@/config/pricing.config';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

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

    // Logique admin : accès total
    const isAdmin = user.email === 'ecomdarrell@gmail.com';

    const profile = await ensureUserProfile(user);

    const effectivePlan: PlanTier = isAdmin
      ? 'enterprise'
      : (normalizePlanId(profile?.plan) as PlanTier);
    const creditsBalance = isAdmin ? 9999 : profile?.credits_balance || 0;

    const { strategyType, formData } = await req.json();

    if (
      !['flash', 'complete'].includes(strategyType) ||
      !formData ||
      typeof formData !== 'object'
    ) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
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

    // La stratégie complète est réservée aux plans Pro et supérieurs
    if (strategyType === 'complete' && !hasFeature(effectivePlan, 'pro')) {
      return NextResponse.json(
        { error: 'Cette option est réservée au plan Pro ou supérieur.' },
        { status: 403 }
      );
    }

    // ─── Calcul du coût en crédits (centralisé) ───
    const creditAction =
      strategyType === 'complete' ? 'STRATEGIE_COMPLETE' : 'DIAGNOSTIC_FLASH';
    const creditCost = CREDIT_COSTS[creditAction];

    if (!isAdmin && creditsBalance < creditCost) {
      return NextResponse.json(
        { error: 'Crédits insuffisants. Passez au Plan Pro pour continuer.' },
        { status: 402 }
      );
    }

    // Contexte des stratégies antérieures pour éviter la répétition
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

    // Réservation des crédits (sauf admin)
    let reservation = null;
    if (!isAdmin) {
      reservation = await reserveCredits(
        user.id,
        creditAction,
        undefined,
        creditCost
      );
      if (!reservation) {
        return NextResponse.json(
          { error: 'Erreur de réservation des crédits' },
          { status: 500 }
        );
      }
    }

    try {
      // ─── Construction du system prompt selon le type ET le plan ───
      const basePrompt = getSystemPrompt(strategyType, effectivePlan);

      // ─── Contexte additionnel selon le plan ───
      const planContext =
        effectivePlan === 'free'
          ? "\n\nNIVEAU D'OFFRE : Démo. Fournis uniquement un diagnostic concis et actionnable. N'inclus aucun contenu réservé aux plans payants."
          : effectivePlan === 'pro'
            ? "\n\nNIVEAU D'OFFRE : Pro. Fournis une stratégie opérationnelle complète avec scripts, budget, guide créatif et KPIs."
            : effectivePlan === 'premium'
              ? "\n\nNIVEAU D'OFFRE : Premium. Approfondis l'analyse concurrentielle, l'audience et les angles de croissance long terme."
              : "\n\nNIVEAU D'OFFRE : Élite. Fournis une stratégie complète de niveau agence avec recommandations consulting, plan de formation et accompagnement avancé.";

      const dataIntegrityContext = `\n\nGARDE-FOUS :
- Utilise précisément l'activité, l'offre, le pays, l'audience et l'objectif fournis. Ne remplace pas ces données par un exemple standard.
- Ne fabrique aucun chiffre de ventes, ROAS, taux de conversion, taille de marché ou résultat observé. Si une donnée manque, formule une hypothèse clairement signalée.
- La stratégie doit être distincte des stratégies précédentes ci-dessous : change réellement l'angle, les arguments et les recommandations lorsque le brief le permet.
- Identifiant de cette génération : ${generationId}.

STRATÉGIES ANTÉRIEURES DU COMPTE (à ne pas recopier) :
${priorStrategyContext || 'Aucune stratégie antérieure.'}`;

      const systemPrompt = basePrompt + planContext + dataIntegrityContext;

      const contextualFormData = {
        ...formData,
        generationId,
        plan: effectivePlan,
        instruction:
          'Construis une recommandation spécifique à ces informations et distincte des stratégies antérieures.',
      };

      // ─── Sélection du schéma selon le type ET le plan ───
      const schema = getSchema(strategyType, effectivePlan);

      console.log(`Génération ${strategyType} pour plan ${effectivePlan}`);

      const aiResult = await generateStrategy(
        DEFAULT_AI_CONFIG,
        systemPrompt,
        contextualFormData,
        schema
      );

      // Nettoyage de la plateforme (évite l'erreur 22P02 Supabase)
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
        console.error('Erreur Supabase (Insert Strategy):', strategyError);
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

      return NextResponse.json({
        success: true,
        data: aiResult,
        strategyId: strategy.id,
        creditsRemaining: finalBalance,
      });
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : 'Erreur inconnue';
      console.error('Erreur IA:', message);

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
    console.error('Erreur API globale:', message);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}