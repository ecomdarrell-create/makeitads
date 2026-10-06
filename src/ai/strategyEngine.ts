import { BusinessProfile, GatewayResponse } from "./types";
import { callClaudeProvider } from "./providers/claude";

export const strategyEngine = {
  async generateStrategy(profile: BusinessProfile, _forcedProvider?: string): Promise<GatewayResponse> {
    const startTime = Date.now();
    const provider = 'claude' as const;
    void _forcedProvider;

    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY non configurée');
      const strategyResult = await callClaudeProvider(profile, apiKey);
      const duration = Date.now() - startTime;

      return {
        success: true,
        provider,
        strategy: strategyResult,
        duration,
      };
    } catch (error: unknown) {
      console.error('Échec de la génération Claude:', error);
      return {
        success: false,
        provider,
        strategy: null,
        error: error instanceof Error ? error.message : "Échec de la génération de la stratégie",
      };
    }
  }
};