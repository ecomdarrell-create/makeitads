"use client";

import { motion } from "framer-motion";

type Props = {
  currentStep: number; // 0 à 7
  totalSteps: number;
  labels?: string[];
};

export default function ProgressBar({ currentStep, totalSteps }: Props) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Points de progression */}
      <div className="flex items-center justify-between mb-3">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-[#6366F1] text-white"
                    : isCurrent
                      ? "bg-[#6366F1] text-white ring-4 ring-[#6366F1]/20"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className="mx-1 h-[2px] flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isDone ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full bg-[#6366F1]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Texte */}
      <div className="flex items-center justify-between text-[11px] text-[#71717A]">
        <span className="font-semibold text-[#6366F1]">
          Étape {currentStep + 1} sur {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}