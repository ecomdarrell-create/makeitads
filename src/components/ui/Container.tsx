import { forwardRef } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", padding = true, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          w-full mx-auto
          ${sizeStyles[size]}
          ${padding ? "px-mobile" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

// Section avec espacement responsive
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl";
}

const sectionSpacing: Record<string, string> = {
  sm: "py-12 md:py-16 lg:py-20",
  md: "py-16 md:py-20 lg:py-24",
  lg: "py-20 md:py-24 lg:py-32",
  xl: "py-24 md:py-32 lg:py-40",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ spacing = "md", children, className = "", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={`${sectionSpacing[spacing]} ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";