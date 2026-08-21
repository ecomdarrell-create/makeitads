import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Lightbulb, Rocket, Globe, Zap } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

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

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      
      <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
        <GlobalNavbar />

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#18181B]">
              Rencontrez <span className="text-[#6366F1]">Darrell Kamga</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#71717A] mb-8">
              Fondateur & CEO de MakeItAds
            </p>
            <p className="text-lg text-[#71717A] max-w-2xl mx-auto leading-relaxed">
              Construire l'outil d'intelligence marketing le plus pragmatique pour les entrepreneurs africains. Fini les devinettes, place à l'exécution.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative z-10 py-16 px-6 bg-[#FFFFFF] border-y border-[#E7E7EB]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#18181B]">
                  La <span className="text-[#6366F1]">Mission</span>
                </h2>
                <p className="text-[#71717A] text-lg leading-relaxed mb-6">
                  J'ai fondé MakeItAds avec une conviction simple : <strong className="text-[#18181B]">chaque entreprise mérite d'avoir accès à une intelligence marketing de niveau entreprise, sans en payer le prix fort.</strong>
                </p>
                <p className="text-[#71717A] leading-relaxed mb-6">
                  Trop longtemps, les PME et les entrepreneurs ont gaspillé des millions en campagnes publicitaires basées sur l'intuition ou des outils occidentaux déconnectés de nos réalités (devises, habitudes d'achat, Mobile Money).
                </p>
                <p className="text-[#71717A] leading-relaxed">
                  MakeItAds change la donne. Nous combinons l'IA avec une expertise locale profonde pour vous fournir des stratégies publicitaires <strong>prêtes à copier-coller</strong>, calibrées pour le marché africain.
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-3xl bg-[#F7F7F8] border border-[#E7E7EB] p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#6366F1]/10 mb-6">
                      <Globe className="h-10 w-10 text-[#6366F1]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#18181B] mb-2">Calibré pour l'Afrique</h3>
                    <p className="text-[#71717A]">Budgets en FCFA, ciblage local et leviers de confiance adaptés (WhatsApp, livraison, etc.).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#18181B]">
              Nos <span className="text-[#6366F1]">Valeurs</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-8 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10 mb-4">
                  <Zap className="h-6 w-6 text-[#6366F1]" />
                </div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">Exécution Immédiate</h3>
                <p className="text-[#71717A]">
                  Nous ne vendons pas de la théorie. Chaque stratégie contient des textes prêts à l'emploi, des paramètres de ciblage précis et des guides visuels.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-8 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">Transparence Totale</h3>
                <p className="text-[#71717A]">
                  Pas d'abonnement caché. Vous achetez des crédits à l'unité, vous les utilisez quand vous voulez. Zéro engagement, zéro surprise.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-8 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 mb-4">
                  <Rocket className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">Obsession du Résultat</h3>
                <p className="text-[#71717A]">
                  Tout ce que nous construisons a un seul objectif : vous aider à acquérir des clients de manière plus rentable et plus rapide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="relative z-10 py-16 px-6 bg-[#FFFFFF] border-y border-[#E7E7EB]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#18181B]">
              Le <span className="text-[#6366F1]">Parcours</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#6366F1]">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181B] mb-2">Le Problème</h3>
                  <p className="text-[#71717A] leading-relaxed">
                    En tant qu'entrepreneur, j'ai vu des dizaines de business brûler leur budget en lançant des publicités au hasard, sans stratégie claire, en espérant que "ça marche".
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#6366F1]">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181B] mb-2">Le Déclic</h3>
                  <p className="text-[#71717A] leading-relaxed">
                    Le problème n'était pas un manque d'outils, mais un manque d'outils <em>adaptés</em>. Les IA génériques proposent des budgets en dollars et des ciblages américains, inutiles pour notre marché.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#6366F1]">03</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181B] mb-2">La Solution</h3>
                  <p className="text-[#71717A] leading-relaxed">
                    MakeItAds est né de cette vision : offrir une intelligence marché de haute qualité, accessible via un simple achat de crédits, pour que chaque entrepreneur puisse lancer sa campagne en toute confiance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#18181B]">
              Restons en <span className="text-[#6366F1]">Contact</span>
            </h2>
            <p className="text-lg text-[#71717A] mb-12">
              Une question sur MakeItAds ? Une idée de collaboration ? J'aimerais beaucoup avoir de vos nouvelles.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/darrell-kamga-547b24275"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full bg-[#0A66C2] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#004182] transition-all hover:scale-105"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Me contacter sur LinkedIn
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full border border-[#E7E7EB] bg-[#FFFFFF] px-8 py-4 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-all"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>

        <GlobalFooter />
      </main>
    </>
  );
}