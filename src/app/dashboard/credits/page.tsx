import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

function CreditRing({ value, total, label, color, detail }: { value: number; total: number; label: string; color: string; detail: string }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;
  const dashOffset = circumference * (1 - percentage);

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="relative h-[68px] w-[68px] shrink-0" aria-label={`${label}: ${value}`}>
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="7" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">{value}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-900 sm:text-xs">{label}</p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

export default async function CreditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const creditsBalance = profile?.credits_balance || 0;
  const totalUsed = transactions
    ?.filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
  const totalAdded = transactions
    ?.filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const breakdown = {
    strategies: transactions?.filter(t => t.type === 'generation_complete').reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0,
    diagnostics: transactions?.filter(t => t.type === 'generation_flash').reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0,
    welcome: transactions?.filter(t => t.type === 'welcome_bonus').reduce((sum, t) => sum + t.amount, 0) || 0,
  };
  const totalActivity = creditsBalance + totalUsed + totalAdded;
  const totalConsumption = breakdown.strategies + breakdown.diagnostics;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      {/* En-tête avec bouton Recharger */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
            Vos crédits
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Gérez votre solde et consultez l&apos;historique.
          </p>
        </div>

        <Link
          href="/dashboard/credits/recharge"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6] sm:text-xs flex-shrink-0"
        >
          <Coins className="h-3.5 w-3.5" />
          Recharger des crédits
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-5">
        <CreditRing value={creditsBalance} total={totalActivity} label="Solde actuel" detail="Crédits disponibles" color="#6366F1" />
        <CreditRing value={totalUsed} total={totalActivity} label="Total utilisé" detail="Crédits consommés" color="#E11D48" />
        <CreditRing value={totalAdded} total={totalActivity} label="Total ajouté" detail="Crédits reçus" color="#059669" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-5">
        <h2 className="text-xs sm:text-sm font-semibold text-[#111827] mb-3">
          Répartition de votre consommation
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <CreditRing value={breakdown.strategies} total={totalConsumption} label="Stratégies complètes" detail="Crédits consommés" color="#6366F1" />
          <CreditRing value={breakdown.diagnostics} total={totalConsumption} label="Diagnostics flash" detail="Crédits consommés" color="#8B5CF6" />
          <CreditRing value={breakdown.welcome} total={Math.max(breakdown.welcome, 10)} label="Bonus de bienvenue" detail="Crédits attribués" color="#059669" />
        </div>
      </div>

      {profile?.plan === 'free' && (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-[#111827] mb-1">
                Besoin de plus de crédits ?
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-700 mb-2.5">
                Rechargez un pack de crédits ou passez au plan Pro pour recevoir 50 crédits renouvelés chaque mois.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard/credits/recharge"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors"
                >
                  Recharger maintenant
                </Link>
                <Link
                  href="/dashboard/pricing"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium text-[#6366F1] bg-white border border-[#6366F1]/30 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Voir les plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-gray-100">
          <h2 className="text-xs sm:text-sm font-semibold text-[#111827]">
            Historique des transactions
          </h2>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-3 py-2.5 sm:px-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-[#111827] mb-0.5">
                      {getTransactionLabel(transaction.type)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {transaction.description && (
                      <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[10px] sm:text-xs font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} crédits
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
                      Solde : {transaction.balance_after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-6 sm:px-4 sm:py-8 text-center">
            <p className="text-[10px] sm:text-xs text-gray-600">
              Aucune transaction pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getTransactionLabel(type: string): string {
  const labels: Record<string, string> = {
    'welcome_bonus': 'Crédits de bienvenue',
    'monthly_quota': 'Crédits mensuels',
    'purchase': 'Achat de crédits',
    'generation_flash': 'Diagnostic flash',
    'generation_complete': 'Stratégie complète',
    'refund': 'Remboursement',
    'adjustment': 'Ajustement',
  };
  return labels[type] || type;
}