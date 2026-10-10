'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const pricingPlans = [
  {
    id: 'demo',
    name: 'MakeItAds Démo',
    price: '0 FCFA',
    features: ['10 crédits de bienvenue (offre unique)', '2 Diagnostics Flash', 'Aperçu rapide de votre activité', 'Support communautaire'],
    popular: false,
    ctaText: 'Commencer',
    link: '/dashboard',
    isInternal: true,
    checkColor: 'text-emerald-500',
    ctaBg: 'bg-emerald-500',
    ctaHover: 'hover:bg-emerald-600',
    ctaTextCol: 'text-white',
    bgCard: 'bg-white',
  },
  {
    id: 'pro',
    name: 'MakeItAds Pro',
    price: '10 000 FCFA/an',
    durationNote: "12 mois d'accès",
    features: ['50 crédits renouvelés chaque mois', '5 Stratégies Complètes / mois', '12 sections détaillées', 'Scripts WhatsApp prêts à l\'emploi', 'Allocation budgétaire sur 7 jours', 'Ciblage précis par ville', 'Guide créatif', 'Support email (48h)'],
    popular: true,
    ctaText: 'Choisir le Plan Pro',
    link: 'https://makeitads.mychariow.com/plan-pro/checkout',
    isInternal: false,
    checkColor: 'text-[#6366F1]',
    ctaBg: 'bg-[#6366F1]',
    ctaHover: 'hover:bg-[#5558e6]',
    ctaTextCol: 'text-white',
    bgCard: 'bg-white',
  },
  {
    id: 'premium',
    name: 'MakeItAds Premium',
    price: '25 000 FCFA/an',
    durationNote: "12 mois d'accès",
    features: ['150 crédits renouvelés chaque mois', '15 Stratégies Complètes / mois', 'Analyse concurrentielle', '5 variantes de hooks', 'Analyse d\'audience avancée', 'Stratégie de croissance 3 mois', 'Support prioritaire (12h)', 'Rapports avancés'],
    popular: false,
    ctaText: 'Choisir le Plan Premium',
    link: 'https://makeitads.mychariow.com/plan-prem/checkout',
    isInternal: false,
    checkColor: 'text-rose-500',
    ctaBg: 'bg-rose-500',
    ctaHover: 'hover:bg-rose-600',
    ctaTextCol: 'text-white',
    bgCard: 'bg-white',
  },
  {
    id: 'elite',
    name: 'MakeItAds Élite',
    price: '100 000 FCFA/an',
    durationNote: "12 mois d'accès",
    features: ['500 crédits renouvelés chaque mois', '50 Stratégies Complètes / mois', 'Consulting stratégique mensuel', 'Formation personnalisée', 'Accompagnement avancé', 'Rapports white-label', 'Support prioritaire 24/7', 'Accès API'],
    popular: false,
    ctaText: 'Choisir le Plan Élite',
    link: 'https://makeitads.mychariow.com/plan-elit/checkout',
    isInternal: false,
    checkColor: 'text-amber-500',
    ctaBg: 'bg-amber-500',
    ctaHover: 'hover:bg-amber-600',
    ctaTextCol: 'text-white',
    bgCard: 'bg-white',
  },
];

const comparisonRows = [
  { feature: 'Crédits / mois', pro: '50', premium: '150', enterprise: '500' },
  { feature: 'Stratégies complètes / mois', pro: '5', premium: '15', enterprise: '50' },
  { feature: 'Analyse concurrentielle', pro: false, premium: true, enterprise: true },
  { feature: 'Variantes de hooks', pro: false, premium: '5', enterprise: '5' },
  { feature: 'Analyse d\'audience avancée', pro: false, premium: true, enterprise: true },
  { feature: 'Stratégie de croissance 3 mois', pro: false, premium: true, enterprise: true },
  { feature: 'Support prioritaire', pro: '48h', premium: '12h', enterprise: '< 1h' },
  { feature: 'Rapports avancés', pro: false, premium: true, enterprise: true },
  { feature: 'Rapports white-label', pro: false, premium: false, enterprise: true },
  { feature: 'Accès API', pro: false, premium: false, enterprise: true },
];

