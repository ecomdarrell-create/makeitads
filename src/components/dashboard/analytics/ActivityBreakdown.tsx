'use client';

import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BreakdownItem {
  name: string;
  value: number;
  color: string;
}

interface ActivityBreakdownProps {
  items: BreakdownItem[];
}

export function ActivityBreakdown({ items }: ActivityBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = useMemo(() => items.reduce((s, i) => s + i.value, 0), [items]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <h2 className="text-[13px] sm:text-sm font-semibold text-[#111827] mb-3">
        Répartition des actions
      </h2>

      {total === 0 ? (
        <p className="py-8 text-center text-[11px] sm:text-xs text-gray-500">
          Aucune action enregistrée pour le moment.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="none"
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {items.map((item, i) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                      style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    fontSize: 11,
                    padding: '6px 10px',
                  }}
                  formatter={(value, name) => {
                    const v = Number(value) || 0;
                    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                    return [`${v} (${pct}%)`, String(name)];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full space-y-2">
            {items.map((item, i) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    activeIndex === i ? 'bg-slate-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-[11px] sm:text-xs text-gray-700 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-shrink-0">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#111827]">
                      {item.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">
                      {pct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}