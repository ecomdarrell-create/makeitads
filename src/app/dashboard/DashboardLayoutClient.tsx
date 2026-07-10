"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Onboarding from "@/components/Onboarding";
import { ToastProvider } from "@/components/providers/NotificationsProvider";
import { MobileDrawer } from "@/components/ui/MobileDrawer";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import PageTransition from "@/components/ui/PageTransition";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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

  const openMobileDrawer = () => setIsMobileDrawerOpen(true);
  const closeMobileDrawer = () => setIsMobileDrawerOpen(false);

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
        {/* Sidebar Desktop - cachée sur mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Topbar responsive avec logo cliquable */}
        <Topbar onMenuClick={openMobileDrawer} />

        {/* Main content - padding adaptatif corrigé */}
        <main className="md:ml-[260px] min-h-screen pt-[64px]">
          <div className="p-4 sm:p-6 lg:p-8">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

        {/* Mobile Drawer avec animation fluide */}
        <MobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={closeMobileDrawer}
          position="left"
        >
          <MobileSidebar onClose={closeMobileDrawer} />
        </MobileDrawer>

        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </div>
    </ToastProvider>
  );
}