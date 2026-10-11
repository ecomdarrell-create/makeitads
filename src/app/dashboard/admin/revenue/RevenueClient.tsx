'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Users,
} from 'lucide-react';
import { StatRing } from '@/components/dashboard/StatRing';
import { formatPriceFromXOF, getCurrencySymbol, normalizeCurrency } from '@/lib/currency';

interface Revenue {
  id: string;
  user_id: string | null;
  email: string;
  plan_id: string;
  amount_fcfa: number;
  source: string;
  order_id: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  plan: string;
}

interface Props {
  revenues: Revenue[];
  profiles: Profile[];
  currency?: string;
}

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Élite',
  recharge_10: 'Recharge +10',
  recharge_30: 'Recharge +30',
  recharge_80: 'Recharge +80',
};

const PLAN_COLORS: Record<string, string> = {
  pro: '#6366F1',
  premium: '#8B5CF6',
  enterprise: '#F59E0B',
  recharge_10: '#10B981',
  recharge_30: '#10B981',
  recharge_80: '#10B981',
};

type Period = '7d' | '30d' | '90d' | 'all';

export function RevenueClient({ revenues, profiles, currency = 'XOF' }: Props) {
  const [period, setPeriod] = useState<Period>('30d');
  const [mounted, setMounted] = useState(false);

  // ✅ On ne calcule les dates qu'après le mount → zéro hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const safeCurrency = normalizeCurrency(currency);
  const currencySymbol = getCurrencySymbol(safeCurrency);

  // ─── Filtrage par période ───
  const filteredRevenues = useMemo(() => {
    if (!mounted) return revenues;
    if (period === 'all') return revenues;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    return revenues.filter((r) => new Date(r.created_at).getTime() > cutoff);
  }, [revenues, period, mounted]);

  // ─── Stats globales ───
  const stats = useMemo(() => {
    const totalRevenue = filteredRevenues.reduce((sum, r) => sum + r.amount_fcfa, 0);
    const totalSales = filteredRevenues.length;
    const avgOrder = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;
    const uniqueCustomers = new Set(filteredRevenues.map((r) => r.email)).size;

    let monthRevenue = 0;
    if (mounted) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      monthRevenue = revenues
        .filter((r) => new Date(r.created_at).getTime() >= startOfMonth.getTime())
        .reduce((sum, r) => sum + r.amount_fcfa, 0);
    } else {
      monthRevenue = revenues.reduce((sum, r) => sum + r.amount_fcfa, 0);
    }

    return {
      totalRevenue,
      totalSales,
      avgOrder,
      uniqueCustomers,
      monthRevenue,
    };
  }, [filteredRevenues, revenues, mounted]);

  // ─── Évolution du CA par jour (30 jours) ───
  const revenueByDay = useMemo(() => {
    if (!mounted) return [];

    const days: { date: string; label: string; amount: number }[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const amount = revenues
        .filter((r) => {
          const t = new Date(r.created_at).getTime();
          return t >= day.getTime() && t < nextDay.getTime();
        })
        .reduce((sum, r) => sum + r.amount_fcfa, 0);

      days.push({
        date: day.toISOString().split('T')[0],
        label: day.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          timeZone: 'UTC',
        }),
        amount,
      });
    }
    return days;
  }, [revenues, mounted]);

  // ─── Courbe SVG ───
  const chartData = useMemo(() => {
    if (revenueByDay.length === 0) {
      return { points: [], pathD: '', areaD: '', max: 0, width: 1000, height: 200 };
    }

    const values = revenueByDay.map((d) => d.amount);
    const max = Math.max(...values, 1);

    const width = 1000;
    const height = 200;
    const padding = 20;

    const points = revenueByDay.map((d, i) => {
      const x = padding + (i / (revenueByDay.length - 1)) * (width - padding * 2);
      const y = height - padding - (d.amount / max) * (height - padding * 2);
      return { x, y, ...d };
    });

    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return { points, pathD, areaD, max, width, height };
  }, [revenueByDay]);

  // ─── Ventilation par plan ───
  const revenueByPlan = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};

    filteredRevenues.forEach((r) => {
      if (!map[r.plan_id]) map[r.plan_id] = { count: 0, amount: 0 };
      map[r.plan_id].count += 1;
      map[r.plan_id].amount += r.amount_fcfa;
    });

    return Object.entries(map)
      .map(([planId, data]) => ({ planId, ...data }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredRevenues]);

  const maxPlanRevenue = Math.max(...revenueByPlan.map((p) => p.amount), 1);

  const recentSales = filteredRevenues.slice(0, 15);

  // ✅ Formatage date sécurisé pour SSR — uniquement après mount
  const formatDate = (iso: string) => {
    if (!mounted) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  };

  return (
    <div className="space-y-4">
      {/* ═══ FILTRE PÉRIODE ═══ */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: '7d' as Period, label: '7 jours' },
          { key: '30d' as Period, label: '30 jours' },
          { key: '90d' as Period, label: '90 jours' },
          { key: 'all' as Period, label: 'Tout' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              period === key
                ? 'border-[#6366F1] bg-[#6366F1] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══ STATS ANNEAUX ═══ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatRing
            value={Math.round(stats.totalRevenue / 1000)}
            max={Math.max(Math.round(stats.totalRevenue / 1000), 100)}
            label="CA total"
            unit={`K ${currencySymbol}`}
            color="#10B981"
            size={90}
          />
          <StatRing
            value={stats.totalSales}
            max={Math.max(stats.totalSales, 10)}
            label="Ventes"
            unit="Commandes"
            color="#6366F1"
            size={90}
          />
          <StatRing
            value={Math.round(stats.avgOrder / 1000)}
            max={Math.max(Math.round(stats.avgOrder / 1000), 50)}
            label="Panier moyen"
            unit={`K ${currencySymbol}`}
            color="#8B5CF6"
            size={90}
          />
          <StatRing
            value={stats.uniqueCustomers}
            max={Math.max(stats.uniqueCustomers, 10)}
            label="Clients"
            unit="Uniques"
            color="#F59E0B"
            size={90}
          />
        </div>

        {/* Revenu du mois */}
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                Chiffre d&apos;affaires · Mois en cours
              </p>
              <p className="mt-1 text-2xl font-bold text-[#18181B]" suppressHydrationWarning>
                {formatPriceFromXOF(stats.monthRevenue, safeCurrency)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COURBE D'ÉVOLUTION ═══ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#18181B]">
              Évolution du CA
            </h3>
            <p className="text-[10px] text-slate-500" suppressHydrationWarning>
              30 derniers jours · max : {mounted ? formatPriceFromXOF(chartData.max, safeCurrency) : '—'}
            </p>
          </div>
        </div>

        {mounted && chartData.points.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                className="h-48 w-full min-w-[600px]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1={20}
                    x2={chartData.width - 20}
                    y1={chartData.height - 20 - ratio * (chartData.height - 40)}
                    y2={chartData.height - 20 - ratio * (chartData.height - 40)}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                ))}

                <motion.path
                  d={chartData.areaD}
                  fill="url(#revGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />

                <motion.path
                  d={chartData.pathD}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                {chartData.points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={p.amount > 0 ? 3.5 : 2}
                    fill={p.amount > 0 ? '#6366F1' : '#CBD5E1'}
                  >
                    <title>
                      {p.label} : {formatPriceFromXOF(p.amount, safeCurrency)}
                    </title>
                  </circle>
                ))}
              </svg>
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-slate-400">
              <span>{revenueByDay[0]?.label}</span>
              <span>{revenueByDay[revenueByDay.length - 1]?.label}</span>
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-xs text-slate-400">
              {mounted ? 'Aucune donnée sur cette période.' : 'Chargement…'}
            </p>
          </div>
        )}
      </div>

      {/* ═══ VENTILATION PAR PLAN ═══ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Revenus par produit
          </h3>
        </div>

        {revenueByPlan.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            Aucune vente sur cette période.
          </p>
        ) : (
          <div className="space-y-4">
            {revenueByPlan.map((item, index) => {
              const percentage = (item.amount / maxPlanRevenue) * 100;
              const globalShare =
                stats.totalRevenue > 0
                  ? (item.amount / stats.totalRevenue) * 100
                  : 0;

              return (
                <div key={item.planId}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background: PLAN_COLORS[item.planId] || '#94A3B8',
                        }}
                      />
                      <span className="text-xs font-semibold text-[#18181B]">
                        {PLAN_LABELS[item.planId] || item.planId}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        · {item.count} vente{item.count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#18181B]">
                      {formatPriceFromXOF(item.amount, safeCurrency)}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: PLAN_COLORS[item.planId] || '#94A3B8' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[9px] text-slate-400">
                    {globalShare.toFixed(1)}% du CA total
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ DERNIÈRES VENTES ═══ */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-[#18181B]">
              Dernières ventes
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            {recentSales.length} sur {filteredRevenues.length}
          </span>
        </div>

        {recentSales.length === 0 ? (
          <p className="py-10 text-center text-xs text-slate-400">
            Aucune vente sur cette période.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: PLAN_COLORS[sale.plan_id] || '#94A3B8',
                    }}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#18181B]">
                      {sale.email}
                    </p>
                    <p className="truncate text-[10px] text-slate-500" suppressHydrationWarning>
                      {PLAN_LABELS[sale.plan_id] || sale.plan_id} · {formatDate(sale.created_at)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  +{formatPriceFromXOF(sale.amount_fcfa, safeCurrency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}