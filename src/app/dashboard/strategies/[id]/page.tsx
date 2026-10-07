import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { StrategyResult } from '@/components/strategy/StrategyResult';
import { DownloadPDFButton } from '@/components/strategy/pdf/DownloadPDFButton';
import { normalizePlanId, PLAN_LABELS } from '@/config/pricing.config';
import type { PlanTier } from '@/config/strategy-sections.config';

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

  const { data: strategy } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!strategy) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = user.email === 'ecomdarrell@gmail.com';
  const normalizedPlan = normalizePlanId(profile?.plan);
  const userPlan: PlanTier = isAdmin
    ? 'enterprise'
    : (normalizedPlan as PlanTier);

  const planLabel = PLAN_LABELS[userPlan] || 'Démo';

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
      <BackButton href="/dashboard/strategies" label="Retour aux stratégies" />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
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

        <DownloadPDFButton
          strategy={{
            title: strategy.title,
            type: strategy.type,
            platform: strategy.platform,
            created_at: strategy.created_at,
            data: strategy.data,
          }}
          userPlan={userPlan}
          planLabel={planLabel}
        />
      </div>

      <StrategyResult
        strategy={strategy}
        strategyType={strategy.type}
        userPlan={userPlan}
      />
    </div>
  );
}