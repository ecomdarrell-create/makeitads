'use client';

interface RadialStatProps {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
  color: string;
}

export function RadialStat({
  value,
  max,
  label,
  sublabel,
  color,
}: RadialStatProps) {
  const safeMax = Math.max(max, 1);
  const pct = Math.min(value / safeMax, 1);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  const gap = circumference - dash;

  return (
    <div className="relative flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="relative h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]">
        <svg
          viewBox="0 0 88 88"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg sm:text-2xl font-bold text-[#111827] leading-none">
            {value}
          </span>
        </div>
      </div>
      <p className="mt-2 text-[11px] sm:text-xs font-semibold text-[#111827] text-center leading-snug">
        {label}
      </p>
      {sublabel ? (
        <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-500 text-center leading-snug">
          {sublabel}
        </p>
      ) : null}
    </div>
  );
}