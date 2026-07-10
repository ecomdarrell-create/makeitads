"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  isFocused: boolean;
}

export default function PasswordToggle({ isFocused }: PasswordToggleProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      tabIndex={-1}
    >
      <AnimatePresence mode="wait">
        {showPassword ? (
          <motion.div
            key="eye-off"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EyeOff className={`h-4.5 w-4.5 ${isFocused ? "text-[#6366f1]" : ""}`} strokeWidth={2} />
          </motion.div>
        ) : (
          <motion.div
            key="eye"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Eye className={`h-4.5 w-4.5 ${isFocused ? "text-[#6366f1]" : ""}`} strokeWidth={2} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// Hook pour gérer l'état du mot de passe
export function usePasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);
  const toggle = () => setShowPassword(!showPassword);
  return { showPassword, toggle };
}