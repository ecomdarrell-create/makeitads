"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface GlobalBackButtonProps {
  className?: string;
  onClick?: () => void;
  label?: string;
}

export default function GlobalBackButton({ className = "", onClick, label = "Back" }: GlobalBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className={`inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group ${className}`}
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  );
}