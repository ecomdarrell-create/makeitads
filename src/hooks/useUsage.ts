import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useSession } from './useSession';
import { usePlan } from './usePlan';

// ❌ SUPPRIMÉ : const supabase = createClient(); (au niveau module)

export interface UsageData {
  strategiesUsed: number;
  strategiesLimit: number;
  pdfExportsUsed: number;
  pdfExportsLimit: number;
  canGenerateStrategy: boolean;
  canExportPdf: boolean;
}

export function useUsage() {
  const { user } = useSession();
  const { isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [usage, setUsage] = useState<UsageData>({
    strategiesUsed: 0,
    strategiesLimit: 1,
    pdfExportsUsed: 0,
    pdfExportsLimit: 0,
    canGenerateStrategy: true,
    canExportPdf: true,
  });
  const [loading, setLoading] = useState(true);

  // Calculer planType à partir des booléens
  const planType = isEnterprise ? 'enterprise' : isPremium ? 'premium' : isPro ? 'pro' : 'free';

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user, isFree, isPro, isPremium, isEnterprise]);

  const loadUsage = async () => {
    if (!user) return;

    // ✅ CRÉÉ ICI, DANS LA FONCTION
    const supabase = createClient();

    setLoading(true);
    try {
      // Compter les stratégies générées ce mois-ci
      const { data: strategiesData, error: strategiesError } = await supabase
        .rpc('get_monthly_usage', {
          p_user_id: user.id,
          p_action_type: 'strategy_generation',
        });

      // Compter les exports PDF ce mois-ci
      const { data: pdfData, error: pdfError } = await supabase
        .rpc('get_monthly_usage', {
          p_user_id: user.id,
          p_action_type: 'pdf_export',
        });

      const strategiesUsed = strategiesData || 0;
      const pdfExportsUsed = pdfData || 0;

      // Déterminer les limites selon le plan
      let strategiesLimit = 1;
      let pdfExportsLimit = 0;

      if (planType === 'free') {
        strategiesLimit = 1;
        pdfExportsLimit = 0;
      } else if (planType === 'pro') {
        strategiesLimit = 10;
        pdfExportsLimit = 10;
      } else if (planType === 'premium' || planType === 'enterprise') {
        strategiesLimit = -1; // -1 = illimité
        pdfExportsLimit = -1;
      }

      const canGenerateStrategy = strategiesLimit === -1 || strategiesUsed < strategiesLimit;
      const canExportPdf = pdfExportsLimit === -1 || pdfExportsUsed < pdfExportsLimit;

      setUsage({
        strategiesUsed,
        strategiesLimit,
        pdfExportsUsed,
        pdfExportsLimit,
        canGenerateStrategy,
        canExportPdf,
      });
    } catch (error) {
      console.error('Error loading usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordUsage = async (actionType: string, metadata: any = {}) => {
    if (!user) return;

    // ✅ CRÉÉ ICI, DANS LA FONCTION
    const supabase = createClient();

    try {
      await supabase.from('usage').insert({
        user_id: user.id,
        action_type: actionType,
        metadata,
      });

      // Recharger les données d'usage
      await loadUsage();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  return {
    usage,
    loading,
    recordUsage,
    refreshUsage: loadUsage,
  };
}