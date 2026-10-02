'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = 'Retour' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:text-[#6366F1] hover:border-[#6366F1]/30 transition-colors mb-3"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}