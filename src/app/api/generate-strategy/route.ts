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
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("🚫 [API] Utilisateur non authentifié");
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    // 1️⃣ VÉRIFIER LE PLAN DE L'UTILISATEUR
    // ⚠️ Remplace "profiles" par le nom réel de ta table (ex: "users" ou "subscriptions")
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const userPlan = userData?.plan || "free";
    
    // 2️⃣ DÉCIDER DU PROVIDER
    const isPaidUser = ["pro", "premium", "enterprise"].includes(userPlan);
    const targetProvider = isPaidUser ? "claude" : "groq";

    console.log(`👤 [API] Utilisateur: ${user.id} | Plan: ${userPlan} | Provider ciblé: ${targetProvider.toUpperCase()}`);

    const body = await req.json();
    const { businessData } = body;

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

    console.log(`🔄 [API] Appel du StrategyEngine...`);

    // 3️⃣ APPELER LE MOTEUR AVEC LE PROVIDER CHOISI
    const result = await strategyEngine.generateStrategy(profile, targetProvider);

    const duration = Date.now() - startTime;

    if (!result.success || !result.strategy) {
      console.error("❌ [API] Échec de la génération:", result.error);
      
      try {
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "warning",
          title: "⚠️ Strategy generation failed",
          message: result.error || "An error occurred. Please try again.",
          link: "/dashboard/strategies/new",
          is_read: false,
        });
      } catch (notifError) {
        console.error("Failed to create error notification:", notifError);
      }

      return NextResponse.json(
        { success: false, error: result.error || "Échec de la génération", provider: result.provider },
        { status: 500 }
      );
    }

    console.log(`✅ [API] Stratégie générée avec succès via ${result.provider} en ${duration}ms`);
    console.log("=".repeat(60) + "\n");

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
    } catch (notifError) {
      console.error("Failed to create success notification:", notifError);
    }

    return NextResponse.json({
      success: true,
      strategy: result.strategy,
      provider: result.provider, // Le frontend recevra "claude" ou "groq"
      duration,
    });

  } catch (error: any) {
    console.error("💥 [API] Erreur critique:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}