const faqData = [
  { q: 'Les crédits non utilisés sont-ils perdus à la fin du mois ?', a: 'Ils sont reportés dans la limite du plafond de votre plan pour vous encourager à rester actif chaque mois.' },
  { q: 'Puis-je changer de plan en cours d\'année ?', a: 'Oui, vous pouvez upgrader à tout moment. La différence de prix sera ajustée au prorata.' },
  { q: 'Le paiement est-il sécurisé ?', a: 'Absolument. Nous utilisons une plateforme sécurisée qui accepte le Mobile Money (Orange, Wave, MTN, Moov) ainsi que les cartes bancaires internationales.' },
  { q: 'Que se passe-t-il juste après le paiement ?', a: 'Vous recevez immédiatement un message de confirmation, vos crédits sont crédités et vous accédez au MakeItAds Business Club.' },
  { q: 'Les stratégies sont-elles adaptées à mon budget réel ?', a: 'Absolument. Chaque stratégie est calibrée de manière réaliste en fonction du budget que vous nous indiquez.' },
  { q: 'Puis-je annuler mon abonnement à tout moment ?', a: 'Oui, vous pouvez mettre fin à votre abonnement à tout moment sans frais cachés ni pénalité.' },
];

// ✅ Construit l'URL Chariow en y ajoutant les infos du user
// pour que le webhook puisse identifier qui a payé
function buildCheckoutUrl(
  baseUrl: string,
  userId: string | null,
  userEmail: string | null
): string {
  if (!baseUrl.startsWith('http')) return baseUrl;
  try {
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('userId', userId);
    if (userEmail) url.searchParams.set('email', userEmail);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function PricingCard({
  plan,
  userId,
  userEmail,
}: {
  plan: (typeof pricingPlans)[number];
  userId: string | null;
  userEmail: string | null;
}) {
  const isWide = plan.id === 'premium' || plan.id === 'elite';
  const isExternal = !plan.isInternal;
  const finalHref = isExternal
    ? buildCheckoutUrl(plan.link, userId, userEmail)
    : plan.link;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative group rounded-2xl border p-4 md:p-5 flex flex-col transition-all duration-300 h-full ${plan.bgCard} ${
        plan.popular
          ? 'border-[#6366F1]/40 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)]'
          : 'border-gray-200 shadow-sm'
      } ${isWide ? 'md:flex-row md:items-center md:gap-6' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider shadow-sm bg-[#6366F1] whitespace-nowrap z-10">
          Le plus choisi
        </div>
      )}

      <div className={`${isWide ? 'md:w-1/3 md:border-r md:border-gray-100 md:pr-5 mb-3 md:mb-0' : 'mb-3'}`}>
        <h3 className="text-sm md:text-base font-bold text-[#18181B] mb-1.5 leading-tight">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-lg md:text-2xl font-bold text-[#18181B] leading-none">
            {plan.price}
          </span>
        </div>
        {plan.durationNote && (
          <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-bold text-white bg-gray-800 whitespace-nowrap">
            {plan.durationNote}
          </span>
        )}

        {/* ✅ Lien direct (pas de window.open → plus de popup blocker) */}
        <a
          href={finalHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className={`block w-full mt-4 rounded-full py-2.5 text-center text-[11px] md:text-xs font-bold transition-all duration-200 ${plan.ctaBg} ${plan.ctaHover} ${plan.ctaTextCol} shadow-sm flex items-center justify-center min-h-[38px]`}
        >
          {plan.ctaText}
        </a>
      </div>

      <div className={`flex-1 ${isWide ? 'md:w-2/3' : ''}`}>
        <ul className={`grid ${isWide ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-x-3 gap-y-2`}>
          {plan.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] md:text-xs text-[#475569] leading-snug">
              <Check className={`mt-0.5 flex-shrink-0 h-3.5 w-3.5 ${plan.checkColor}`} strokeWidth={3} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-gray-100 bg-[#F8F8FC] overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-xs md:text-sm font-semibold text-[#18181B] pr-4 leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-[#6366F1] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5">
              <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ Récupère user pour l'injecter dans les URLs Chariow
  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email ?? null);
        }
      } catch {
        // Silencieux
      }
    };
    loadUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F8FC]">
      <section className="relative z-10 py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left mb-6 md:mb-10"
          >
            <h1 className="text-xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">
              Investissez dans votre <span className="text-[#6366F1]">croissance</span>
            </h1>
            <p className="text-xs md:text-sm leading-relaxed text-[#71717A] max-w-xl">
              Des formules annuelles avec crédits mensuels, conçues pour scaler.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
            <PricingCard plan={pricingPlans[0]} userId={userId} userEmail={userEmail} />
            <PricingCard plan={pricingPlans[1]} userId={userId} userEmail={userEmail} />
            <div className="md:col-span-2">
              <PricingCard plan={pricingPlans[2]} userId={userId} userEmail={userEmail} />
            </div>
            <div className="md:col-span-2">
              <PricingCard plan={pricingPlans[3]} userId={userId} userEmail={userEmail} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-10 md:py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-6 md:mb-10"
          >
            <h2 className="text-xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">
              Comparez les <span className="text-[#6366F1]">formules</span>
            </h2>
            <p className="text-xs md:text-sm leading-relaxed text-[#71717A]">
              Comprenez rapidement ce que chaque niveau débloque.
            </p>
          </motion.div>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="min-w-[640px] md:min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                <div className="p-4 md:p-5 border-r border-gray-100">
                  <span className="text-xs md:text-sm font-bold text-[#18181B]">Fonctionnalités</span>
                </div>
                <div className="p-4 md:p-5 border-r border-gray-100 text-center">
                  <span className="text-xs md:text-sm font-bold text-gray-600">Pro</span>
                </div>
                <div className="p-4 md:p-5 border-r border-gray-100 bg-[#6366F1]/5 text-center">
                  <span className="text-xs md:text-sm font-bold text-[#6366F1]">Premium</span>
                </div>
                <div className="p-4 md:p-5 text-center">
                  <span className="text-xs md:text-sm font-bold text-amber-500">Élite</span>
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <Fragment key={i}>
                  <div className={`grid grid-cols-4 ${i < comparisonRows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="p-4 md:p-5 border-r border-gray-100 flex items-center">
                      <span className="text-xs md:text-sm font-medium text-[#18181B]">{row.feature}</span>
                    </div>
                    <div className="p-4 md:p-5 border-r border-gray-100 flex items-center justify-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-[#6366F1]" /> : <span className="text-gray-300">—</span>
                      ) : (
                        <span className="text-xs md:text-sm text-[#475569] font-medium text-center">{row.pro}</span>
                      )}
                    </div>
                    <div className="p-4 md:p-5 border-r border-[#6366F1]/10 bg-[#6366F1]/5 flex items-center justify-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="w-4 h-4 text-[#6366F1]" /> : <span className="text-gray-300">—</span>
                      ) : (
                        <span className="text-xs md:text-sm font-semibold text-[#6366F1] text-center">{row.premium}</span>
                      )}
                    </div>
                    <div className="p-4 md:p-5 flex items-center justify-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-4 h-4 text-amber-500" /> : <span className="text-gray-300">—</span>
                      ) : (
                        <span className="text-xs md:text-sm font-semibold text-amber-600 text-center">{row.enterprise}</span>
                      )}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-6 md:mb-10"
          >
            <h2 className="text-lg md:text-2xl font-semibold leading-tight text-[#18181B] mb-2">
              Questions sur les <span className="text-[#6366F1]">formules</span>
            </h2>
            <p className="text-xs md:text-sm leading-relaxed text-[#71717A]">
              Tout ce que vous devez savoir avant de commencer.
            </p>
          </motion.div>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}