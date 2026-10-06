import type { ReactNode } from 'react';

export function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <span className="ml-1 font-bold text-rose-600" aria-hidden="true">*</span>
      <span className="sr-only"> (obligatoire)</span>
    </>
  );
}