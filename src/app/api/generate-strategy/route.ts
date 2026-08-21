import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 1. Vérifier les crédits et le plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, quota_remaining")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    if ((profile.quota_remaining || 0) <= 0) {
      return NextResponse.json({ error: "CRÉDITS_INSUFFISANTS" }, { status: 402 });
    }

    const { formData } = await req.json();
    const plan = (profile.plan || "free").toLowerCase();

    // 2. RÉSERVER LE CRÉDIT (Débit immédiat)
    await supabase
      .from("profiles")
      .update({ quota_remaining: profile.quota_remaining - 1 })
      .eq("id", user.id);

    // 3. Construire le Prompt Structuré
    const prompt = `Tu es un expert en stratégie marketing digital spécialisé sur le marché africain francophone.
Tu dois générer une stratégie publicitaire JSON stricte basée sur le contexte suivant fourni par l'utilisateur :

[CONTEXTE BUSINESS]
- Entreprise : ${formData.businessName} (${formData.sector === 'Autre' ? formData.customSector : formData.sector})
- Description : ${formData.businessDescription}
- Offre : ${formData.offerName} (${formData.offerType})
- Prix : ${formData.offerPrice} ${formData.offerCurrency}
- Proposition de valeur : ${formData.valueProposition}

[CONTEXTE AUDIENCE & MARCHÉ]
- Client idéal : ${formData.audienceDescription}
- Âge : ${formData.ageUnknown ? 'Non spécifié' : `${formData.ageMin} - ${formData.ageMax} ans`}
- Genre : ${formData.gender}
- Problème résolu : ${formData.mainProblem}
- Désir principal : ${formData.mainDesire}
- Pays ciblés : ${formData.countries.join(', ')}
- Zone : ${formData.geoZone} ${formData.geoZone === 'Villes spécifiques' ? `(${formData.cities.join(', ')})` : ''}
- Langue : ${formData.language}

[CONTEXTE STRATÉGIQUE]
- Objectif : ${formData.mainObjective}
- Budget : ${formData.budgetUnknown ? 'À déterminer' : `${formData.budget} ${formData.offerCurrency} / ${formData.budgetPeriod}`}
- Concurrents : ${formData.noCompetitors ? 'Aucun connu' : `${formData.mainCompetitor} ${formData.otherCompetitors.length > 0 ? 'et ' + formData.otherCompetitors.join(', ') : ''}`}
- Avantage concurrent perçu : ${formData.competitorAdvantage || 'Non spécifié'}
- Plateformes : ${formData.unknownPlatform ? 'À déterminer par l\'expert' : formData.platforms.join(', ')}
- Statut : ${formData.campaignStatus} ${formData.campaignIssues ? `(${formData.campaignIssues})` : ''}

[RÈGLES ABSOLUES]
1. Langue : Français professionnel, persuasif et adapté au marché local (FCFA, Mobile Money, WhatsApp).
2. Format : UNIQUEMENT un objet JSON valide. Pas de markdown, pas de texte avant/après.
3. Structure JSON requise :
{
  "canal_recommande": "Nom du canal + justification stratégique en 1 phrase",
  "audience_cible": {
    "lieux": ["Villes/Pays"],
    "age_min": number,
    "age_max": number,
    "sexe": "Femmes/Hommes/Tous",
    "interets": ["intérêt1", "intérêt2"],
    "comportements": ["comportement1"]
  },
  "copies_publicitaires": [
    { "angle": "Nom de l'angle", "texte_principal": "...", "titre": "...", "cta": "..." }
  ],
  "recommandations_creatives": {
    "format": "Format recommandé",
    "idees": ["idée1", "idée2"],
    "outils": "Outil suggéré"
  },
  "analyse_concurrentielle": {
    "concurrent": "Nom",
    "points_faibles": ["point1"],
    "opportunites": ["opportunite1"]
  }
}

[ADAPTATION SELON LE PLAN UTILISATEUR : ${plan}]
- Si le plan est 'free' ou 'startup' : Génère 1 seule copie publicitaire et une analyse concurrentielle succincte.
- Si le plan est 'pro' ou 'business' ou 'premium' : Génère EXACTEMENT 3 copies publicitaires (Angle Douleur/Solution, Angle Preuve Sociale, Angle Offre Directe) et une analyse concurrentielle détaillée.
- Si le plan est 'enterprise' : Génère 3 copies très détaillées, une analyse concurrentielle approfondie, et ajoute une clé "calendrier_editorial" avec 4 idées de publications.`;

    // 4. Appel à Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Modèle le plus performant pour la stratégie
      max_tokens: 4000,
      temperature: 0.7,
      system: "Tu es un assistant JSON strict. Tu ne réponds qu'avec un objet JSON valide, sans backticks.",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const strategyData = JSON.parse(cleanJson);

    // 5. Sauvegarde en base
    const { data: strategy, error: insertError } = await supabase
      .from("strategies")
      .insert({
        user_id: user.id,
        business_name: formData.businessName,
        industry: formData.sector === 'Autre' ? formData.customSector : formData.sector,
        data: strategyData,
        plan_used: plan,
        status: "ready",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, strategyId: strategy.id });

  } catch (error: any) {
    console.error("Erreur génération:", error);
    
    // En cas d'erreur technique, on RESTITUE le crédit
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('increment_quota', { user_id: user.id, count: 1 }); 
        // Note: si tu n'as pas de fonction RPC 'increment_quota', fais un update classique ici
      }
    } catch (e) { console.error("Erreur restitution crédit", e); }

    return NextResponse.json({ error: "ÉCHEC_GÉNÉRATION" }, { status: 500 });
  }
}