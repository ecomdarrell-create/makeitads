'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Cookie, Shield, CheckCircle2, Settings, Lock, Eye, FileText,
} from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';

const lastUpdated = '17 juin 2026';

const sections = [
  {
    id: '1',
    title: 'Que sont les cookies ?',
    content: `Les cookies sont de petits fichiers texte déposés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de fonctionner correctement et de se souvenir de vos préférences.
Un cookie contient généralement le nom du site d'origine, sa durée de vie et une valeur unique générée automatiquement.`,
  },
  {
    id: '2',
    title: 'Comment nous utilisons les cookies',
    content: `Nous utilisons des cookies pour :
• Maintenir votre session de connexion
• Mémoriser vos préférences (langue, devise, thème)
• Assurer la sécurité du service
• Comprendre comment vous utilisez la plateforme
• Mesurer l'efficacité de nos campagnes marketing
Nous ne les utilisons jamais pour vous identifier personnellement à des fins commerciales sans votre accord.`,
  },
  {
    id: '3',
    title: 'Types de cookies utilisés',
    content: `Nous utilisons 4 catégories de cookies :
1. Strictement nécessaires (toujours actifs)
Essentiels au fonctionnement du service : sécurité, connexion, session. Vous ne pouvez pas les refuser.
2. Performance
Ils nous aident à comprendre comment vous utilisez la plateforme (pages vues, temps passé). Les données sont agrégées et anonymes.
3. Fonctionnalité
Ils mémorisent vos choix (langue, devise) et améliorent votre expérience.
4. Marketing (avec consentement uniquement)
Ils nous permettent de mesurer l'efficacité de nos publicités et de vous proposer du contenu pertinent.`,
  },
  {
    id: '4',
    title: 'Cookies spécifiques utilisés',
    content: `Voici la liste précise de nos cookies :
Authentification et session :
• supabase-auth-token — votre session de connexion (1 an)
• session_id — session active (durée de la session)
Préférences :
• theme_preference — thème d'affichage (1 an)
• language — langue choisie (1 an)
• currency — devise sélectionnée (1 an)
• cookie_consent — vos choix cookies (1 an)
Analytiques :
• _ga — identifiant Google Analytics (2 ans)
• _gid — identification sessionnelle (24 heures)`,
  },
  {
    id: '5',
    title: 'Cookies tiers',
    content: `Certains cookies sont déposés par nos partenaires :
• Google Analytics — analyse d'audience
• Chariow — traitement des paiements
• Resend — envoi d'emails transactionnels
Ces tiers ont leurs propres politiques de confidentialité. Nous vous invitons à les consulter.`,
  },
  {
    id: '6',
    title: 'Gérer vos préférences',
    content: `Vous pouvez gérer ou supprimer les cookies à tout moment :

Depuis notre site :
Cliquez sur le lien "Paramètres des cookies" en bas de page pour ajuster vos choix.

Depuis votre navigateur :
• Chrome : Paramètres → Confidentialité → Cookies
• Firefox : Paramètres → Vie privée → Cookies
• Safari : Préférences → Confidentialité → Cookies
• Edge : Paramètres → Cookies et autorisations

Important : si vous bloquez les cookies essentiels, certaines fonctionnalités du service risquent de ne plus fonctionner.`,
  },
  {
    id: '7',
    title: 'Consentement aux cookies',
    content: `Lors de votre première visite, une bannière vous demande de choisir :
• Tout accepter — tous les cookies
• Refuser non essentiels — cookies essentiels uniquement
• Personnaliser — choisir catégorie par catégorie

Vous pouvez modifier votre choix à tout moment depuis le footer du site.

Base légale :
• Résidents EEE : consentement requis pour les cookies non essentiels (RGPD)
• Résidents Californie : droit de refuser (CCPA)`,
  },
  {
    id: '8',
    title: 'Signaux "Do Not Track"',
    content: `Certains navigateurs proposent une option "Do Not Track" (DNT) qui signale que vous ne souhaitez pas être suivi.
Nous respectons ces signaux dans la mesure du possible et ne vous trackerons pas à des fins publicitaires si DNT est activé. Nous utilisons néanmoins les cookies essentiels au fonctionnement du service.`,
  },
  {
    id: '9',
    title: 'Mises à jour',
    content: `Nous pouvons mettre à jour cette Politique Cookies pour refléter des changements technologiques ou légaux.
En cas de changement important, la date de mise à jour sera modifiée et une notification vous sera adressée. Nous vous invitons à consulter cette page régulièrement.`,
  },
  {
    id: '10',
    title: 'Nous contacter',
    content: `Pour toute question sur cette politique :
Par email : support@makeitads.com
Par Telegram : https://t.me/MakeitAds_CEO
Nous répondons sous 30 jours.`,
  },
];

