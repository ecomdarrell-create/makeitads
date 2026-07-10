"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pressed?: boolean;
}

// Styles cohérents pour toutes les variantes
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-brand hover:bg-brand-hover text-white 
    shadow-[0_4px_12px_rgba(99,102,241,0.3)] 
    hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]
  `,
  secondary: `
    bg-white/[0.05] hover:bg-white/[0.1] text-white 
    border border-white/10 hover:border-white/20
  `,
  ghost: `
    bg-transparent hover:bg-white/[0.05] 
    text-slate-300 hover:text-white
  `,
  outline: `
    bg-transparent border border-white/10 
    text-white hover:bg-white/[0.05]
  `,
  danger: `
    bg-danger hover:bg-red-600 text-white 
    shadow-[0_4px_12px_rgba(239,68,68,0.3)]
  `,
};

// Tailles cohérentes (hauteurs fixes)
const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-[36px] px-3 text-xs gap-1.5",
  md: "h-[44px] px-5 text-sm gap-2",
  lg: "h-[52px] px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center
          rounded-[10px] font-medium
          transition-all duration-200 ease-out
          active:scale-[0.98] active:opacity-90
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background
          select-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children && <span className="truncate">{children}</span>}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";