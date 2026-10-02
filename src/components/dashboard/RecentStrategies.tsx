import Link from 'next/link';

interface Strategy {
  id: string;
  title: string;
  type: string;
  platform: string | null;
  credits_cost: number;
  created_at: string;
}

interface RecentStrategiesProps {
  strategies: Strategy[];
}

export function RecentStrategies({ strategies }: RecentStrategiesProps) {
  if (strategies.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Vous n'avez encore créé aucune stratégie.</p>
        <Link href="/dashboard/generate" className="text-xs sm:text-sm font-medium text-[#6366F1] hover:text-[#5558e6]">
          Créer ma première stratégie →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">Vos dernières stratégies</h3>
        <Link href="/dashboard/strategies" className="text-[10px] sm:text-xs font-medium text-[#6366F1] hover:text-[#5558e6]">
          Voir tout →
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {strategies.map((strategy) => (
          <Link
            key={strategy.id}
            href={`/dashboard/strategies/${strategy.id}`}
            className="block px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-[#111827] truncate">{strategy.title}</h4>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {strategy.type === 'flash' ? 'Diagnostic' : 'Stratégie'}
                  </span>
                  {strategy.platform && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] sm:text-xs text-gray-600">{strategy.platform}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] sm:text-xs font-semibold text-[#6366F1]">{strategy.credits_cost} crédits</p>
                <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
                  {new Date(strategy.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}