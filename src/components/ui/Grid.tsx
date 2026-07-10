import { forwardRef } from "react";

type GridCols = {
  mobile?: 1 | 2 | 3 | 4;
  tablet?: 1 | 2 | 3 | 4;
  desktop?: 1 | 2 | 3 | 4 | 5 | 6;
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  gap?: "sm" | "md" | "lg" | "xl";
}

const gapStyles = {
  sm: "gap-3",
  md: "gap-4 md:gap-5",
  lg: "gap-5 md:gap-6",
  xl: "gap-6 md:gap-8",
};

const getColsClass = (cols: number | undefined, prefix: string = "") => {
  if (!cols) return "";
  return `${prefix}grid-cols-${cols}`;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = { mobile: 1, tablet: 2, desktop: 3 }, gap = "md", children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          grid
          ${getColsClass(cols.mobile)}
          ${cols.tablet ? `sm:${getColsClass(cols.tablet)}` : ""}
          ${cols.desktop ? `lg:${getColsClass(cols.desktop)}` : ""}
          ${gapStyles[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";