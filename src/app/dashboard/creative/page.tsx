"use client";

import { usePlan } from "@/hooks/usePlan";

export default function CreativeStudioPage() {
  const { isPro, isPremium } = usePlan();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white">Creative Studio</h1>
      <p className="text-slate-400 mt-2">
        Pro: {isPro ? "Yes" : "No"} | Premium: {isPremium ? "Yes" : "No"}
      </p>
    </div>
  );
}