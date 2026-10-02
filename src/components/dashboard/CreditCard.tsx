import Link from 'next/link';

interface CreditCardProps {
  balance: number;
  creditsUsed: number;
  plan: string;
}

export function CreditCard({ balance, creditsUsed, plan }: CreditCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-1">Votre solde</h2>
          <p className="text-3xl font-semibold text-[#111827]">
            {balance} <span className="text-base font-normal text-gray-600">crédits</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {creditsUsed} crédits utilisés ce mois-ci
          </p>
        </div>
        {plan === 'free' && (
          <Link
            href="/pricing"
            className="px-3 py-1.5 text-xs font-medium text-[#6366F1] bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
          >
            Upgrader
          </Link>
        )}
      </div>
      <div className="flex gap-2">
        <Link
          href="/dashboard/generate"
          className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium text-white bg-[#6366F1] rounded hover:bg-[#5558e6] transition-colors text-center"
        >
          Utiliser des crédits
        </Link>
        <Link
          href="/dashboard/credits"
          className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center"
        >
          Voir l'historique
        </Link>
      </div>
    </div>
  );
}