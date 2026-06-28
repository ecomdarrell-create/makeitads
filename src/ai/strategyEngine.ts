import { BusinessProfile, StrategyResult } from "./types";
import { aiGateway } from "./gateway";

export class StrategyEngine {
  async generateStrategy(profile: BusinessProfile): Promise<{
    success: boolean;
    strategy: StrategyResult | null;
    error?: string;
    provider: string;
    duration?: number;
  }> {
    const startTime = Date.now();
    
    console.log("\n" + "─".repeat(60));
    console.log("🚀 [Engine] Démarrage de la génération");
    console.log("─".repeat(60));
    console.log(`   Business: ${profile.name}`);
    console.log(`   Industry: ${profile.industry}`);
    console.log(`   Country: ${profile.country}`);
    console.log(`   Budget: $${profile.budget}`);
    console.log(`   Target: ${profile.targetAudience}`);
    console.log(`   Goals: ${profile.goals?.join(", ") || "Aucun"}`);

    try {
      console.log("\n🔄 [Engine] Appel du Gateway...");
      const response = await aiGateway.generateStrategy(profile);

      const duration = Date.now() - startTime;

      if (!response.success) {
        console.error("\n❌ [Engine] Le Gateway a échoué:");
        console.error(`   Provider: ${response.provider}`);
        console.error(`   Erreur: ${response.error}`);
        console.error(`   Durée: ${duration}ms`);
        
        return {
          success: false,
          strategy: null,
          error: response.error,
          provider: response.provider,
          duration,
        };
      }

      console.log("\n✅ [Engine] Stratégie reçue du Gateway");
      console.log(`   Provider: ${response.provider}`);
      console.log(`   Durée totale: ${duration}ms`);
      
      if (response.strategy) {
        console.log(`   Sections générées: ${Object.keys(response.strategy).length}`);
        console.log(`   → overview: ${response.strategy.overview ? "✅" : "❌"}`);
        console.log(`   → market: ${response.strategy.market ? "✅" : "❌"}`);
        console.log(`   → competitors: ${response.strategy.competitors?.length || 0} items`);
        console.log(`   → audience: ${response.strategy.audience ? "✅" : "❌"}`);
        console.log(`   → personas: ${response.strategy.personas?.length || 0} items`);
        console.log(`   → campaigns: ${response.strategy.campaigns?.length || 0} items`);
        console.log(`   → creative: ${response.strategy.creative ? "✅" : ""}`);
        console.log(`   → analytics: ${response.strategy.analytics ? "✅" : ""}`);
        console.log(`   → roadmap: ${response.strategy.roadmap?.length || 0} items`);
        console.log(`   → recommendations: ${response.strategy.recommendations?.length || 0} items`);
        console.log(`   → aiRecommendation: ${response.strategy.aiRecommendation ? "✅" : "❌"}`);
      }

      console.log("─".repeat(60) + "\n");

      return {
        success: true,
        strategy: response.strategy,
        provider: response.provider,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error("\n💥 [Engine] Erreur inattendue:");
      console.error(`   Message: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
      console.error(`   Durée: ${duration}ms`);
      console.log("─".repeat(60) + "\n");
      
      return {
        success: false,
        strategy: null,
        error: error.message || "Erreur inattendue",
        provider: "unknown",
        duration,
      };
    }
  }

  async generateAndSave(
    profile: BusinessProfile,
    saveCallback: (strategy: StrategyResult) => Promise<string>
  ): Promise<{
    success: boolean;
    strategyId?: string;
    error?: string;
  }> {
    console.log("\n💾 [Engine] Mode generateAndSave activé");
    
    const result = await this.generateStrategy(profile);

    if (!result.success || !result.strategy) {
      console.error("❌ [Engine] Impossible de sauvegarder: génération échouée");
      return {
        success: false,
        error: result.error || "Échec de la génération",
      };
    }

    try {
      console.log("💾 [Engine] Sauvegarde de la stratégie...");
      const strategyId = await saveCallback(result.strategy);
      console.log(`✅ [Engine] Stratégie sauvegardée avec ID: ${strategyId}`);

      return {
        success: true,
        strategyId,
      };
    } catch (error: any) {
      console.error("❌ [Engine] Échec de la sauvegarde:", error.message);
      return {
        success: false,
        error: `Génération réussie mais sauvegarde échouée: ${error.message}`,
      };
    }
  }
}

// Instance singleton
export const strategyEngine = new StrategyEngine();