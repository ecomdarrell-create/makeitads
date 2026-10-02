import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroActionCard() {
  return (
    <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl p-4 sm:p-5 shadow-sm">
      <h2 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 text-white">
        Construisez votre prochaine stratégie.
      </h2>
      <p className="text-xs sm:text-sm text-white mb-4 max-w-lg leading-relaxed">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds transforme ces informations en recommandations exploitables.
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link
          href="/dashboard/generate"
          className="inline-flex items-center gap-1.5 bg-white text-[#6366F1] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Créer une stratégie
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
        <Link
          href="/dashboard/resources#how-it-works"
          className="inline-flex items-center gap-1.5 bg-white/10 text-white border border-white/30 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Comment ça fonctionne
        </Link>
      </div>
    </div>
  );
}