import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingDown, TrendingUp, Coins, Lightbulb } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { RadialStat } from '@/components/dashboard/analytics/RadialStat';
import { ActivityChart } from '@/components/dashboard/analytics/ActivityChart';
import { ActivityBreakdown } from '@/components/dashboard/analytics/ActivityBreakdown';

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
  const {
    totalStrategies,
    thisMonth,
    lastMonth,
    delta,
    creditsBalance,
    plan,
    referralCount,
    daysSinceSignup,
  } = params;

  if (totalStrategies === 0) {
    return {
      tone: 'info',
      title: 'Commencez votre première stratégie',
      message:
        'Vous n’avez encore généré aucune stratégie. Lancez un diagnostic Flash pour tester la plateforme en 1 crédit, puis passez à une stratégie complète.',
    };
  }

  if (creditsBalance === 0 && plan === 'free') {
    return {
      tone: 'warning',
      title: 'Vos crédits sont épuisés',
      message:
        'Vous avez utilisé tous vos crédits de démo. Passez à un plan payant pour continuer à générer des stratégies et débloquer les analyses avancées.',
    };
  }

  if (daysSinceSignup <= 7 && totalStrategies < 3) {
    return {
      tone: 'info',
      title: 'Période d’onboarding',
      message:
        'Vous débutez sur MakeItAds. Générez au moins 3 stratégies cette semaine pour explorer les différents angles proposés et trouver celui qui colle à votre audience.',
    };
  }

  if (delta > 0) {
    return {
      tone: 'success',
      title: `Belle progression (+${delta} ce mois-ci)`,
      message:
        `Votre activité a augmenté par rapport au mois dernier (${lastMonth} → ${thisMonth}). Continuez sur cette lancée et testez une nouvelle variante de votre meilleure stratégie.`,
    };
  }

  if (delta < 0) {
    return {
      tone: 'warning',
      title: `Activité en baisse (${delta})`,
      message:
        `Vous avez généré ${Math.abs(delta)} stratégie${Math.abs(delta) > 1 ? 's' : ''} de moins que le mois dernier. Reprenez le rythme : une stratégie Flash par semaine suffit à garder votre acquisition active.`,
    };
  }

  if (referralCount === 0) {
    return {
      tone: 'info',
      title: 'Activez votre parrainage',
      message:
        'Partagez votre lien de parrainage : chaque ami inscrit vous rapporte des crédits bonus. Un canal simple pour faire grandir votre compte sans dépenser.',
    };
  }

  return {
    tone: 'success',
    title: 'Activité régulière',
    message:
      'Votre rythme de génération est stable. Pensez à comparer vos stratégies pour identifier celles qui performent le mieux et à les décliner.',
  };
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [strategiesRes, transactionsRes, referralsRes, profileRes] = await Promise.all([
    supabase
      .from('strategies')
      .select('id, type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('credit_transactions')
      .select('id, amount, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('referrals')
      .select('id, status, created_at')
      .eq('referrer_id', user.id),
    supabase
      .from('profiles')
      .select('plan, credits_balance')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const strategies = strategiesRes.data ?? [];
  const transactions = transactionsRes.data ?? [];
  const referrals = referralsRes.data ?? [];
  const profile = profileRes.data;

  const totalStrategies = strategies.length;
  const flashCount = strategies.filter((s) => s.type === 'flash').length;
  const completeCount = strategies.filter((s) => s.type === 'complete').length;
  const totalCreditsUsed = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
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
  strategies.forEach((s) => {
    const d = new Date(s.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const entry = dailyMap.get(key);
    if (entry) entry.count += 1;
  });

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const thisMonth = strategies.filter((s) => new Date(s.created_at) >= startOfThisMonth).length;
  const lastMonth = strategies.filter((s) => {
    const d = new Date(s.created_at);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  }).length;
  const delta = thisMonth - lastMonth;

  const daysSinceSignup = Math.floor(
    (now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const advice = buildAdvice({
    totalStrategies,
    thisMonth,
    lastMonth,
    delta,
    creditsBalance: profile?.credits_balance ?? 0,
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
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-4 sm:mb-5">
        <h1 className="text-base sm:text-xl font-semibold text-[#111827] mb-1">Analytics</h1>
        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
          Suivi de votre activité sur MakeItAds. Les performances publicitaires ne sont pas mesurées sans connexion aux plateformes.
        </p>
      </div>

      {/* ── Anneaux ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
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
          value={flashCount}
          max={Math.max(totalStrategies, 1)}
          label="Diagnostics Flash"
          sublabel={totalStrategies ? `${Math.round((flashCount / totalStrategies) * 100)}% du total` : '—'}
          color="#10B981"
        />
        <RadialStat
          value={referralCount}
          max={Math.max(referralCount, 10)}
          label="Filleuls"
          sublabel={referralCount === 0 ? 'Invitez vos amis' : 'Bonus actifs'}
          color="#F59E0B"
        />
      </div>

      {/* ── Crédits utilisés ── */}
      <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-[#6366F1] flex-shrink-0">
          <Coins className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-gray-500">Crédits utilisés (cumul)</p>
          <p className="text-sm sm:text-base font-semibold text-[#111827]">
            {totalCreditsUsed}
          </p>
        </div>
      </div>

      {/* ── Graphique d'activité ── */}
      <div className="mb-4 sm:mb-5">
        <ActivityChart data={daily} />
      </div>

      {/* ── Répartition ── */}
      <div className="mb-4 sm:mb-5">
        <ActivityBreakdown
          items={[
            { name: 'Stratégies complètes', value: completeCount, color: '#8B5CF6' },
            { name: 'Diagnostics Flash', value: flashCount, color: '#10B981' },
          ]}
        />
      </div>

      {/* ── Conseil personnalisé ── */}
      <div className={`rounded-xl border ${adviceTone.border} ${adviceTone.bg} p-3.5 sm:p-4`}>
        <div className="flex items-start gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 ${adviceTone.text} flex-shrink-0`}>
            {adviceTone.icon}
          </span>
          <div className="min-w-0">
            <h2 className={`text-[13px] sm:text-sm font-semibold ${adviceTone.text}`}>
              {advice.title}
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs text-gray-700 leading-relaxed">
              {advice.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}