const cookieCategories = [
  {
    name: 'Strictement nécessaires',
    description: 'Indispensables au fonctionnement du service',
    required: true,
    examples: ['Token de connexion', 'Cookies de session', 'Sécurité'],
    color: '#10B981',
    bg: 'bg-emerald-50',
  },
  {
    name: 'Performance',
    description: 'Nous aident à comprendre votre usage',
    required: false,
    examples: ['Google Analytics', 'Temps de chargement', 'Erreurs'],
    color: '#6366F1',
    bg: 'bg-indigo-50',
  },
  {
    name: 'Fonctionnalité',
    description: 'Mémorisent vos préférences',
    required: false,
    examples: ['Langue', 'Devise', 'Thème'],
    color: '#0EA5E9',
    bg: 'bg-sky-50',
  },
  {
    name: 'Marketing',
    description: 'Publicités pertinentes (avec consentement)',
    required: false,
    examples: ['Pixel publicitaire', 'Mesure de conversion'],
    color: '#F59E0B',
    bg: 'bg-amber-50',
  },
];

export default function CookiePage() {
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700 sm:text-xs">
              <Cookie className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Politique Cookies
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Politique relative aux Cookies
            </h1>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Comment nous utilisons les cookies et technologies similaires.
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
            className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 sm:mb-12 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 sm:h-6 sm:w-6" />
              <div>
                <h3 className="mb-1.5 text-sm font-bold text-[#18181B] sm:text-base">
                  Transparence totale
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                  Nous n&apos;utilisons que les cookies nécessaires au bon fonctionnement du service ou ceux qui améliorent votre expérience. Cette page explique tout, sans jargon.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Catégories de cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="mb-4 text-lg font-bold text-[#18181B] sm:text-xl">
              Catégories de cookies
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {cookieCategories.map((cat, index) => (
                <div
                  key={index}
                  className={`rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: cat.color }}
                      />
                      <h3 className="text-xs font-bold text-[#18181B] sm:text-sm">
                        {cat.name}
                      </h3>
                    </div>
                    {cat.required ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 sm:text-[10px]">
                        Requis
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 sm:text-[10px]">
                        Optionnel
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-[10px] text-slate-600 sm:text-[11px]">
                    {cat.description}
                  </p>
                  <ul className="space-y-0.5">
                    {cat.examples.map((ex, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-xs">
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

          {/* Bloc de gestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/5 to-white p-4 sm:mt-12 sm:p-6"
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-[#18181B] sm:text-base">
                  <Settings className="h-4 w-4 text-[#6366F1] sm:h-5 sm:w-5" />
                  Gérer vos préférences
                </h3>
                <p className="text-[11px] text-slate-600 sm:text-xs">
                  Vous pouvez modifier vos choix à tout moment depuis votre navigateur.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center sm:mt-12"
          >
            <p className="mb-3 text-xs text-slate-500 sm:mb-4 sm:text-sm">
              Une question sur nos cookies ?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#5558e6] sm:text-sm"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </div>

      <GlobalFooter />
    </main>
  );
}