import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { StrategyResult } from '@/components/strategy/StrategyResult';

interface StrategyPageProps {
  params: {
    id: string;
  };
}

export default async function StrategyPage({ params }: StrategyPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: strategy } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!strategy) {
    notFound();
  }

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <BackButton href="/dashboard/strategies" label="Retour aux stratégies" />

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          {strategy.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-600">
          <span className="uppercase tracking-wider font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
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

      {/* Contenu de la stratégie via le nouveau composant premium */}
      <StrategyResult strategy={strategy} strategyType={strategy.type} />
    </div>
  );
}