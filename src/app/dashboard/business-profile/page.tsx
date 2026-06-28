"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function BusinessProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers le Strategy Builder après 1.5s
    const timer = setTimeout(() => {
      router.replace("/dashboard/strategies/new");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Business Profile Moved</h3>
        <p className="text-sm text-slate-400 mb-4">
          The Business Profile is now integrated into the Strategy Builder.
          <br />
          Redirecting you there...
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-[#8b5cf6]">
          <span>Go to Strategy Builder</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </motion.div>
    </div>
  );
}