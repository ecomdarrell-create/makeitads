import type { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return <div className="transition-opacity duration-300 ease-out animate-[fadeIn_0.25s_ease-out]">{children}</div>;
}
