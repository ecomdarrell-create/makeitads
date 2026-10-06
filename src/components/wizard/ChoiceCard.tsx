"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
};

export default function ChoiceCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex w-full items-start gap-3 rounded-[16px] border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-[#6366F1] bg-[#6366F1]/5 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.3)]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {icon && (
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            selected ? "bg-[#6366F1] text-white" : "bg-gray-100 text-[#475569]"
          }`}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#18181B]">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] text-[#71717A] leading-snug">
            {description}
          </p>
        )}
      </div>
      {selected && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366F1]">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
}