'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PremiumLoaderProps {
  fullScreen?: boolean;
  message?: string;
  size?: number;
}

export function PremiumLoader({
  fullScreen = false,
  message,
  size = 130,
}: PremiumLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const remaining = 95 - current;
      if (remaining <= 0) return;
      const step = Math.max(0.3, remaining * 0.075);
      current = Math.min(95, current + step);
      setProgress(current);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/92 backdrop-blur-md'
    : 'flex flex-col items-center justify-center py-20 px-4';

  return (
    <div className={wrapperClass}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ring SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="loader-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#loader-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            filter="url(#loader-glow)"
            style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
          />
        </svg>

        {/* Halo conique rotatif */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.15) 90deg, transparent 180deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* ✅ TON LOGO au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: size * 0.45, height: size * 0.45 }}
            className="relative"
          >
            <Image
              src="/images/logo-m.png"
              alt="MakeItAds"
              fill
              className="object-contain"
              sizes={`${Math.round(size * 0.45)}px`}
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span
          className="text-3xl font-bold text-slate-900 tabular-nums sm:text-4xl"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {Math.floor(progress)}
        </span>
        <span className="text-lg font-semibold text-slate-400 sm:text-xl">%</span>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 max-w-xs text-center text-xs text-slate-500 sm:text-sm"
        >
          {message}
        </motion.p>
      )}

      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300 sm:text-[11px]">
        MakeItAds
      </p>
    </div>
  );
}