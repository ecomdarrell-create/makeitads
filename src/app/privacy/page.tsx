'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Shield, Eye, Database, Lock, UserCheck,
  FileText, Globe, RefreshCw, Cookie, Server, AlertCircle, CheckCircle2, Users,
} from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';

const lastUpdated = '17 juin 2026';

const sections = [
  {
    id: '1',
    title: 'Introduction',
    content: `Chez MakeItAds, nous nous engageons à protéger vos données personnelles et votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme makeitads.pro.
En utilisant notre service, vous acceptez les pratiques décrites dans ce document. Si vous n'êtes pas d'accord, veuillez ne pas utiliser la plateforme.`,
  },
  {
    id: '2',
    title: 'Informations que nous collectons',
    content: `Nous collectons plusieurs types d'informations :
Données personnelles :
• Prénom et nom
• Adresse email
• Numéro de téléphone
• Devise et pays
• Informations de paiement (traitées de manière sécurisée par Chariow, nous ne stockons aucune donnée bancaire)
Données d'usage :
• Adresse IP et type de navigateur
• Appareil et système d'exploitation
• Pages visitées et temps passé
• Interactions et clics
Contenu généré :
• Descriptions de votre entreprise
• Stratégies marketing générées
• Informations concurrentielles que vous saisissez`,
  },
  {
    id: '3',
    title: 'Comment nous utilisons vos informations',
    content: `Nous utilisons vos données pour :
• Fournir, maintenir et améliorer notre service
• Traiter vos transactions et gérer votre abonnement
• Générer des stratégies marketing personnalisées via l'IA
• Vous envoyer des notifications techniques et des mises à jour
• Répondre à vos demandes de support
• Détecter et prévenir toute activité frauduleuse
• Améliorer votre expérience utilisateur
• Respecter nos obligations légales`,
  },
  {
    id: '4',
    title: 'Base légale du traitement (RGPD)',
    content: `Si vous résidez dans l'Espace Économique Européen, notre base légale pour traiter vos données repose sur :
• Contrat : exécution de nos obligations envers vous
• Consentement : pour les communications marketing
• Intérêt légitime : amélioration du service et sécurité
• Obligation légale : respect des lois applicables
Vous pouvez retirer votre consentement à tout moment.`,
  },
  {
    id: '5',
    title: 'Partage de données',
    content: `Nous pouvons partager vos informations avec :
Prestataires de services :
• Chariow : traitement des paiements
• Supabase : hébergement et authentification
• Resend : envoi d'emails transactionnels
• Analytics : compréhension de l'usage du service
Transferts d'entreprise :
• En cas de fusion, acquisition ou vente d'actifs
Obligations légales :
• Pour respecter une obligation légale
• Pour protéger nos droits
Nous ne vendons JAMAIS vos données à des tiers.`,
  },
  {
    id: '6',
    title: 'Sécurité des données',
    content: `Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles :
• Chiffrement SSL/TLS en transit
• Chiffrement des données au repos
• Authentification sécurisée via Supabase
• Traitement des paiements conforme PCI-DSS
• Audits de sécurité réguliers
• Contrôles d'accès stricts
Aucune méthode de transmission sur Internet n'est 100 % sécurisée. Nous nous efforçons d'utiliser les meilleures pratiques disponibles.`,
  },
  {
    id: '7',
    title: 'Vos droits',
    content: `Selon votre pays de résidence, vous disposez de droits :
Pour les résidents de l'EEE (RGPD) :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement (« droit à l'oubli »)
• Droit à la limitation du traitement
• Droit à la portabilité de vos données
• Droit d'opposition
• Droit de retirer votre consentement
Pour les résidents de Californie (CCPA) :
• Droit de savoir quelles données sont collectées
• Droit de refuser la vente de vos données
• Droit à la suppression
Pour exercer vos droits, écrivez-nous à support@makeitads.com. Réponse sous 30 jours.`,
  },
  {
    id: '8',
    title: 'Cookies et technologies similaires',
    content: `Nous utilisons des cookies pour :
• Faire fonctionner le service (essentiels)
• Comprendre comment vous utilisez la plateforme (analytiques)
• Mémoriser vos préférences (fonctionnels)
• Mesurer nos campagnes (marketing, avec consentement)
Vous pouvez refuser les cookies depuis votre navigateur, mais certaines fonctionnalités risquent de ne plus fonctionner.`,
  },
  {
    id: '9',
    title: 'Services tiers',
    content: `Notre plateforme utilise des services tiers :
• Chariow (paiements)
• Supabase (base de données et authentification)
• Resend (emails)
• Outils d'analytics
Nous vous invitons à consulter leurs politiques de confidentialité respectives.`,
  },
  {
    id: '10',
    title: 'Conservation des données',
    content: `Nous conservons vos données uniquement le temps nécessaire :
• Données de compte : durée de vie du compte + 30 jours
• Données de paiement : 7 ans (obligation légale)
• Statistiques d'usage : 26 mois
• Contenu généré (stratégies) : jusqu'à suppression par vous
Vous pouvez demander la suppression de vos données à tout moment.`,
  },
  {
    id: '11',
    title: 'Mineurs',
    content: `Notre service n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données les concernant. Si vous pensez qu'un mineur nous a fourni des informations, contactez-nous immédiatement.`,
  },
  {
    id: '12',
    title: 'Transferts internationaux',
    content: `Vos données peuvent être transférées et traitées dans des pays en dehors du vôtre. Nous veillons à ce que des garanties appropriées soient en place (clauses contractuelles types, etc.).`,
  },
  {
    id: '13',
    title: 'Modifications de cette politique',
    content: `Nous pouvons mettre à jour cette Politique de Confidentialité. En cas de changement important, nous vous en informerons par email et mettrons à jour la date en haut de cette page. Nous vous invitons à la consulter régulièrement.`,
  },
  {
    id: '14',
    title: 'Nous contacter',
    content: `Pour toute question concernant cette politique ou vos données :
Par email : support@makeitads.com
Par Telegram : https://t.me/MakeitAds_CEO
Nous répondons dans un délai de 30 jours.`,
  },
];

