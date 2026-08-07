import { BusinessProfile, GatewayResponse } from "./types";
import { callGroqProvider } from "./providers/groq";
import { callClaudeProvider } from "./providers/claude";

export const strategyEngine = {
  async generateStrategy(profile: BusinessProfile, forcedProvider?: string): Promise<GatewayResponse> {
    const startTime = Date.now();
    
    // Détermine le provider : celui forcé par l'API, sinon celui de l'env, sinon fallback sur groq
    const provider = (forcedProvider || process.env.AI_PROVIDER || "groq") as "groq" | "claude" | "mock";

    console.log(`🧠 [StrategyEngine] Provider actif pour cette requête : ${provider.toUpperCase()}`);

    try {
      let strategyResult: any = null;
      const apiKey = provider === "claude" ? process.env.ANTHROPIC_API_KEY : process.env.GROQ_API_KEY;
      
      if (provider === "claude") {
        strategyResult = await callClaudeProvider(profile, apiKey || "");
      } else {
        // Fallback sur ton provider actuel (Groq)
        strategyResult = await callGroqProvider(profile, apiKey || "");
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        provider: provider as any,
        strategy: strategyResult,
        duration,
      };
    } catch (error: any) {
      console.error(`💥 [StrategyEngine] Erreur critique avec ${provider}:`, error);
      
      // 🛡️ Sécurité : Si Claude échoue, on fallback silencieusement sur Groq pour ne pas perdre l'utilisateur
      if (provider === "claude") {
        console.warn("⚠️ [StrategyEngine] Fallback automatique sur Groq suite à une erreur Claude...");
        try {
          const fallbackStrategy = await callGroqProvider(profile, process.env.GROQ_API_KEY || "");
          return {
            success: true,
            provider: "groq",
            strategy: fallbackStrategy,
            duration: Date.now() - startTime,
          };
        } catch (fallbackError: any) {
          console.error("💥 [StrategyEngine] Le fallback Groq a aussi échoué:", fallbackError);
          return {
            success: false,
            provider: "groq",
            strategy: null,
            error: fallbackError.message || "Échec de la génération de la stratégie (Fallback échoué)",
          };
        }
      }
      
      return {
        success: false,
        provider: provider as any,
        strategy: null,
        error: error.message || "Échec de la génération de la stratégie",
      };
    }
  }
};