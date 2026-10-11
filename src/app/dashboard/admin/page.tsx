import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ArrowRight,
  BarChart3,
  Coins,
  Crown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { StatRing } from '@/components/dashboard/StatRing';
import { AdminRevenueChart } from '@/components/dashboard/AdminRevenueChart';

const ADMIN_EMAILS = ['ecomdarrell@gmail.com', 'darrellkamga@gmail.com'];

const PLAN_PRICES_XOF: Record<string, number> = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

export default async function AdminPage() {
  // 1) Auth classique pour vérifier l'identité
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false;
  if (!isAdmin) redirect('/dashboard');

  // 2) Client admin (bypass RLS) pour voir TOUTES les données
  const admin = createAdminClient();

  // 3) Fetch parallèle
  const [profilesRes, strategiesRes, transactionsRes, revenueRes] = await Promise.all([
    admin.from('profiles').select('id, plan, created_at'),
    admin.from('strategies').select('id, type, created_at'),
    admin.from('credit_transactions').select('id, amount, created_at'),
    admin.from('revenue_transactions').select('id, amount_fcfa, created_at').order('created_at', { ascending: true }),
  ]);

  const profiles = profilesRes.data ?? [];
  const strategies = strategiesRes.data ?? [];
  const transactions = transactionsRes.data ?? [];
  const revenues = revenueRes.data ?? [];

  // ─── Calculs ───
  const totalUsers = profiles.length;
  const free = profiles.filter((p) => p.plan === 'free').length;
  const pro = profiles.filter((p) => p.plan === 'pro').length;
  const premium = profiles.filter((p) => p.plan === 'premium').length;
  const enterprise = profiles.filter((p) => p.plan === 'enterprise').length;
  const payingUsers = pro + premium + enterprise;

  const totalStrategies = strategies.length;
  const flashCount = strategies.filter((s) => s.type === 'flash').length;
  const completeCount = strategies.filter((s) => s.type === 'complete').length;

  const totalCreditsUsed = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // CA total (en XOF base)
  const totalRevenueXOF = revenues.reduce((sum, r) => sum + (r.amount_fcfa || 0), 0);

  // CA par jour sur 30 derniers jours (courbe)
  const now = new Date();
  const dailyRevenue: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dailyRevenue.push({
      date: d.toISOString().slice(0, 10),
      revenue: 0,
    });
  }
  const dailyMap = new Map(dailyRevenue.map((d) => [d.date, d]));
  revenues.forEach((r) => {
    if (!r.created_at) return;
    const d = new Date(r.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const entry = dailyMap.get(key);
    if (entry) entry.revenue += r.amount_fcfa || 0;
  });

  // Cartes de navigation
  const cards = [
    {
      href: '/dashboard/admin/analytics',
      icon: BarChart3,
      color: '#6366F1',
      bg: 'bg-indigo-50',
      title: 'Analytics',
      description: 'Utilisateurs, inscriptions, crédits consommés',
    },
    {
      href: '/dashboard/admin/revenue',
      icon: TrendingUp,
      color: '#10B981',
      bg: 'bg-emerald-50',
      title: 'Revenus',
      description: 'Transactions Chariow, historique détaillé',
    },
  ];

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      {/* En-tête */}
      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white shadow-sm sm:h-10 sm:w-10">
          <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-[#111827] sm:text-xl">
            Espace Admin
          </h1>
          <p className="mt-0.5 text-[10px] leading-relaxed text-gray-600 sm:text-xs">
            Vue complète de votre SaaS MakeItAds.
          </p>
        </div>
      </div>

      {/* ═══ Anneaux — 2 cols mobile, 4 cols desktop ═══ */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 mb-4 sm:mb-5">
        <StatRing
          value={totalUsers}
          max={Math.max(totalUsers, 50)}
          label="Utilisateurs"
          unit="Total"
          color="#6366F1"
          size={90}
        />
        <StatRing
          value={payingUsers}
          max={Math.max(totalUsers, 10)}
          label="Payants"
          unit="Clients"
          color="#10B981"
          size={90}
        />
        <StatRing
          value={totalStrategies}
          max={Math.max(totalStrategies, 50)}
          label="Stratégies"
          unit="Générées"
          color="#8B5CF6"
          size={90}
        />
        <StatRing
          value={totalCreditsUsed}
          max={Math.max(totalCreditsUsed, 500)}
          label="Crédits"
          unit="Consommés"
          color="#F59E0B"
          size={90}
        />
      </div>

      {/* ═══ Graphique CA — courbe ═══ */}
      <div className="mb-4 sm:mb-5">
        <AdminRevenueChart
          data={dailyRevenue}
          totalXOF={totalRevenueXOF}
        />
      </div>

      {/* ═══ Répartition par plan (barres fines) ═══ */}
      <div className="mb-4 sm:mb-5 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5">
        <h3 className="mb-3 text-[12px] font-semibold text-[#111827] sm:text-sm">
          Répartition des plans
        </h3>
        <div className="space-y-2.5">
          {[
            { plan: 'Démo', count: free, color: '#94A3B8' },
            { plan: 'Pro', count: pro, color: '#6366F1' },
            { plan: 'Premium', count: premium, color: '#8B5CF6' },
            { plan: 'Élite', count: enterprise, color: '#F59E0B' },
          ].map(({ plan, count, color }) => {
            const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
            return (
              <div key={plan}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                      style={{ background: color }}
                    />
                    <span className="text-[11px] font-semibold text-[#111827] sm:text-xs">
                      {plan}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
                    {count} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 sm:h-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ background: color, width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Cartes de navigation ═══ */}
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-[#6366F1]/40 hover:shadow-md sm:p-5"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${card.bg}`}
              style={{ color: card.color }}
            >
              <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-semibold text-[#111827] sm:text-base">
                {card.title}
              </h3>
              <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                {card.description}
              </p>
              <span
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold transition-transform group-hover:translate-x-0.5 sm:mt-2 sm:text-xs"
                style={{ color: card.color }}
              >
                Ouvrir
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Note */}
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-800 sm:mt-5 sm:text-[11px]">
        <strong>Accès restreint :</strong> cette page n&apos;est visible que par
        les emails administrateurs. Aucun autre utilisateur ne peut y accéder.
      </p>
    </div>
  );
}