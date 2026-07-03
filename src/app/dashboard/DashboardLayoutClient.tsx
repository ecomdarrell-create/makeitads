"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Onboarding from "@/components/Onboarding";
import { ToastProvider } from "@/components/providers/NotificationsProvider";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const onboardingCompleted = user.user_metadata?.onboarding_completed;
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }

      setLoading(false);
    };

    checkOnboarding();
  }, [router]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080810]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#080810]">
        <Sidebar />
        <Topbar />
        <main className="ml-[260px] pt-16 p-8">
          {children}
        </main>

        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </div>
    </ToastProvider>
  );
}