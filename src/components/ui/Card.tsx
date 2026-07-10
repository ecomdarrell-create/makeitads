import { forwardRef } from "react";

type CardVariant = "default" | "elevated" | "interactive" | "glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-background-card border border-white/[0.06]",
  elevated: "bg-background-elevated border border-white/[0.08] shadow-elevated",
  interactive: "bg-background-card border border-white/[0.06] hover:border-brand/30 hover:shadow-card-hover hover:-translate-y-0.5",
  glass: "glass",
};

const paddingStyles = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-10",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const interactiveVariant = hover ? "interactive" : variant;

    return (
      <div
        ref={ref}
        className={`
          rounded-card
          transition-all duration-250 ease-out
          ${variantStyles[interactiveVariant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Composant Card.Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

// Composant Card.Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = "", ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-lg sm:text-xl font-semibold text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = "CardTitle";

// Composant Card.Description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = "", ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-foreground-secondary mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

// Composant Card.Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

// Composant Card.Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t border-white/[0.06] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";