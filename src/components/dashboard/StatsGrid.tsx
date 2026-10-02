interface StatsGridProps {
  totalStrategies: number;
  flashCount: number;
  completeCount: number;
  creditsUsed: number;
  creditsAvailable: number;
}

export function StatsGrid({
  totalStrategies,
  flashCount,
  completeCount,
  creditsUsed,
  creditsAvailable,
}: StatsGridProps) {
  const stats = [
    { label: 'Stratégies générées', value: totalStrategies },
    { label: 'Diagnostics', value: flashCount },
    { label: 'Crédits utilisés', value: creditsUsed },
    { label: 'Crédits disponibles', value: creditsAvailable },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
        >
          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#111827]">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}