"use client";

import { useState } from "react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import FounderMessage from "@/components/shared/FounderMessage";
import { Menu } from "lucide-react";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827] font-sans">
      <div className="fixed top-0 left-0 right-0 z-50">
        <GlobalNavbar />
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="lg:pl-[260px] pt-[64px] min-h-screen">
        <div className="lg:hidden sticky top-[64px] z-30 bg-[#FAFAFC]/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] text-[#64748B] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-[#111827]">Dashboard</span>
          <div className="w-9" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ✅ NOTIFICATION FONDATEUR ACTIVE DANS LE DASHBOARD */}
      <FounderMessage />
    </div>
  );
}