import Link from 'next/link';

interface CreditCenterProps {
  balance: number;
  used: number;
  flashCount: number;
  completeCount: number;
}

export function CreditCenter({ balance, used, flashCount, completeCount }: CreditCenterProps) {
  const total = balance + used;
  const generatedStrategies = flashCount + completeCount;
  const ringStats = [
    {
      label: 'Restants',
      value: balance,
      percent: total > 0 ? (balance / total) * 100 : 100,
      color: '#6366F1',
      softColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Flash',
      value: flashCount,
      percent: generatedStrategies > 0 ? (flashCount / generatedStrategies) * 100 : 0,
      color: '#8B5CF6',
      softColor: 'bg-violet-50 text-violet-700',
    },
    {
      label: 'Complètes',
      value: completeCount,
      percent: generatedStrategies > 0 ? (completeCount / generatedStrategies) * 100 : 0,
      color: '#10B981',
      softColor: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const renderRing = (item: typeof ringStats[number]) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (item.percent / 100) * circumference;

    return (
      <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="relative h-16 w-16 shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${item.softColor}`}>
            {item.label}
          </div>
          <p className="mt-2 text-[10px] text-slate-600">
            {item.label === 'Restants'
              ? 'Crédits disponibles'
              : item.label === 'Flash'
                ? 'Diagnostics rapides'
                : 'Stratégies complètes'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <h3 className="text-xs sm:text-sm font-semibold text-[#111827] mb-1">Votre utilisation</h3>
      <p className="text-[10px] text-gray-500 mb-3 sm:mb-4">{used} crédits utilisés au total</p>

      <div className="space-y-3 mb-4 sm:mb-5">
        {ringStats.map(renderRing)}
      </div>

      <Link
        href="/dashboard/credits"
        className="block w-full text-center text-[10px] sm:text-xs font-medium text-[#6366F1] bg-indigo-50 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-100 transition-colors"
      >
        Voir l'historique →
      </Link>
    </div>
  );
}