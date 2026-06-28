import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessData } = body;

    console.log("🧪 TEST REÇU:", JSON.stringify(businessData));

    // On retourne des données de test fixes pour vérifier que tout fonctionne
    const mockStrategy = {
      businessName: businessData?.name || "Nom par défaut",
      industry: businessData?.industry || "general",
      targetAudience: businessData?.targetAudience || "Tout le monde",
      competitors: [
        {
          name: "Concurrent A",
          website: "concurrent-a.com",
          country: businessData?.country || "FR",
          estimatedTraffic: 120000,
          marketPosition: "Leader",
          seoVisibility: 87,
          topChannels: ["Google", "Meta"],
          mainOffer: "Service Premium",
          strengths: ["Marque forte"],
          weaknesses: ["Prix élevé"],
          uniqueSellingProposition: "Qualité supérieure",
          customerSentiment: "positive",
          growthScore: 78,
          trendScore: 65,
          competitiveThreat: "high",
          advertisingActivity: { googleAds: true, metaAds: true, linkedinAds: false, tiktokAds: false }
        }
      ],
      marketAnalysis: {
        marketSize: "$50M",
        growthRate: 12.5,
        trends: ["Tendance 1", "Tendance 2"],
        opportunities: ["Opportunité 1"],
        threats: ["Menace 1"],
        customerPainPoints: ["Douleur 1"],
        buyingMotivations: ["Motivation 1"]
      },
      recommendations: [
        { category: "positioning", priority: "high", title: "Recommandation Test", description: "Focus sur la qualité", expectedImpact: "+25%", effort: "medium", confidence: 85 }
      ],
      roadmap: [
        { month: 1, title: "Phase 1", actions: ["Action 1"], expectedResults: "Résultat 1", kpis: ["KPI 1"] }
      ],
      creativeAngles: [
        { hook: "Hook Test", headline: "Titre Test", primaryText: "Texte Test", cta: "Cliquez ici", visualDirection: "Style Test", targetPersona: "Persona Test", platform: "meta" }
      ],
      budgetAllocation: {
        totalBudget: 2500,
        channels: [
          { name: "Meta Ads", percentage: 40, amount: 1000, rationale: "Bon ROI" },
          { name: "Google Ads", percentage: 35, amount: 875, rationale: "Intentions fortes" }
        ]
      }
    };

    return NextResponse.json({ 
      success: true, 
      strategy: mockStrategy,
      source: "TEST_LOCAL" 
    });
  } catch (error: any) {
    console.error(" ERREUR TEST:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}