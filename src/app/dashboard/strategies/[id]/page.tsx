import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { StrategyResult } from '@/components/strategy/StrategyResult';
import { normalizePlanId } from '@/config/pricing.config';
import type { PlanTier } from '@/config/strategy-sections.config';

// ============================================
// Next.js 15+ : params est une Promise
// ============================================

interface StrategyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StrategyPage({ params }: StrategyPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Récupération de la stratégie
  const { data: strategy } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!strategy) {
    notFound();
  }

  // Récupération du plan de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();

  // Bypass admin
  const isAdmin = user.email === 'ecomdarrell@gmail.com';
  const userPlan: PlanTier = isAdmin
    ? 'enterprise'
    : (normalizePlanId(profile?.plan) as PlanTier);

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Back Button */}
      <BackButton href="/dashboard/strategies" label="Retour aux stratégies" />

      {/* Header */}
      <div className="mb-5">
        <h1 className="mb-1 text-base font-semibold text-[#111827] sm:text-lg">
          {strategy.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:text-xs">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium uppercase tracking-wider text-gray-500">
            {strategy.type === 'flash' ? 'Diagnostic' : 'Stratégie complète'}
          </span>
          {strategy.platform && (
            <>
              <span className="text-gray-300">•</span>
              <span>{strategy.platform}</span>
            </>
          )}
          <span className="text-gray-300">•</span>
          <span>
            {new Date(strategy.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Contenu de la stratégie */}
      <StrategyResult
        strategy={strategy}
        strategyType={strategy.type}
        userPlan={userPlan}
      />
    </div>
  );
}