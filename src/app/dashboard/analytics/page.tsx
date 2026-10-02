import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingUp, Target, Zap, Calendar } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: strategies } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalStrategies = strategies?.length || 0;
  const flashCount = strategies?.filter(s => s.type === 'flash').length || 0;
  const completeCount = strategies?.filter(s => s.type === 'complete').length || 0;
  const totalCreditsUsed = transactions
    ?.filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentStrategies = strategies?.filter(s => 
    new Date(s.created_at) >= thirtyDaysAgo
  ) || [];

  const recentTransactions = transactions?.filter(t => 
    new Date(t.created_at) >= thirtyDaysAgo
  ) || [];

  const weeklyActivity = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const weekStrategies = recentStrategies.filter(s => {
      const date = new Date(s.created_at);
      return date >= weekStart && date < weekEnd;
    }).length;

    return {
      week: `Semaine ${4 - i}`,
      strategies: weekStrategies,
    };
  }).reverse();

  const maxWeeklyStrategies = Math.max(...weeklyActivity.map(w => w.strategies), 1);

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Analytics
        </h1>
        <p className="text-[10px] sm:text-xs text-gray-600">
            Activité MakeItAds enregistrée. Les résultats publicitaires ne sont pas mesurés sans connexion aux plateformes de campagne.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="text-[9px] font-medium text-gray-600">Stratégies</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#111827]">{totalStrategies}</p>
          <p className="text-[8px] text-gray-500 mt-0.5">
            {recentStrategies.length} sur les 30 derniers jours
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[9px] font-medium text-gray-600">Diagnostics</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#111827]">{flashCount}</p>
          <p className="text-[8px] text-gray-500 mt-0.5">
            {Math.round((flashCount / Math.max(totalStrategies, 1)) * 100)}% du total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[9px] font-medium text-gray-600">Stratégies</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#111827]">{completeCount}</p>
          <p className="text-[8px] text-gray-500 mt-0.5">
            {Math.round((completeCount / Math.max(totalStrategies, 1)) * 100)}% du total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[9px] font-medium text-gray-600">Crédits utilisés</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#111827]">{totalCreditsUsed}</p>
          <p className="text-[8px] text-gray-500 mt-0.5">
            Depuis votre inscription
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-5">
        <h2 className="text-xs sm:text-sm font-semibold text-[#111827] mb-3">
          Activité des 4 dernières semaines
        </h2>
        <div className="space-y-2.5">
          {weeklyActivity.map((week, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] text-gray-600 w-16 flex-shrink-0">
                {week.week}
              </span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                  style={{ width: `${(week.strategies / maxWeeklyStrategies) * 100}%` }}
                >
                  {week.strategies > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-semibold text-white">
                      {week.strategies}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {recentStrategies.length === 0 && (
          <p className="text-[10px] text-gray-500 text-center mt-3">
            Aucune activité récente. Commencez par créer votre première stratégie.
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-5">
        <h2 className="text-xs sm:text-sm font-semibold text-[#111827] mb-3">
          Répartition des actions
        </h2>
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs text-gray-700">Stratégies complètes</span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#111827]">{completeCount}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366F1] rounded-full transition-all duration-500"
                style={{ width: `${(completeCount / Math.max(totalStrategies, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs text-gray-700">Diagnostics flash</span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#111827]">{flashCount}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${(flashCount / Math.max(totalStrategies, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
        <h2 className="text-xs sm:text-sm font-semibold text-[#111827] mb-1.5">
          Votre activité
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
          {totalStrategies === 0 ? (
            <>Vous n'avez pas encore créé de stratégie. Commencez dès maintenant.</>
            ) : totalStrategies < 5 ? (
            <>Vous avez créé {totalStrategies} stratégie{totalStrategies > 1 ? 's' : ''}. Ce total correspond à votre historique MakeItAds.</>
          ) : (
            <>Votre historique contient {totalStrategies} stratégies. Aucune performance de campagne n’est déduite de ce total.</>
          )}
        </p>
      </div>
    </div>
  );
}