import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ExternalLink, HelpCircle, Sparkles, Target, Zap } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

const workflow = [
  {
    title: '1. Définissez votre objectif',
    description: 'Renseignez votre activité, votre audience et le résultat recherché. La plateforme transforme ce brief en stratégie exploitable en quelques minutes.',
    icon: Target,
  },
  {
    title: '2. Choisissez votre type de stratégie',
    description: 'Vous pouvez lancer un diagnostic flash rapide ou une stratégie complète plus profonde, avec scripts, angle de communication et recommandations.',
    icon: Sparkles,
  },
  {
    title: '3. Laissez l’IA analyser le marché',
    description: 'MakeItAds compare votre niche, vos concurrents et vos leviers de conversion pour orienter les bonnes décisions de croissance.',
    icon: BrainCircuit,
  },
  {
    title: '4. Recevez votre plan prêt à l’emploi',
    description: 'Chaque stratégie inclut un angle marketing, des messages, des idées de visuels et des recommandations d’activation concrètes.',
    icon: CheckCircle2,
  },
  {
    title: '5. Lancez et optimisez',
    description: 'Utilisez les recommandations pour vos campagnes, vos contenus ou votre script WhatsApp et ajustez selon vos résultats.',
    icon: Zap,
  },
];

const quickGuides = [
  {
    title: 'Créer une première stratégie',
    description: 'Un guide simple pour démarrer sans hésitation et générer votre premier plan de marketing.',
    href: '/dashboard/generate',
  },
  {
    title: 'Comprendre vos crédits',
    description: 'Découvrez comment votre solde est consommé et quand il faut recharger.',
    href: '/dashboard/credits',
  },
  {
    title: 'Voir les plans disponibles',
    description: 'Choisissez le plan qui correspond à votre volume de génération et vos besoins de croissance.',
    href: '/pricing',
  },
];

export default function ResourcesPage() {
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-4 sm:mb-5">
        <h1 className="text-base sm:text-xl font-semibold text-[#111827] mb-1">Ressources</h1>
        <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed">
          Tout ce qu’il faut savoir pour utiliser MakeItAds efficacement et obtenir des résultats rapides.
        </p>
      </div>

      {/* Bloc support */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-3 sm:p-5 mb-5 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827] mb-1">
              Besoin d’aide rapide ?
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-700 mb-2.5 sm:mb-3 leading-relaxed">
              Notre équipe répond rapidement pour vous aider à lancer votre première stratégie ou à corriger un point précis.
            </p>
            <a
              href="https://t.me/MakeitAds_CEO"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 text-[11px] sm:text-xs font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors"
            >
              Contacter le support
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Comment ça fonctionne */}
      <section id="how-it-works" className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6366F1]" />
          <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827]">
            Comment ça fonctionne
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:border-[#6366F1] transition-colors"
              >
                <div className="mb-2.5 sm:mb-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-50 text-[#6366F1]">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-[#111827] mb-1.5 sm:mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[11px] sm:text-xs leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guides utiles */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6366F1]" />
          <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827]">
            Guides utiles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {quickGuides.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="group rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition-colors hover:border-[#6366F1]"
            >
              <p className="text-[13px] sm:text-sm font-semibold text-[#111827] group-hover:text-[#6366F1] transition-colors mb-1.5 sm:mb-2 leading-snug">
                {guide.title}
              </p>
              <p className="text-[11px] sm:text-xs leading-relaxed text-gray-600 mb-2.5 sm:mb-3">
                {guide.description}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#6366F1]">
                Ouvrir
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bon à savoir */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
        <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827] mb-2">
          Bon à savoir
        </h2>
        <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-gray-600 leading-relaxed">
          <li>• Les diagnostics flash sont idéaux pour une première prise de température rapide.</li>
          <li>• Les stratégies complètes offrent un plan plus détaillé, orienté croissance et conversion.</li>
          <li>• Le support est disponible directement via Telegram pour une réponse rapide et personnalisée.</li>
        </ul>
      </div>
    </div>
  );
}