"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NotificationsDropdown from "./NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/components/providers/NotificationsProvider";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { unreadCount, lastNotification } = useNotifications();
  const { addToast } = useToast();
  const [hasPulse, setHasPulse] = useState(false);

  useEffect(() => {
    if (lastNotification && !isNotificationsOpen) {
      const toastType = lastNotification.type === "warning" ? "info" : 
                       lastNotification.type === "competitor" ? "notification" :
                       lastNotification.type === "success" ? "success" : "info";

      addToast({
        type: toastType,
        title: lastNotification.title,
        message: lastNotification.message,
        duration: 5000,
      });
    }
  }, [lastNotification, addToast, isNotificationsOpen]);

  useEffect(() => {
    if (unreadCount > 0) {
      setHasPulse(true);
      const timer = setTimeout(() => setHasPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="fixed top-0 left-0 right-0 md:left-[260px] h-[64px] z-30 border-b border-white/10 bg-[#0a0a14]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger button - mobile uniquement */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-white/10 bg-[#0f0f1a] text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Logo - cliquable vers landing page */}
        <Link 
          href="/" 
          className="flex items-center gap-0.5 cursor-pointer group"
        >
          <span className="text-base md:text-[17px] font-bold text-white tracking-tight group-hover:opacity-80 transition-opacity">
            Make
          </span>
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-base md:text-[17px] font-bold text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
            ItAds
          </span>
        </Link>

        {/* Search - desktop uniquement */}
        <div className="hidden md:block relative ml-6 w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search strategies, competitors..."
            className="w-full h-[44px] rounded-[10px] border border-white/10 bg-[#0f0f1a] py-2 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 placeholder:text-slate-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5">
            <span className="text-[10px] font-bold text-slate-400">⌘</span>
            <span className="text-[10px] font-bold text-slate-400">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-white/10 bg-[#0f0f1a] text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#6366f1] ring-2 ring-[#0a0a14] flex items-center justify-center px-1"
              >
                <span className="text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </motion.span>
            )}

            <AnimatePresence>
              {hasPulse && unreadCount > 0 && (
                <>
                  <motion.span
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 rounded-lg bg-[#6366f1]/30 pointer-events-none"
                  />
                  <motion.span
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-0 rounded-lg bg-[#6366f1]/20 pointer-events-none"
                  />
                </>
              )}
            </AnimatePresence>
          </button>
          
          <NotificationsDropdown 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
}