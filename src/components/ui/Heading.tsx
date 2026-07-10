import { forwardRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "display" | "hero" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  gradient?: boolean;
}

const sizeStyles: Record<HeadingSize, string> = {
  display: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
  hero: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  h1: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-xl sm:text-2xl md:text-3xl font-semibold",
  h4: "text-lg sm:text-xl md:text-2xl font-semibold",
  h5: "text-base sm:text-lg md:text-xl font-semibold",
  h6: "text-sm sm:text-base md:text-lg font-semibold",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = "h2", size, gradient = false, children, className = "", ...props }, ref) => {
    const Component = as;
    const resolvedSize = size || as;

    return (
      <Component
        ref={ref}
        className={`
          text-white
          ${sizeStyles[resolvedSize]}
          ${gradient ? "text-gradient" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";