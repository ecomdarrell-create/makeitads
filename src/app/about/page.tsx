import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { createClient } from "@/lib/supabase/server";
import { getCurrencySymbol, normalizeCurrency, type Currency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "À propos - MakeItAds",
  description: "Découvrez la mission de MakeItAds : démocratiser l'intelligence marketing en Afrique avec des stratégies publicitaires IA prêtes à l'emploi.",
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Person",
    "name": "Darrell Kamga",
    "jobTitle": "Fondateur & CEO",
    "worksFor": {
      "@type": "Organization",
      "name": "MakeItAds",
      "url": "https://makeitads.pro"
    }
  }
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currency: Currency = 'XOF';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('currency')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.currency) {
      currency = normalizeCurrency(profile.currency);
    }
  }

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

      <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
        <GlobalNavbar />

        {/* Hero */}
        <section className="relative z-10 px-5 pt-24 pb-10 sm:px-6 sm:pt-32 sm:pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#18181B] sm:mb-6 sm:text-4xl md:text-5xl">
              Rencontrez <span className="text-[#6366F1]">Darrell Kamga</span>
            </h1>
            <p className="mb-3 text-sm text-[#71717A] sm:mb-6 sm:text-lg">
              Fondateur & CEO de MakeItAds
            </p>
            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-[#71717A] sm:text-base">
              Construire l&apos;outil d&apos;intelligence marketing le plus pragmatique pour les entrepreneurs africains.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="relative z-10 border-y border-[#E7E7EB] bg-white px-5 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-8 sm:grid-cols-2 sm:gap-12">
              <div>
                <h2 className="mb-3 text-lg font-bold text-[#18181B] sm:mb-5 sm:text-2xl">
                  Notre <span className="text-[#6366F1]">mission</span>
                </h2>
                <p className="mb-3 text-xs leading-relaxed text-[#71717A] sm:mb-4 sm:text-base">
                  Offrir aux entrepreneurs africains une intelligence marketing de niveau entreprise, sans en payer le prix fort.
                </p>
                <p className="mb-3 text-xs leading-relaxed text-[#71717A] sm:mb-4 sm:text-base">
                  Trop longtemps, les PME ont gaspillé leur budget dans des campagnes basées sur l&apos;intuition, ou des outils occidentaux déconnectés de nos réalités.
                </p>
                <p className="text-xs leading-relaxed text-[#71717A] sm:text-base">
                  MakeItAds combine l&apos;IA avec une expertise locale pour produire des stratégies <strong className="text-[#18181B]">prêtes à l&apos;emploi</strong>, calibrées pour le marché africain.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E7EB] bg-[#F7F7F8] p-5 text-center sm:p-8">
                <h3 className="mb-2 text-base font-bold text-[#18181B] sm:text-xl">
                  Calibré pour l&apos;Afrique
                </h3>
                <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                  Budgets en {currencySymbol}, ciblage par villes locales et leviers de confiance adaptés (WhatsApp, paiement à la livraison).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="relative z-10 px-5 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-lg font-bold text-[#18181B] sm:mb-12 sm:text-3xl">
              Nos <span className="text-[#6366F1]">valeurs</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="rounded-2xl border border-[#E7E7EB] bg-white p-4 shadow-sm sm:p-6">
                <h3 className="mb-2 text-sm font-bold text-[#18181B] sm:text-base">
                  Exécution immédiate
                </h3>
                <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                  Pas de théorie. Chaque stratégie contient des textes prêts à copier, un ciblage précis et un guide visuel.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E7EB] bg-white p-4 shadow-sm sm:p-6">
                <h3 className="mb-2 text-sm font-bold text-[#18181B] sm:text-base">
                  Transparence totale
                </h3>
                <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                  Pas d&apos;abonnement caché. Vous achetez des crédits à l&apos;unité, vous les utilisez quand vous voulez.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E7EB] bg-white p-4 shadow-sm sm:p-6">
                <h3 className="mb-2 text-sm font-bold text-[#18181B] sm:text-base">
                  Obsession du résultat
                </h3>
                <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                  Chaque fonctionnalité vise un seul objectif : vous aider à acquérir des clients plus vite et moins cher.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Parcours */}
        <section className="relative z-10 border-y border-[#E7E7EB] bg-white px-5 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-lg font-bold text-[#18181B] sm:mb-12 sm:text-3xl">
              Notre <span className="text-[#6366F1]">parcours</span>
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/10 sm:h-11 sm:w-11">
                  <span className="text-xs font-bold text-[#6366F1] sm:text-sm">01</span>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-[#18181B] sm:mb-2 sm:text-base">
                    Le problème
                  </h3>
                  <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                    Trop d&apos;entrepreneurs brûlent leur budget en publicités lancées au hasard, sans stratégie claire.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/10 sm:h-11 sm:w-11">
                  <span className="text-xs font-bold text-[#6366F1] sm:text-sm">02</span>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-[#18181B] sm:mb-2 sm:text-base">
                    Le déclic
                  </h3>
                  <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                    Le problème n&apos;était pas le manque d&apos;outils, mais le manque d&apos;outils adaptés à notre marché.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/10 sm:h-11 sm:w-11">
                  <span className="text-xs font-bold text-[#6366F1] sm:text-sm">03</span>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-[#18181B] sm:mb-2 sm:text-base">
                    La solution
                  </h3>
                  <p className="text-xs leading-relaxed text-[#71717A] sm:text-sm">
                    MakeItAds rend l&apos;intelligence marché accessible à tous, via un simple achat de crédits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="relative z-10 px-5 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-lg font-bold text-[#18181B] sm:mb-5 sm:text-3xl">
              Restons en <span className="text-[#6366F1]">contact</span>
            </h2>
            <p className="mb-6 text-xs leading-relaxed text-[#71717A] sm:mb-10 sm:text-base">
              Une question sur MakeItAds ? Une idée de collaboration ? Écrivez-nous.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://www.linkedin.com/in/darrell-kamga-547b24275"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#004182] sm:w-auto sm:px-7 sm:py-3.5 sm:text-sm"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Me contacter sur LinkedIn
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
              </a>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E7EB] bg-white px-6 py-3 text-xs font-semibold text-[#18181B] transition-all hover:bg-[#F7F7F8] sm:w-auto sm:px-7 sm:py-3.5 sm:text-sm"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </section>

        <GlobalFooter />
      </main>
    </>
  );
}