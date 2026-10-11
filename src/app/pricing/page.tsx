import Link from 'next/link';
import { Check } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { createClient } from '@/lib/supabase/server';
import { formatPlanPrice } from '@/config/pricing.config';
import { normalizeCurrency, type Currency } from '@/lib/currency';

const plans = [
  {
    id: 'demo',
    name: 'MakeItAds Démo',
    isFree: true,
    note: '12 mois d’accès',
    ctaText: 'Commencer',
    href: '/dashboard',
    popular: false,
    bgCard: 'bg-white',
    border: 'border-gray-200',
    ctaBg: 'bg-emerald-500',
    ctaHover: 'hover:bg-emerald-600',
    textColor: 'text-white',
    checkColor: 'text-emerald-500',
    features: [
      '10 crédits de bienvenue (offre unique)',
      '1 Diagnostic Flash',
      'Stratégies basiques',
      'Support communautaire',
    ],
  },
  {
    id: 'pro',
    name: 'MakeItAds Pro',
    note: '12 mois d’accès',
    ctaText: 'Choisir le Plan Pro',
    href: 'https://makeitads.mychariow.com/plan-pro',
    popular: true,
    bgCard: 'bg-white',
    border: 'border-[#6366F1]/40',
    ctaBg: 'bg-[#6366F1]',
    ctaHover: 'hover:bg-[#5558e6]',
    textColor: 'text-white',
    checkColor: 'text-[#6366F1]',
    features: [
      '15 crédits renouvelés chaque mois',
      '6 variantes de textes',
      'Ciblage précis',
      'Recommandations plateforme',
      'Guide créatif',
      'Accès communauté',
      'Adapté marché local',
    ],
  },
  {
    id: 'premium',
    name: 'MakeItAds Premium',
    note: '12 mois d’accès',
    ctaText: 'Choisir le Plan Premium',
    href: 'https://makeitads.mychariow.com/plan-prem',
    popular: false,
    bgCard: 'bg-white',
    border: 'border-gray-200',
    ctaBg: 'bg-rose-500',
    ctaHover: 'hover:bg-rose-600',
    textColor: 'text-white',
    checkColor: 'text-rose-500',
    features: [
      '30 crédits renouvelés chaque mois',
      '15 variantes de textes',
      'Analyse concurrentielle',
      'Publication / visibilité',
      'Support prioritaire',
      'Canal Telegram VIP',
      'Stratégie de croissance',
    ],
  },
  {
    id: 'enterprise',
    name: 'MakeItAds Élite',
    note: '12 mois d’accès',
    ctaText: 'Choisir le Plan Élite',
    href: 'https://makeitads.mychariow.com/plan-elit',
    popular: false,
    bgCard: 'bg-white',
    border: 'border-gray-200',
    ctaBg: 'bg-amber-500',
    ctaHover: 'hover:bg-amber-600',
    textColor: 'text-white',
    checkColor: 'text-amber-500',
    features: [
      '80 crédits renouvelés chaque mois',
      'Analyse concurrentielle mensuelle',
      'Accompagnement sur mesure',
      '4 publications / mois',
      'Consulting stratégique 30min',
      'Support < 1 heure',
      'Accompagnement avancé',
    ],
  },
];

function PricingCard({
  plan,
  currency,
}: {
  plan: (typeof plans)[number];
  currency: Currency;
}) {
  const isWide = plan.id === 'premium' || plan.id === 'enterprise';

  // ✅ Prix dynamique selon la devise (sauf demo → "Gratuit")
  const displayPrice = plan.isFree
    ? 'Gratuit'
    : formatPlanPrice(
        plan.id as 'pro' | 'premium' | 'enterprise',
        currency,
        '/an'
      );

  return (
    <div
      className={`relative group rounded-[16px] md:rounded-[24px] border p-3 md:p-4 flex flex-col transition-all duration-300 h-full ${plan.bgCard} ${plan.popular ? 'shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)]' : 'shadow-sm'} ${plan.border} ${isWide ? 'md:flex-row md:items-center md:gap-6' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] md:text-[9px] font-bold text-white uppercase tracking-wider shadow-sm bg-[#6366F1] whitespace-nowrap z-10">
          Le plus choisi
        </div>
      )}

      <div className={`${isWide ? 'md:w-1/3 md:border-r md:border-gray-100 md:pr-4 mb-3 md:mb-0' : 'mb-3'}`}>
        <h3 className="text-sm md:text-base font-bold text-[#18181B] mb-1 text-left leading-tight break-words">
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-base md:text-xl font-bold text-[#18181B] leading-none">
            {displayPrice}
          </span>
        </div>

        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold text-white bg-gray-800 whitespace-nowrap">
          {plan.note}
        </span>

        <Link
          href={plan.href}
          target={plan.href.startsWith('http') ? '_blank' : undefined}
          rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`block w-full mt-3 rounded-full py-1.5 text-center text-[10px] md:text-xs font-bold transition-all duration-200 break-words px-2 ${plan.ctaBg} ${plan.ctaHover} ${plan.textColor} shadow-sm flex items-center justify-center min-h-[32px] leading-tight`}
        >
          {plan.ctaText}
        </Link>
      </div>

      <div className={`flex-1 ${isWide ? 'md:w-2/3' : ''}`}>
        <ul className={`grid ${isWide ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} gap-x-1.5 gap-y-1.5`}>
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-1 text-[9px] md:text-[11px] text-[#475569] leading-tight min-w-0">
              <Check className={`mt-0.5 flex-shrink-0 h-3 w-3 md:h-3.5 md:w-3.5 ${plan.checkColor}`} strokeWidth={3} />
              <span className="break-words hyphens-auto">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ✅ Devise du user connecté (fallback XOF pour visiteurs anonymes)
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <BackButton href="/dashboard" label="Retour au dashboard" />

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
            Choisissez le plan adapté à vos ambitions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Des tarifs transparents, sans surprise. Commencez gratuitement et évoluez selon vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5 w-full">
          <div className="col-span-1">
            <PricingCard plan={plans[0]} currency={currency} />
          </div>
          <div className="col-span-1">
            <PricingCard plan={plans[1]} currency={currency} />
          </div>
          <div className="col-span-2">
            <PricingCard plan={plans[2]} currency={currency} />
          </div>
          <div className="col-span-2">
            <PricingCard plan={plans[3]} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
}