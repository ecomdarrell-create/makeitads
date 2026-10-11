'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Scale, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';

const lastUpdated = '17 juin 2026';

const sections = [
  {
    id: '1',
    title: 'Introduction',
    content: `Bienvenue sur MakeItAds. Les présentes Conditions Générales d'Utilisation (« CGU ») régissent votre accès et votre utilisation de la plateforme makeitads.pro, éditée par MakeItAds.
En accédant à la plateforme, vous acceptez sans réserve ces conditions. Si vous n'êtes pas d'accord, veuillez cesser d'utiliser le service.`,
  },
  {
    id: '2',
    title: 'Description du service',
    content: `MakeItAds est une plateforme d'intelligence marketing alimentée par l'IA. Elle fournit :
• La génération de stratégies publicitaires
• L'analyse concurrentielle
• L'analyse de marché et les tendances
• Des recommandations de croissance
Nous nous réservons le droit de modifier, suspendre ou arrêter toute partie du service à tout moment.`,
  },
  {
    id: '3',
    title: 'Compte utilisateur',
    content: `Pour créer un compte, vous devez fournir des informations exactes et à jour.
Vous êtes responsable de :
• La confidentialité de votre mot de passe
• Toutes les activités sur votre compte
• Nous informer immédiatement de tout accès non autorisé
Le partage de compte entre plusieurs personnes est interdit.`,
  },
  {
    id: '4',
    title: 'Abonnements et tarifs',
    content: `Certaines fonctionnalités sont facturées sous forme d'abonnement annuel. À la fin de chaque cycle, votre abonnement peut être renouvelé selon les conditions en vigueur.
Un moyen de paiement valide est requis. Le paiement est effectué via notre prestataire Chariow. En cas d'échec du paiement, nous pouvons suspendre votre accès.`,
  },
  {
    id: '5',
    title: 'Paiement',
    content: `Tous les paiements sont traités de manière sécurisée par Chariow, notre prestataire de paiement.
Moyens de paiement acceptés :
• Mobile Money (Orange Money, Wave, MTN MoMo, Moov Money)
• Cartes bancaires (Visa, Mastercard)
Tous les prix affichés sont dans votre devise. Les remboursements sont étudiés au cas par cas. Contactez notre support pour toute demande.`,
  },
  {
    id: '6',
    title: 'Essai gratuit',
    content: `Nous pouvons proposer un essai gratuit. À la fin de la période d'essai, votre compte reste en formule gratuite (Démo) ou évolue selon le plan choisi. Vous pouvez annuler à tout moment sans frais.`,
  },
  {
    id: '7',
    title: 'Contenu et propriété intellectuelle',
    content: `La plateforme, son contenu original, ses fonctionnalités et son code restent la propriété exclusive de MakeItAds.
Les stratégies et rapports que vous générez vous appartiennent. Vous pouvez les utiliser librement à des fins personnelles ou professionnelles, mais vous ne pouvez pas revendre le service lui-même ni sa technologie.`,
  },
  {
    id: '8',
    title: 'Utilisation acceptable',
    content: `Vous vous engagez à ne pas utiliser la plateforme :
• En violation d'une loi applicable
• Pour envoyer du contenu non sollicité ou frauduleux
• Pour usurper l'identité d'un tiers
• Pour tenter d'accéder à des parties non autorisées du service
• Pour nuire à l'expérience des autres utilisateurs
Nous pouvons suspendre votre compte immédiatement en cas de manquement.`,
  },
  {
    id: '9',
    title: 'Limitation de responsabilité',
    content: `MakeItAds ne pourra être tenu responsable de dommages indirects, spéciaux ou consécutifs, notamment :
• Perte de profits, de données ou de clientèle
• Interruption d'activité
• Utilisation ou impossibilité d'utiliser le service
Notre responsabilité totale ne saurait excéder le montant que vous nous avez versé au cours des 12 derniers mois.`,
  },
  {
    id: '10',
    title: 'Avertissement',
    content: `Votre utilisation du service se fait à vos propres risques. Le service est fourni « en l'état ».
Les stratégies et recommandations générées par l'IA sont fournies à titre informatif et ne constituent pas un conseil professionnel (juridique, fiscal, business). Vous êtes seul responsable de leur application.`,
  },
  {
    id: '11',
    title: 'Droit applicable',
    content: `Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents, sous réserve des règles protectrices applicables aux consommateurs.`,
  },
  {
    id: '12',
    title: 'Modification des conditions',
    content: `Nous pouvons modifier ces CGU à tout moment. En cas de changement important, nous vous informerons au moins 30 jours à l'avance. Continuer à utiliser le service après cette date vaut acceptation.`,
  },
  {
    id: '13',
    title: 'Contact',
    content: `Pour toute question relative aux présentes conditions :
Par email : support@makeitads.com
Par Telegram : https://t.me/MakeitAds_CEO
Nous répondons sous 5 jours ouvrés.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F8FC] text-[#18181B]">
      <GlobalNavbar />

      <div className="pt-24 pb-16 px-4 sm:pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-[#6366F1] sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Retour à l&apos;accueil
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1 text-[10px] font-medium text-[#6366F1] sm:text-xs">
              <Scale className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Document juridique
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Merci de lire attentivement ces conditions avant d&apos;utiliser notre service.
            </p>
            <div className="mt-3 text-[10px] text-slate-500 sm:text-xs">
              Mise à jour : {lastUpdated}
            </div>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/5 to-white p-4 sm:mb-12 sm:p-6"
          >
            <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
              Ces CGU constituent un accord légal entre vous et MakeItAds. En créant un compte ou en utilisant le service, vous reconnaissez avoir lu et accepté l&apos;ensemble de ces conditions.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-4 sm:space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-xs">
                    {section.id}
                  </div>
                  <h2 className="text-sm font-bold text-[#18181B] sm:text-base">
                    {section.title}
                  </h2>
                </div>
                <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="mb-3 whitespace-pre-line text-[11px] leading-relaxed text-slate-600 last:mb-0 sm:text-[13px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:mt-12 sm:p-6"
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800 sm:text-base">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              À retenir
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-700 sm:text-[13px]">
              {[
                'Vous pouvez annuler votre abonnement à tout moment',
                'Les paiements sont sécurisés via Chariow',
                'Le contenu que vous générez vous appartient',
                'Le droit français s’applique à ces conditions',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center sm:mt-12"
          >
            <p className="mb-3 text-xs text-slate-500 sm:mb-4 sm:text-sm">
              Une question sur ces conditions ?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#5558e6] sm:text-sm"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Contacter notre équipe
            </Link>
          </motion.div>
        </div>
      </div>

      <GlobalFooter />
    </main>
  );
}