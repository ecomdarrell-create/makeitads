import Link from 'next/link';

interface ActionCardsProps {
  creditsBalance: number;
}

export function ActionCards({ creditsBalance }: ActionCardsProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[#111827] mb-3">
        Que voulez-vous faire ?
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Stratégie complète */}
        <Link
          href="/dashboard/generate?type=complete"
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-[#6366F1] transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#111827]">Nouvelle stratégie</h3>
            <span className="text-xs font-medium text-[#6366F1]">5 crédits</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Construisez une stratégie publicitaire complète adaptée à votre entreprise.
          </p>
          <span className="text-xs font-medium text-[#6366F1]">
            Créer une stratégie →
          </span>
        </Link>

        {/* Diagnostic Flash */}
        <Link
          href="/dashboard/generate?type=flash"
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-[#6366F1] transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#111827]">Diagnostic Flash</h3>
            <span className="text-xs font-medium text-[#6366F1]">1 crédit</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Identifiez rapidement les principaux problèmes de votre approche publicitaire.
          </p>
          <span className="text-xs font-medium text-[#6366F1]">
            Lancer le diagnostic →
          </span>
        </Link>
      </div>
    </div>
  );
}