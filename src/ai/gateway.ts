import { AIProvider, BusinessProfile, GatewayResponse, StrategyResult } from "./types";
import { callMockProvider } from "./providers/mock";
import { callGeminiProvider } from "./providers/gemini";
import { callOpenAIProvider } from "./providers/openai";
import { callGroqProvider } from "./providers/groq";

export class AIGateway {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || (process.env.AI_PROVIDER as AIProvider) || "mock";
    console.log(`🔧 [Gateway] Initialisé avec provider: ${this.provider}`);
    console.log(`   Clé OpenAI: ${process.env.OPENAI_API_KEY ? "✅ configurée" : "❌ manquante"}`);
    console.log(`   Clé Gemini: ${process.env.GEMINI_API_KEY ? "✅ configurée" : "❌ manquante"}`);
    console.log(`   Clé Groq: ${process.env.GROQ_API_KEY ? "✅ configurée" : "❌ manquante"}`);
  }

  async generateStrategy(profile: BusinessProfile): Promise<GatewayResponse> {
    const startTime = Date.now();
    
    console.log("\n🔌 [Gateway] Appel du provider: " + this.provider);
    console.log(`   Business: ${profile.name}`);
    console.log(`   Industry: ${profile.industry}`);

    try {
      let strategy: StrategyResult;

      switch (this.provider) {
        case "mock":
          console.log("   → 📦 Mock Provider (aucune API externe)");
          strategy = await callMockProvider(profile);
          break;

        case "gemini":
          const geminiKey = process.env.GEMINI_API_KEY;
          if (!geminiKey) {
            throw new Error("GEMINI_API_KEY non configurée dans .env.local");
          }
          console.log("   →  Gemini API (gemini-2.0-flash-lite)");
          strategy = await callGeminiProvider(profile, geminiKey);
          break;

        case "openai":
          const openaiKey = process.env.OPENAI_API_KEY;
          if (!openaiKey) {
            throw new Error("OPENAI_API_KEY non configurée dans .env.local");
          }
          console.log("   →  OpenAI API (gpt-4o-mini)");
          strategy = await callOpenAIProvider(profile, openaiKey);
          break;

        case "groq":
          const groqKey = process.env.GROQ_API_KEY;
          if (!groqKey) {
            throw new Error("GROQ_API_KEY non configurée dans .env.local");
          }
          console.log("   → ⚡ Groq API (llama-3.3-70b-versatile)");
          strategy = await callGroqProvider(profile, groqKey);
          break;

        default:
          throw new Error(`Provider inconnu: ${this.provider}`);
      }

      const duration = Date.now() - startTime;
      
      console.log(`\n✅ [Gateway] Succès via ${this.provider}`);
      console.log(`   Durée: ${duration}ms`);
      console.log(`   Sections: ${Object.keys(strategy).length}`);

      return {
        success: true,
        provider: this.provider,
        strategy,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.error(`\n❌ [Gateway] Échec avec ${this.provider}:`);
      console.error(`   Erreur: ${error.message}`);
      console.error(`   Durée: ${duration}ms`);
      
      // Fallback automatique vers Mock en cas d'erreur
      if (this.provider !== "mock") {
        console.log("\n🔄 [Gateway] Tentative de fallback vers Mock...");
        try {
          const fallbackStrategy = await callMockProvider(profile);
          const fallbackDuration = Date.now() - startTime;
          
          console.log(`✅ [Gateway] Fallback Mock réussi en ${fallbackDuration}ms`);
          
          return {
            success: true,
            provider: "mock", // ✅ Corrigé : juste "mock" au lieu de "openai (fallback: mock)"
            strategy: fallbackStrategy,
            duration: fallbackDuration,
          };
        } catch (fallbackError: any) {
          console.error(`❌ [Gateway] Fallback Mock échoué: ${fallbackError.message}`);
        }
      }

      return {
        success: false,
        provider: this.provider,
        strategy: null,
        error: error.message || "Échec du provider",
        duration,
      };
    }
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  setProvider(provider: AIProvider): void {
    console.log(`🔄 [Gateway] Changement de provider: ${this.provider} → ${provider}`);
    this.provider = provider;
  }
}

// Instance singleton
export const aiGateway = new AIGateway();