"use client";

import { Loader2 } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function AuthButton({ 
  loading = false, 
  children, 
  disabled,
  className = "",
  ...props 
}: AuthButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`
        relative w-full h-12 rounded-xl
        bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1]
        text-white text-sm font-semibold
        shadow-[0_4px_20px_rgba(99,102,241,0.4)]
        hover:shadow-[0_6px_30px_rgba(99,102,241,0.6)]
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        transition-all duration-200 ease-out
        ${className}
      `}
      {...props}
    >
      {/* Effet glass subtil */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Contenu */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}