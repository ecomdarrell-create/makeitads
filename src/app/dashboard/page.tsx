import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { normalizePlanId, CREDIT_COSTS } from '@/config/pricing.config';
import { HeroActionCard } from '@/components/dashboard/HeroActionCard';
import { CreditCenter } from '@/components/dashboard/CreditCenter';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { NextBestAction } from '@/components/dashboard/NextBestAction';
import { RecentStrategies } from '@/components/dashboard/RecentStrategies';
import { PlanFeatures } from '@/components/dashboard/PlanFeatures';
import { DashboardTour } from '@/components/dashboard/DashboardTour';
import { BackButton } from '@/components/ui/BackButton';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';
import { getCurrencySymbol, type Currency } from '@/lib/currency';

type NextAction = {
  title: string;
  description: string;
  action: string;
  href: string;
  cost: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await ensureUserProfile(user);

  const userCurrency = (profile?.currency as Currency) || 'XOF';
  const currencySymbol = getCurrencySymbol(userCurrency);

  const { data: strategies } = await supabase
    .from('strategies')
    .select('type, credits_cost, created_at, platform')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: recentStrategies } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const strategiesList = strategies || [];
  const totalStrategies = strategiesList.length;
  const flashCount = strategiesList.filter((s) => s.type === 'flash').length;
  const completeCount = strategiesList.filter((s) => s.type === 'complete').length;
  const creditsUsed = strategiesList.reduce(
    (sum, s) => sum + (s.credits_cost || 0),
    0
  );
  const creditsBalance = profile?.credits_balance || 0;
  const currentPlan = normalizePlanId(profile?.plan);

  const profileComplete = Boolean(profile?.first_name && profile?.currency);
  const healthScore = (profileComplete ? 50 : 0) + (totalStrategies > 0 ? 50 : 0);

  const flashCost = CREDIT_COSTS.DIAGNOSTIC_FLASH;
  const completeCost = CREDIT_COSTS.STRATEGIE_COMPLETE;

  let nextAction: NextAction = {
    title:
      totalStrategies === 0
        ? 'Créez votre premier diagnostic'
        : 'Continuez à tester vos angles',
    description:
      totalStrategies === 0
        ? 'Votre historique ne contient pas encore de stratégie. Décrivez votre activité pour obtenir une première analyse personnalisée.'
        : 'Lancez un nouveau diagnostic avec un angle ou un objectif différent pour enrichir votre historique.',
    action: 'Créer un diagnostic flash',
    href: '/dashboard/generate?type=flash',
    cost: flashCost,
  };

  if (
    currentPlan !== 'free' &&
    creditsBalance >= completeCost &&
    totalStrategies > 0 &&
    completeCount === 0
  ) {
    nextAction = {
      title: 'Passez à une stratégie complète',
      description:
        'Votre historique contient des diagnostics flash, mais aucune stratégie complète enregistrée.',
      action: 'Créer une stratégie complète',
      href: '/dashboard/generate?type=complete',
      cost: completeCost,
    };
  } else if (currentPlan !== 'free' && creditsBalance >= completeCost) {
    nextAction = {
      title: 'Créez une stratégie complète',
      description:
        'Votre solde permet une génération complète, basée sur les informations de votre activité.',
      action: 'Créer une stratégie complète',
      href: '/dashboard/generate?type=complete',
      cost: completeCost,
    };
  } else if (creditsBalance < (currentPlan === 'free' ? flashCost : completeCost)) {
    nextAction = {
      title: 'Rechargez vos crédits',
      description:
        'Votre solde ne couvre pas le coût de la prochaine génération disponible.',
      action: 'Voir les plans',
      href: '/dashboard/pricing',
      cost: 0,
    };
  }

  return (
    <div className="px-4 py-5 space-y-5 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="md:hidden flex justify-start py-2 border-b border-gray-100 mb-2">
        <h1 className="text-sm font-semibold tracking-tight">
          <span className="text-[#111827]">MakeIt</span>
          <span className="text-[#6366F1]">Ads</span>
        </h1>
      </div>

      <Header
        firstName={profile?.first_name}
        credits={creditsBalance}
        plan={currentPlan}
        currency={userCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <HeroActionCard />
          <NextBestAction data={nextAction} />
          <RecentStrategies strategies={recentStrategies || []} />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <CreditCenter
            balance={creditsBalance}
            used={creditsUsed}
            flashCount={flashCount}
            completeCount={completeCount}
            currency={userCurrency}
            plan={currentPlan}
          />
          <PlanFeatures currentPlan={currentPlan} currency={userCurrency} />
          <HealthScore
            score={healthScore}
            profileComplete={profileComplete}
            strategyCount={totalStrategies}
          />
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-gray-100">
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-[10px] text-gray-400 text-center sm:text-left">
            Vous êtes ici :{' '}
            <span className="font-medium text-gray-600">Vue d&apos;ensemble</span>
          </p>
          <BackButton href="/" label="Retour à l'accueil" />
        </div>
      </div>

      <DashboardTour />
    </div>
  );
}