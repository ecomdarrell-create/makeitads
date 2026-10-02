import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default async function StrategiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: strategies } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="text-lg sm:text-xl font-semibold text-[#111827] mb-1">
          Toutes vos stratégies
        </h1>
        <p className="text-xs text-gray-600">
          Retrouvez l'ensemble de vos stratégies générées.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filtres
        </button>
      </div>

      {strategies && strategies.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {strategies.map((strategy) => (
              <Link
                key={strategy.id}
                href={`/dashboard/strategies/${strategy.id}`}
                className="block px-3 py-3 sm:px-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-[#111827] mb-0.5">
                      {strategy.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {strategy.type === 'flash' ? 'Diagnostic' : 'Stratégie'}
                      </span>
                      {strategy.platform && (
                        <>
                          <span className="text-gray-300 text-[9px]">•</span>
                          <span className="text-[10px] text-gray-600">{strategy.platform}</span>
                        </>
                      )}
                      <span className="text-gray-300 text-[9px]">•</span>
                      <span className="text-[10px] text-gray-600">
                        {strategy.credits_cost} crédit{strategy.credits_cost > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-500">
                      {new Date(strategy.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
          <p className="text-xs text-gray-600 mb-2">
            Vous n'avez encore créé aucune stratégie.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors"
          >
            Créer ma première stratégie →
          </Link>
        </div>
      )}
    </div>
  );
}