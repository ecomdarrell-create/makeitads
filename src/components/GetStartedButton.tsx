"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

interface GetStartedButtonProps {
  planName: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function GetStartedButton({ 
  planName, 
  className = '',
  variant = 'primary'
}: GetStartedButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout/redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push(`/auth/login?redirect=/dashboard/billing&plan=${planName}`);
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#6366f1]/25 hover:scale-[1.02] active:scale-[0.98] px-6 py-3",
    secondary: "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.05] px-6 py-3"
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          Get Started
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}