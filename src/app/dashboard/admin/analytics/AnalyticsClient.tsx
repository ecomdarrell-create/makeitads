'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Zap,
  DollarSign,
  Crown,
  BarChart3,
} from 'lucide-react';
import { StatRing } from '@/components/dashboard/StatRing';
import { getCurrencySymbol, normalizeCurrency, formatPrice } from '@/lib/currency';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  plan: string;
  credits_balance: number;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  created_at: string;
}

interface Strategy {
  id: string;
  user_id: string;
  type: string;
  credits_cost: number;
  created_at: string;
}

interface Props {
  profiles: Profile[];
  transactions: Transaction[];
  strategies: Strategy[];
  currency?: string;
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Démo',
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Élite',
};

const PLAN_COLORS: Record<string, string> = {
  free: '#94A3B8',
  pro: '#6366F1',
  premium: '#8B5CF6',
  enterprise: '#F59E0B',
};

// ✅ Prix en XOF (base) — convertis dynamiquement à l'affichage
const PLAN_PRICES_XOF: Record<string, number> = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

export function AnalyticsClient({ profiles, transactions, strategies, currency = 'XOF' }: Props) {
  // ✅ Symbole de la devise cible
  const currencySymbol = getCurrencySymbol(normalizeCurrency(currency));

  // ─── Stats globales ───
  const stats = useMemo(() => {
    const totalUsers = profiles.length;
    const free = profiles.filter((p) => p.plan === 'free').length;
    const pro = profiles.filter((p) => p.plan === 'pro').length;
    const premium = profiles.filter((p) => p.plan === 'premium').length;
    const enterprise = profiles.filter((p) => p.plan === 'enterprise').length;

    // Revenu annuel brut (en XOF) → mensuel
    const monthlyRevenueXOF =
      (pro * PLAN_PRICES_XOF.pro +
        premium * PLAN_PRICES_XOF.premium +
        enterprise * PLAN_PRICES_XOF.enterprise) /
      12;

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const creditsUsed = transactions
      .filter(
        (t) =>
          t.amount < 0 &&
          new Date(t.created_at).getTime() > oneWeekAgo &&
          !t.type.startsWith('refund')
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalUsers,
      free,
      pro,
      premium,
      enterprise,
      monthlyRevenueXOF,
      creditsUsed,
      payingUsers: pro + premium + enterprise,
    };
  }, [profiles, transactions]);

  const signupsByDay = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = profiles.filter((p) => {
        const t = new Date(p.created_at).getTime();
        return t >= day.getTime() && t < nextDay.getTime();
      }).length;

      days.push({
        date: day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        count,
      });
    }
    return days;
  }, [profiles]);

  const maxSignups = Math.max(...signupsByDay.map((d) => d.count), 1);

  const creditsByType = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const map: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.amount >= 0) return;
      if (new Date(t.created_at).getTime() < thirtyDaysAgo) return;

      const type = t.type.replace('generation_', '');
      map[type] = (map[type] || 0) + Math.abs(t.amount);
    });

    return Object.entries(map)
      .map(([type, amount]) => ({ type, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topUsers = useMemo(() => {
    const userMap: Record<string, number> = {};

    strategies.forEach((s) => {
      userMap[s.user_id] = (userMap[s.user_id] || 0) + 1;
    });

    return Object.entries(userMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => {
        const profile = profiles.find((p) => p.id === userId);
        return {
          id: userId,
          name: profile?.first_name || profile?.email?.split('@')[0] || 'Utilisateur',
          email: profile?.email || '',
          plan: profile?.plan || 'free',
          strategiesCount: count,
        };
      });
  }, [strategies, profiles]);

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════ */}
      {/* CARTE 1 — VUE GLOBALE */}
      {/* ═══════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">Vue globale</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatRing
            value={stats.totalUsers}
            max={Math.max(stats.totalUsers, 100)}
            label="Utilisateurs"
            unit="Total"
            color="#6366F1"
            size={90}
          />
          <StatRing
            value={stats.payingUsers}
            max={Math.max(stats.totalUsers, 10)}
            label="Payants"
            unit="Clients"
            color="#10B981"
            size={90}
          />
          <StatRing
            value={stats.creditsUsed}
            max={Math.max(stats.creditsUsed, 100)}
            label="Crédits"
            unit="7 jours"
            color="#8B5CF6"
            size={90}
          />
          <StatRing
            value={Math.round(stats.monthlyRevenueXOF)}
            max={Math.max(Math.round(stats.monthlyRevenueXOF), 50000)}
            label="Revenu"
            unit={`${currencySymbol}/mois`}
            color="#F59E0B"
            size={90}
          />
        </div>
      </div>

      {/* CARTE 2 — RÉPARTITION PAR PLAN */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Crown className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Répartition par plan
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { plan: 'free', count: stats.free },
            { plan: 'pro', count: stats.pro },
            { plan: 'premium', count: stats.premium },
            { plan: 'enterprise', count: stats.enterprise },
          ].map(({ plan, count }) => {
            const percentage =
              stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;

            return (
              <div key={plan}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: PLAN_COLORS[plan] }}
                    />
                    <span className="text-xs font-semibold text-[#18181B]">
                      {PLAN_LABELS[plan]}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {count} · {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: PLAN_COLORS[plan] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARTE 3 — INSCRIPTIONS 30 JOURS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Inscriptions · 30 derniers jours
          </h3>
        </div>

        <div className="flex h-32 items-end gap-1">
          {signupsByDay.map((day, index) => (
            <div key={index} className="group relative flex flex-1 flex-col items-center">
              <motion.div
                className="w-full rounded-t bg-[#6366F1] transition-all hover:bg-[#5558e6]"
                initial={{ height: 0 }}
                animate={{
                  height: `${(day.count / maxSignups) * 100}%`,
                  minHeight: day.count > 0 ? '4px' : '1px',
                }}
                transition={{ duration: 0.5, delay: index * 0.01 }}
                title={`${day.date} : ${day.count} inscription${day.count > 1 ? 's' : ''}`}
              />
              {day.count > 0 && (
                <span className="pointer-events-none absolute -top-5 hidden text-[10px] font-bold text-[#6366F1] group-hover:block">
                  {day.count}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-slate-400">
          <span>{signupsByDay[0]?.date}</span>
          <span>{signupsByDay[signupsByDay.length - 1]?.date}</span>
        </div>
      </div>

      {/* CARTE 4 — CRÉDITS CONSOMMÉS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Crédits consommés · 30 derniers jours
          </h3>
        </div>

        {creditsByType.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            Aucune consommation sur les 30 derniers jours.
          </p>
        ) : (
          <div className="space-y-3">
            {creditsByType.map(({ type, amount }, index) => {
              const max = creditsByType[0].amount;
              const percentage = max > 0 ? (amount / max) * 100 : 0;
              const label =
                type === 'flash'
                  ? 'Diagnostics Flash'
                  : type === 'complete'
                    ? 'Stratégies Complètes'
                    : type === 'purchase'
                      ? 'Achats de plans'
                      : type === 'recharge'
                        ? 'Recharges'
                        : type;

              return (
                <div key={index}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#18181B]">
                      {label}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {amount} crédits
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-[#F59E0B]"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CARTE 5 — TOP 5 UTILISATEURS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <Users className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Top 5 utilisateurs actifs
          </h3>
        </div>

        {topUsers.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            Aucun utilisateur actif pour l&apos;instant.
          </p>
        ) : (
          <div className="space-y-2">
            {topUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: PLAN_COLORS[user.plan] }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#18181B]">
                      {user.name}
                    </p>
                    <p className="truncate text-[10px] text-slate-500">
                      {PLAN_LABELS[user.plan] || user.plan}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#6366F1]/10 px-2.5 py-1 text-[10px] font-bold text-[#6366F1]">
                  {user.strategiesCount} strat.
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}