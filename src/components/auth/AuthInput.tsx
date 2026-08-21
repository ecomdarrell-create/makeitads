"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label?: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon: Icon, label, error, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[#475569]">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Icône */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon 
              className={`h-4.5 w-4.5 transition-colors duration-200 ${
                isFocused ? "text-[#6366f1]" : "text-[#94A3B8]"
              }`}
              strokeWidth={2}
            />
          </div>

          {/* Input */}
          <input
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full h-12 rounded-xl border bg-white
              pl-11 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8]
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20
              ${error 
                ? "border-red-500/50 focus:border-red-500" 
                : isFocused 
                  ? "border-[#6366f1]/50 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                  : "border-[#E5E7EB] hover:border-[#CBD5E1]"
              }
              ${className}
            `}
            {...props}
          />

          {/* Glow effect au focus */}
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
              }}
            />
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 flex items-center gap-1.5"
          >
            <span className="h-1 w-1 rounded-full bg-red-500" />
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";