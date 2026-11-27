import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingDown, TrendingUp, Coins, Lightbulb } from 'lucide-react';
import { Header } from '@/components/dashboard/Header';
import { normalizePlanId, CREDIT_COSTS } from '@/config/pricing.config';
import { HeroActionCard } from '@/components/dashboard/HeroActionCard'; // ✅ RÉIMPORTÉ
import { CreditCenter } from '@/components/dashboard/CreditCenter';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { RecentStrategies } from '@/components/dashboard/RecentStrategies';
import { PlanFeatures } from '@/components/dashboard/PlanFeatures';
import { DashboardTour } from '@/components/dashboard/DashboardTour';
import { BackButton } from '@/components/ui/BackButton';
import { RadialStat } from '@/components/dashboard/analytics/RadialStat';
import { ActivityChart } from '@/components/dashboard/analytics/ActivityChart';
import { ActivityBreakdown } from '@/components/dashboard/analytics/ActivityBreakdown';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';
import { type Currency } from '@/lib/currency';

interface Advice {
  tone: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

function buildAdvice(params: {
  totalStrategies: number;
  thisMonth: number;
  lastMonth: number;
  delta: number;
  creditsBalance: number;
  plan: string;
  referralCount: number;
  daysSinceSignup: number;
}): Advice {
  const { totalStrategies, thisMonth, lastMonth, delta, creditsBalance, plan, referralCount, daysSinceSignup } = params;
  const isPaidPlan = plan !== 'free' && plan !== 'demo';

  if (!isPaidPlan) {
    return {
      tone: 'warning',
      title: 'Passez à un plan payant',
      message: 'Débloquez l\'accès complet aux stratégies et à toutes les fonctionnalités avancées de MakeItAds.',
    };
  }

  if (totalStrategies === 0) {
    return {
      tone: 'info',
      title: 'Commencez votre première stratégie',
      message: "Vous n'avez encore généré aucune stratégie. Décrivez votre activité pour obtenir votre première analyse personnalisée.",
    };
  }
  if (creditsBalance === 0) {
    return {
      tone: 'warning',
      title: 'Vos crédits sont épuisés',
      message: 'Rechargez vos crédits pour continuer à générer des stratégies ce mois-ci.',
    };
  }
  if (daysSinceSignup <= 7 && totalStrategies < 3) {
    return {
      tone: 'info',
      title: "Période d'onboarding",
      message: 'Vous débutez sur MakeItAds. Générez au moins 3 stratégies cette semaine pour explorer les différents angles.',
    };
  }
  if (delta > 0) {
    return {
      tone: 'success',
      title: `Belle progression (+${delta} ce mois-ci)`,
      message: `Votre activité a augmenté par rapport au mois dernier (${lastMonth} → ${thisMonth}). Continuez sur cette lancée.`,
    };
  }
  if (delta < 0) {
    return {
      tone: 'warning',
      title: `Activité en baisse (${delta})`,
      message: `Vous avez généré ${Math.abs(delta)} stratégie${Math.abs(delta) > 1 ? 's' : ''} de moins que le mois dernier. Reprenez le rythme.`,
    };
  }
  if (referralCount === 0) {
    return {
      tone: 'info',
      title: 'Activez votre parrainage',
      message: 'Partagez votre lien de parrainage : chaque ami inscrit vous rapporte des crédits bonus.',
    };
  }
  return {
    tone: 'success',
    title: 'Activité régulière',
    message: 'Votre rythme de génération est stable. Pensez à comparer vos stratégies pour identifier celles qui performent le mieux.',
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await ensureUserProfile(user);
  const userCurrency = (profile?.currency as Currency) || 'XOF';

  const { data: strategies } = await supabase
    .from('strategies')
    .select('id, type, credits_cost, created_at, platform, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const strategiesList = strategies || [];
  const recentStrategies = strategiesList.slice(0, 5);

  const totalStrategies = strategiesList.length;
  const completeCount = strategiesList.filter((s) => s.type === 'complete').length;
  const creditsUsed = strategiesList.reduce((sum, s) => sum + (s.credits_cost || 0), 0);
  const creditsBalance = profile?.credits_balance || 0;
  const currentPlan = normalizePlanId(profile?.plan);

  const profileComplete = Boolean(profile?.first_name && profile?.currency);
  
  // ✅ MODIFICATION : L'indice de préparation est forcé à 0 pour le plan gratuit
  const healthScore = currentPlan === 'free' ? 0 : (profileComplete ? 50 : 0) + (totalStrategies > 0 ? 50 : 0);

  const [transactionsRes, referralsRes] = await Promise.all([
    supabase.from('credit_transactions').select('id, amount, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('referrals').select('id, status, created_at').eq('referrer_id', user.id),
  ]);

  const transactions = transactionsRes.data ?? [];
  const referrals = referralsRes.data ?? [];
  const totalCreditsUsed = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const referralCount = referrals.length;

  const now = new Date();
  const daily: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    daily.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const dailyMap = new Map(daily.map((d) => [d.date, d]));
  strategiesList.forEach((s) => {
    const d = new Date(s.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const entry = dailyMap.get(key);
    if (entry) entry.count += 1;
  });

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const thisMonth = strategiesList.filter((s) => new Date(s.created_at) >= startOfThisMonth).length;
  const lastMonth = strategiesList.filter((s) => {
    const d = new Date(s.created_at);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  }).length;
  const delta = thisMonth - lastMonth;
  const daysSinceSignup = Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

  const advice = buildAdvice({
    totalStrategies,
    thisMonth,
    lastMonth,
    delta,
    creditsBalance,
    plan: profile?.plan ?? 'free',
    referralCount,
    daysSinceSignup,
  });

  const adviceTone =
    advice.tone === 'success'
      ? { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <TrendingUp className="w-4 h-4" /> }
      : advice.tone === 'warning'
      ? { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: <TrendingDown className="w-4 h-4" /> }
      : { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: <Lightbulb className="w-4 h-4" /> };

  return (
    <div className="px-4 py-5 space-y-5 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="md:hidden flex justify-start py-2 border-b border-gray-100 mb-2">
        <h1 className="text-sm font-semibold tracking-tight">
          <span className="text-[#111827]">MakeIt</span>
          <span className="text-[#6366F1]">Ads</span>
        </h1>
      </div>

      <Header firstName={profile?.first_name} credits={creditsBalance} plan={currentPlan} currency={userCurrency} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* ✅ RÉINTÉGRATION DE LA CARTE D'ACTION PRINCIPALE */}
          <HeroActionCard plan={currentPlan} />
          <RecentStrategies strategies={recentStrategies} />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <CreditCenter balance={creditsBalance} used={creditsUsed} flashCount={0} completeCount={completeCount} currency={userCurrency} plan={currentPlan} />
          <PlanFeatures currentPlan={currentPlan} currency={userCurrency} />
          <HealthScore score={healthScore} profileComplete={profileComplete} strategyCount={totalStrategies} />
        </div>
      </div>

      <section className="pt-4 mt-6 border-t border-gray-100">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827]">Analytics</h2>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-600">
            Suivi détaillé de votre activité sur MakeItAds.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
          <RadialStat
            value={totalStrategies}
            max={Math.max(totalStrategies, 20)}
            label="Stratégies totales"
            sublabel={`${thisMonth} ce mois-ci`}
            color="#6366F1"
          />
          <RadialStat
            value={completeCount}
            max={Math.max(totalStrategies, 1)}
            label="Stratégies complètes"
            sublabel={totalStrategies ? `${Math.round((completeCount / totalStrategies) * 100)}% du total` : '—'}
            color="#8B5CF6"
          />
          <RadialStat
            value={referralCount}
            max={Math.max(referralCount, 10)}
            label="Filleuls"
            sublabel={referralCount === 0 ? 'Invitez vos amis' : 'Bonus actifs'}
            color="#F59E0B"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-[#6366F1] flex-shrink-0">
            <Coins className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-gray-500">Crédits utilisés (cumul)</p>
            <p className="text-sm sm:text-base font-semibold text-[#111827]">{totalCreditsUsed}</p>
          </div>
        </div>

        <div className="mb-4">
          <ActivityChart data={daily} />
        </div>

        <div className="mb-4">
          <ActivityBreakdown
            items={[
              { name: 'Stratégies complètes', value: completeCount, color: '#8B5CF6' },
            ]}
          />
        </div>

        <div className={`rounded-xl border ${adviceTone.border} ${adviceTone.bg} p-3.5 sm:p-4`}>
          <div className="flex items-start gap-2.5">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 ${adviceTone.text} flex-shrink-0`}>
              {adviceTone.icon}
            </span>
            <div className="min-w-0">
              <h3 className={`text-[13px] sm:text-sm font-semibold ${adviceTone.text}`}>
                {advice.title}
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-gray-700 leading-relaxed">
                {advice.message}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-4 mt-6 border-t border-gray-100">
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-[10px] text-gray-400 text-center sm:text-left">
            Vous êtes ici : <span className="font-medium text-gray-600">Vue d&apos;ensemble</span>
          </p>
          <BackButton href="/" label="Retour à l'accueil" />
        </div>
      </div>

      <DashboardTour />
    </div>
  );
}