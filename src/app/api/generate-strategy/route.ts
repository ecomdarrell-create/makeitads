import { NextResponse } from "next/server";
import { strategyEngine } from "@/ai/strategyEngine";
import { BusinessProfile } from "@/ai/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log("🚀 [API] Requête de génération reçue");
  console.log("=".repeat(60));

  try {
    // ✅ Récupérer l'utilisateur connecté
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(" [API] Utilisateur non authentifié");
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { businessData } = body;

    console.log("📥 [API] Données reçues:", {
      name: businessData?.name || businessData?.businessName,
      industry: businessData?.industry,
      country: businessData?.country,
      budget: businessData?.budget,
      userId: user.id,
    });

    const profile: BusinessProfile = {
      name: businessData?.name || businessData?.businessName || "Business Inconnu",
      industry: businessData?.industry || "general",
      country: businessData?.country || "Global",
      budget: businessData?.budget || 2500,
      targetAudience: businessData?.targetAudience || "Grand public",
      goals: businessData?.goals || [],
      products: businessData?.products || [],
      services: businessData?.services || [],
      competitors: businessData?.competitors || [],
      marketingChannels: businessData?.marketingChannels || [],
      tone: businessData?.tone || "Professionnel",
      brandPositioning: businessData?.brandPositioning || "",
      additionalNotes: businessData?.description || "",
    };

    console.log("🔄 [API] Appel du StrategyEngine...");
    console.log(`   Provider actif: ${process.env.AI_PROVIDER || "mock"}`);

    const result = await strategyEngine.generateStrategy(profile);

    const duration = Date.now() - startTime;

    if (!result.success || !result.strategy) {
      console.error("❌ [API] Échec de la génération:", result.error);
      
      // ✅ Notification d'échec
      try {
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "warning",
          title: "️ Strategy generation failed",
          message: result.error || "An error occurred while generating your strategy. Please try again.",
          link: "/dashboard/strategies/new",
          is_read: false,
        });
      } catch (notifError) {
        console.error("Failed to create error notification:", notifError);
      }

      return NextResponse.json(
        {
          success: false,
          error: result.error || "Échec de la génération",
          provider: result.provider,
        },
        { status: 500 }
      );
    }

    console.log("✅ [API] Stratégie générée avec succès");
    console.log(`   Provider: ${result.provider}`);
    console.log(`   Durée: ${duration}ms`);
    console.log("=".repeat(60) + "\n");

    // ✅ Notification de succès (sera reçue en realtime)
    try {
      const businessName = businessData?.name || businessData?.businessName || "Your business";
      const industry = businessData?.industry || "your industry";
      
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "success",
        title: "🎉 Strategy generated successfully",
        message: `Your ${industry} strategy for ${businessName} is ready. View targeting, campaigns, and recommendations.`,
        link: "/dashboard/strategies",
        is_read: false,
      });
      console.log("🔔 [API] Notification de succès créée");
    } catch (notifError) {
      console.error("Failed to create success notification:", notifError);
    }

    return NextResponse.json({
      success: true,
      strategy: result.strategy,
      provider: result.provider,
      duration,
    });

  } catch (error: any) {
    console.error("💥 [API] Erreur critique:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}