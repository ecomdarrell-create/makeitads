'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatPriceFromXOF } from '@/lib/currency';

interface DataPoint {
  date: string;
  revenue: number;
}

interface AdminRevenueChartProps {
  data: DataPoint[];
  totalXOF: number;
  currency?: string;
}

const RANGES = [
  { label: '7 j', days: 7 },
  { label: '30 j', days: 30 },
];

export function AdminRevenueChart({
  data,
  totalXOF,
  currency = 'XOF',
}: AdminRevenueChartProps) {
  const [days, setDays] = useState(30);

  const sliced = useMemo(
    () =>
      data.slice(-days).map((d) => ({
        ...d,
        shortDate: formatShortDate(d.date),
      })),
    [data, days]
  );

  const totalRange = sliced.reduce((s, d) => s + d.revenue, 0);
  const hasData = totalRange > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2 flex-wrap sm:mb-4">
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-9 sm:w-9">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 sm:text-[11px]">
              Chiffre d&apos;affaires
            </p>
            <p className="mt-0.5 text-lg font-bold text-[#111827] sm:text-2xl">
              {formatPriceFromXOF(totalXOF, currency)}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              Cumul total · {sliced.length} derniers jours :{' '}
              {formatPriceFromXOF(totalRange, currency)}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-full bg-slate-100 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors sm:px-3 sm:text-[11px] ${
                days === r.days
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {hasData ? (
        <div className="h-[180px] sm:h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sliced}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="shortDate"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v) =>
                  v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 11,
                  padding: '6px 10px',
                }}
                labelStyle={{ color: '#64748B', fontSize: 10 }}
                formatter={(value) => {
                  const v = Number(value) || 0;
                  return [formatPriceFromXOF(v, currency), 'CA'];
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#revenueLine)"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{
                  r: 4,
                  fill: '#10B981',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-8 text-center text-[11px] text-slate-400 sm:text-xs">
          Aucun revenu enregistré sur cette période.
        </p>
      )}
    </div>
  );
}

function formatShortDate(iso: string) {
  const [y, m, d] = iso.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}