const rightsSummary = [
  { icon: Eye, title: 'Droit d’accès', desc: 'Consulter les données que nous détenons sur vous' },
  { icon: FileText, title: 'Droit de rectification', desc: 'Corriger toute donnée inexacte ou incomplète' },
  { icon: AlertCircle, title: 'Droit à l’effacement', desc: 'Demander la suppression de vos données' },
  { icon: Lock, title: 'Limitation du traitement', desc: 'Restreindre l’usage de vos données' },
  { icon: Database, title: 'Portabilité', desc: 'Recevoir vos données dans un format lisible' },
  { icon: Users, title: 'Droit d’opposition', desc: 'Vous opposer à certains traitements' },
];

export default function PrivacyPage() {
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Confidentialité & Données
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Politique de Confidentialité
            </h1>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Votre vie privée est notre priorité. Cette page explique comment nous gérons vos données.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 sm:text-xs">
              <span>Mise à jour : {lastUpdated}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Conforme RGPD
              </span>
            </div>
          </motion.div>

          {/* Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:mb-12 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 sm:h-6 sm:w-6" />
              <div>
                <h3 className="mb-1.5 text-sm font-bold text-[#18181B] sm:text-base">
                  Notre engagement
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                  Vos données vous appartiennent. Nous collectons uniquement le strict nécessaire, nous ne vendons jamais vos informations et vous gardez le contrôle total. Cette politique est rédigée en langage simple pour que vous compreniez précisément ce que nous faisons.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vos droits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="mb-4 text-lg font-bold text-[#18181B] sm:text-xl">
              Vos droits en un coup d&apos;œil
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {rightsSummary.map((right, index) => {
                const Icon = right.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
                  >
                    <div className="mb-2 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <Icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="text-xs font-bold text-[#18181B] sm:text-sm">
                        {right.title}
                      </h3>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-600 sm:text-[11px]">
                      {right.desc}
                    </p>
                  </div>
                );
              })}
            </div>
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center sm:mt-12"
          >
            <p className="mb-3 text-xs text-slate-500 sm:mb-4 sm:text-sm">
              Une question sur votre vie privée ?
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