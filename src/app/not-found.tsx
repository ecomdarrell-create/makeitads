import Link from 'next/link';
import { Home, ArrowRight, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-4 py-12 sm:py-16">
      {/* Fond décoratif */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[400px] sm:h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px] sm:blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] sm:w-[800px] h-[350px] sm:h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[100px] sm:blur-[120px]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto text-center">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center mb-6 sm:mb-10 text-base sm:text-xl font-semibold tracking-tight text-[#18181B] transition-transform hover:scale-105"
        >
          MakeIt<span className="text-[#6366F1]">Ads</span>
        </Link>

        {/* Code 404 */}
        <div className="mb-3 sm:mb-6">
          <p
            className="text-[80px] sm:text-[120px] md:text-[160px] font-bold leading-none text-[#6366F1]"
            style={{
              opacity: 0.12,
              fontWeight: 900,
              letterSpacing: '-0.05em',
            }}
          >
            404
          </p>
        </div>

        {/* Titre */}
        <h1 className="mb-2 sm:mb-3 text-lg sm:text-2xl md:text-3xl font-semibold leading-tight text-[#18181B] px-2">
          Cette page s&apos;est <span className="text-[#6366F1]">perdue</span> en chemin.
        </h1>

        {/* Sous-titre */}
        <p className="mb-6 sm:mb-10 max-w-xs sm:max-w-md mx-auto text-xs sm:text-sm md:text-base text-[#71717A] leading-relaxed px-2">
          La page que tu cherches n&apos;existe pas ou a été déplacée. Voici
          quelques raccourcis pour retrouver ton chemin.
        </p>

        {/* Boutons */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#6366F1] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md sm:shadow-lg shadow-[#6366F1]/25 transition-all hover:bg-[#5558e6] hover:scale-[1.02]"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Retour à l&apos;accueil
          </Link>

          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[#18181B] transition-all hover:bg-gray-50"
          >
            Accéder au Dashboard
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="border-t border-gray-100 pt-6 sm:pt-8">
          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
            Liens utiles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-[#71717A] transition-colors hover:text-[#6366F1]"
            >
              <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Voir les tarifs
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-[#71717A] transition-colors hover:text-[#6366F1]"
            >
              <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Comment ça marche
            </Link>
            <Link
              href="/#faq"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-[#71717A] transition-colors hover:text-[#6366F1]"
            >
              <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              FAQ
            </Link>
            <a
              href="https://t.me/MakeitAds_CEO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-[#71717A] transition-colors hover:text-[#6366F1]"
            >
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Contacter l&apos;équipe
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}