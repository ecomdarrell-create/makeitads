'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ==========================================
// 1. DONNÉES DES PLANS
// ==========================================
const pricingPlans = [
  {
    id: 'demo',
    name: 'MakeItAds Démo',
    price: '0 FCFA',
    features: [
      '10 crédits de bienvenue',
      '2 Diagnostics Flash',
      'Aperçu rapide de votre activité',
      'Support communautaire',
    ],
    popular: false,
    ctaText: 'Commencer',
    link: '/dashboard',
    isInternal: true,
    checkColor: 'text-emerald-500',
    bgCheck: 'bg-emerald-500/10',
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
    features: [
      '50 crédits renouvelés chaque mois',
      '5 Stratégies Complètes / mois',
      '12 sections détaillées par stratégie',
      'Scripts WhatsApp prêts à l\'emploi',
      'Allocation budgétaire sur 7 jours',
      'Ciblage précis par ville',
      'Guide créatif',
      'KPIs à suivre',
    ],
    popular: true,
    ctaText: 'Choisir le Plan Pro',
    link: 'https://makeitads.mychariow.com/plan-pro',
    isInternal: false,
    checkColor: 'text-[#6366F1]',
    bgCheck: 'bg-[#6366F1]/10',
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
    features: [
      '150 crédits renouvelés chaque mois',
      '15 Stratégies Complètes / mois',
      'Analyse concurrentielle',
      '5 variantes de hooks',
      'Analyse d\'audience avancée',
      'Stratégie de croissance 3 mois',
      'Support prioritaire (12h)',
      'Rapports avancés',
    ],
    popular: false,
    ctaText: 'Choisir le Plan Premium',
    link: 'https://makeitads.mychariow.com/plan-prem',
    isInternal: false,
    checkColor: 'text-rose-500',
    bgCheck: 'bg-rose-500/10',
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
    features: [
      '500 crédits renouvelés chaque mois',
      '50 Stratégies Complètes / mois',
      'Consulting stratégique mensuel',
      'Formation personnalisée',
      'Accompagnement avancé',
      'Rapports white-label',
      'Support prioritaire 24/7',
      'Accès API',
    ],
    popular: false,
    ctaText: 'Choisir le Plan Élite',
    link: 'https://makeitads.mychariow.com/plan-elit',
    isInternal: false,
    checkColor: 'text-amber-500',
    bgCheck: 'bg-amber-500/10',
    ctaBg: 'bg-amber-500',
    ctaHover: 'hover:bg-amber-600',
    ctaTextCol: 'text-white',
    bgCard: 'bg-white',
  },
];

// ==========================================
// 2. FAQ
// ==========================================
const faqData = [
  {
    q: 'Les crédits non utilisés sont-ils perdus à la fin du mois ?',
    a: 'Ils sont reportés dans la limite du plafond de votre plan pour vous encourager à rester actif chaque mois.',
  },
  {
    q: 'Puis-je changer de plan en cours d\'année ?',
    a: 'Oui, vous pouvez upgrader à tout moment. La différence de prix sera ajustée au prorata.',
  },
  {
    q: 'Le paiement est-il sécurisé ?',
    a: 'Absolument. Nous utilisons une plateforme sécurisée qui accepte le Mobile Money (Orange, Wave, MTN, Moov) ainsi que les cartes bancaires internationales.',
  },
  {
    q: 'Que se passe-t-il juste après le paiement ?',
    a: 'Vous recevez immédiatement un message de confirmation, vos crédits sont crédités et vous accédez au MakeItAds Business Club.',
  },
  {
    q: 'Les stratégies sont-elles adaptées à mon budget réel ?',
    a: 'Absolument. Chaque stratégie est calibrée de manière réaliste en fonction du budget que vous nous indiquez.',
  },
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: 'Oui, vous pouvez mettre fin à votre abonnement à tout moment sans frais cachés ni pénalité.',
  },
];

// ==========================================
// 3. CARTE DE PRIX
// ==========================================
function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    if (plan.isInternal) {
      router.push(plan.link);
      return;
    }

    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/signup?redirect=${encodeURIComponent('/dashboard/pricing')}`);
        return;
      }

      window.open(plan.link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      router.push(`/signup?redirect=${encodeURIComponent('/dashboard/pricing')}`);
    } finally {
      setLoading(false);
    }
  };

  const isWide = plan.id === 'premium' || plan.id === 'elite';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative group rounded-[16px] md:rounded-[24px] border p-3 md:p-5 flex flex-col transition-all duration-300 h-full ${plan.bgCard} ${
        plan.popular
          ? 'border-[#6366F1]/40 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)]'
          : 'border-gray-200 shadow-sm'
      } ${isWide ? 'md:flex-row md:items-center md:gap-6' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[8px] md:text-[9px] font-bold text-white uppercase tracking-wider shadow-sm bg-[#6366F1] whitespace-nowrap z-10">
          Le plus choisi
        </div>
      )}

      <div
        className={`${
          isWide ? 'md:w-1/3 md:border-r md:border-gray-100 md:pr-4 mb-3 md:mb-0' : 'mb-3'
        }`}
      >
        <h3 className="text-sm md:text-base font-bold text-[#18181B] mb-1 text-left leading-tight break-words">
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-base md:text-xl font-bold text-[#18181B] leading-none">
            {plan.price}
          </span>
        </div>

        {plan.durationNote && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold text-white bg-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
            {plan.durationNote}
          </span>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`block w-full mt-3 rounded-full py-1.5 text-center text-[10px] md:text-xs font-bold transition-all duration-200 break-words px-2 ${plan.ctaBg} ${plan.ctaHover} ${plan.ctaTextCol} shadow-sm flex items-center justify-center min-h-[32px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Chargement
            </>
          ) : (
            plan.ctaText
          )}
        </button>
      </div>

      <div className={`flex-1 ${isWide ? 'md:w-2/3' : ''}`}>
        <ul
          className={`grid ${
            isWide ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'
          } gap-x-1.5 gap-y-1.5`}
        >
          {plan.features.map((feature: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-1 text-[9px] md:text-[11px] text-[#475569] leading-tight min-w-0"
            >
              <Check
                className={`mt-0.5 flex-shrink-0 h-3 w-3 md:h-3.5 md:w-3.5 ${plan.checkColor}`}
                strokeWidth={3}
              />
              <span className="break-words hyphens-auto">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ==========================================
// 4. FAQ ITEM
// ==========================================
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
      className="rounded-[20px] border border-gray-100 bg-[#F8F8FC] overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 md:p-5 text-left hover:bg-gray-50/50 transition-colors"
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
            <div className="px-3 md:px-5 pb-3 md:pb-5">
              <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// 5. PAGE PRINCIPALE
// ==========================================
export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#F8F8FC]">
      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left mb-6 md:mb-10"
          >
            <h1 className="text-xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">
              Investissez dans votre{' '}
              <span className="text-[#6366F1]">croissance</span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A] max-w-xl">
              Des formules annuelles avec crédits mensuels, conçues pour scaler.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:gap-5 w-full">
            <div className="col-span-1">
              <PricingCard plan={pricingPlans[0]} />
            </div>
            <div className="col-span-1">
              <PricingCard plan={pricingPlans[1]} />
            </div>

            <div className="col-span-2">
              <PricingCard plan={pricingPlans[2]} />
            </div>
            <div className="col-span-2">
              <PricingCard plan={pricingPlans[3]} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-8 md:mb-12"
          >
            <h2 className="text-lg md:text-2xl font-semibold leading-tight text-[#18181B] mb-2">
              Questions sur les{' '}
              <span className="text-[#6366F1]">formules</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A]">
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