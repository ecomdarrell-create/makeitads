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

interface DataPoint {
  date: string;
  count: number;
}

interface ActivityChartProps {
  data: DataPoint[];
}

const RANGES: { label: string; days: number }[] = [
  { label: '7 j', days: 7 },
  { label: '30 j', days: 30 },
  { label: '90 j', days: 90 },
];

export function ActivityChart({ data }: ActivityChartProps) {
  const [days, setDays] = useState<number>(30);

  const sliced = useMemo(() => {
    return data.slice(-days).map((d) => ({
      ...d,
      shortDate: formatShortDate(d.date),
    }));
  }, [data, days]);

  const total = sliced.reduce((s, d) => s + d.count, 0);
  const hasData = total > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827]">
            Activité
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
            {total} génération{total > 1 ? 's' : ''} sur les {days} derniers jours
          </p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium rounded-full transition-colors ${
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

      {hasData ? (
        <div className="h-[180px] sm:h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sliced}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activityLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
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
                allowDecimals={false}
                width={28}
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
                  return [`${v} génération${v > 1 ? 's' : ''}`, ''];
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#activityLine)"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#6366F1', strokeWidth: 0 }}
                activeDot={{ r: 4.5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-8 text-center text-[11px] sm:text-xs text-gray-500">
          Aucune activité sur cette période.
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