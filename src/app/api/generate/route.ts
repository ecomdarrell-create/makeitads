import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import { generateStrategy, getSystemPrompt, FlashDiagnosticSchema, CompleteStrategySchema, DEFAULT_AI_CONFIG } from '@/lib/ai/provider';
import { reserveCredits, confirmReservation, refundCredits, CREDIT_COSTS } from '@/lib/credits/manager';
import { hasFeature, normalizePlanId } from '@/config/pricing.config';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 🛡️ LOGIQUE ADMIN : Accès total pour ton email
    const isAdmin = user.email === 'ecomdarrell@gmail.com';
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, credits_balance')
      .eq('id', user.id)
      .single();

    const effectivePlan = isAdmin ? 'enterprise' : normalizePlanId(profile?.plan);
    const creditsBalance = isAdmin ? 9999 : (profile?.credits_balance || 0);

    const { strategyType, formData } = await req.json();
    if (!['flash', 'complete'].includes(strategyType) || !formData || typeof formData !== 'object') {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    if (['companyName', 'sector', 'mainObjective'].some((field) =>
      typeof formData[field] !== 'string' || !formData[field].trim()
    )) {
      return NextResponse.json(
        { error: 'Renseignez le nom de l’entreprise, le secteur et l’objectif avant de générer.' },
        { status: 400 }
      );
    }

    if (strategyType === 'complete' && !hasFeature(effectivePlan, 'pro')) {
      return NextResponse.json(
        { error: 'Cette option est réservée au plan Pro ou supérieur.' },
        { status: 403 }
      );
    }

    const creditAction = strategyType === 'complete' ? 'STRATEGIE_COMPLETE' : 'DIAGNOSTIC_FLASH';
    const creditCost = CREDIT_COSTS[creditAction];

    // Vérification des crédits (ignorée si admin)
    if (!isAdmin && creditsBalance < creditCost) {
      return NextResponse.json(
        { error: 'Crédits insuffisants. Passez au Plan Pro pour continuer.' },
        { status: 402 }
      );
    }

    const { data: previousStrategies } = await supabase
      .from('strategies')
      .select('title, type, platform, data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const priorStrategyContext = (previousStrategies || []).map((strategy, index) =>
      `${index + 1}. ${strategy.title} (${strategy.type}, ${strategy.platform || 'plateforme non précisée'}): ${JSON.stringify(strategy.data).slice(0, 1200)}`
    ).join('\n');
    const generationId = randomUUID();

    // Réservation des crédits (ignorée si admin)
    let reservation = null;
    if (!isAdmin) {
      reservation = await reserveCredits(user.id, creditAction);
      if (!reservation) {
        return NextResponse.json({ error: 'Erreur de réservation des crédits' }, { status: 500 });
      }
    }

    try {
      // 🧠 INJECTION DU CONTEXTE DE PLAN DANS LE PROMPT POUR BRIDER L'IA
      const basePrompt = getSystemPrompt(strategyType);
      const planContext = effectivePlan === 'free'
        ? "\n\nNIVEAU D'OFFRE : Démo. Donne uniquement un diagnostic concis et utile; ne prétends pas fournir les fonctions payantes."
        : effectivePlan === 'pro'
          ? "\n\nNIVEAU D'OFFRE : Pro. Fournis des conseils concrets à partir du brief, avec scripts et budget de test explicitement présentés comme des propositions."
          : effectivePlan === 'premium'
            ? "\n\nNIVEAU D'OFFRE : Premium. Approfondis le ciblage, les angles créatifs, les tests et les pistes concurrentielles uniquement si les données du brief les étayent."
            : "\n\nNIVEAU D'OFFRE : Élite. Fournis une stratégie approfondie et priorisée pour l'activité et son contexte d'équipe ou de marchés multiples lorsqu'ils sont renseignés.";

      const dataIntegrityContext = `\n\nGARDE-FOUS :\n- Utilise précisément l'activité, l'offre, le pays, l'audience et l'objectif fournis; ne remplace pas ces données par un exemple standard.\n- Ne fabrique aucun chiffre de ventes, ROAS, taux de conversion, taille de marché ou résultat observé. Si une donnée manque, dis-le et formule une hypothèse clairement signalée.\n- La stratégie doit être distincte des stratégies précédentes ci-dessous: change réellement l'angle, les arguments et les recommandations lorsque le brief le permet.\n- Identifiant de cette génération: ${generationId}.\n\nSTRATÉGIES ANTÉRIEURES DU COMPTE (à ne pas recopier):\n${priorStrategyContext || 'Aucune stratégie antérieure.'}`;

      const systemPrompt = basePrompt + planContext + dataIntegrityContext;
      const contextualFormData = {
        ...formData,
        generationId,
        instruction: 'Construis une recommandation spécifique à ces informations et distincte des stratégies antérieures.',
      };

      // ✅ CORRECTION ZOD : Séparation explicite pour éviter l'erreur de type TypeScript
      let aiResult;
      if (strategyType === 'flash') {
        aiResult = await generateStrategy(
          DEFAULT_AI_CONFIG,
          systemPrompt,
          contextualFormData,
          FlashDiagnosticSchema
        );
      } else {
        aiResult = await generateStrategy(
          DEFAULT_AI_CONFIG,
          systemPrompt,
          contextualFormData,
          CompleteStrategySchema
        );
      }

      // Sauvegarde en BDD
      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          title: formData.companyName || 'Stratégie générée',
          type: strategyType,
          platform: formData.platform || null,
          status: 'completed',
          credits_cost: isAdmin ? 0 : creditCost,
          data: aiResult,
        })
        .select()
        .single();

      if (strategyError || !strategy) {
        throw new Error('Erreur sauvegarde stratégie');
      }

      // Confirmation du débit (ignorée si admin)
      if (!isAdmin && reservation) {
        await confirmReservation(user.id, reservation.transactionId, strategy.id);
      }

      const finalBalance = isAdmin ? 9999 : (creditsBalance - creditCost);

      return NextResponse.json({
        success: true,
        data: aiResult,
        strategyId: strategy.id,
        creditsRemaining: finalBalance,
      });

    } catch (aiError) {
      console.error('Erreur IA:', aiError);
      if (!isAdmin && reservation) {
        await refundCredits(user.id, creditCost, 'Génération échouée - Remboursement automatique');
      }
      return NextResponse.json(
        { error: 'Erreur lors de la génération. Aucun crédit n\'a été consommé.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}