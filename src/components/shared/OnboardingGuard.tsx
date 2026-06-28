"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    const checkOnboarding = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed, current_onboarding_step")
        .eq("id", user.id)
        .single();

      if (!data || !data.onboarding_completed) {
        // Rediriger vers l'étape sauvegardée ou étape 1
        const step = data?.current_onboarding_step || 1;
        router.replace(`/onboarding?step=${step}`);
      } else {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}