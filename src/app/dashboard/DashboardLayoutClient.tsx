"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import GlobalNavbar from "@/components/shared/GlobalNavbar"; // Ta navbar (inchangée)
import { Menu } from "lucide-react";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // 🎯 GLOBAL BACKGROUND SYSTEM : Fond clair premium
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827] font-sans">
      
      {/* Navbar (inchangée, mais s'assure d'être au-dessus) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GlobalNavbar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="lg:pl-[260px] pt-[64px] min-h-screen">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden sticky top-[64px] z-30 bg-[#FAFAFC]/80 backdrop-blur-md border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] text-[#64748B] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-[#111827]">Dashboard</span>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        {/* Page Content with Premium Spacing */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}