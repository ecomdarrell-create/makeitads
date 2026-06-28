"use client";

import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsDropdown from "./NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/components/providers/NotificationsProvider";

export default function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { unreadCount, lastNotification } = useNotifications();
  const { addToast } = useToast();
  const [hasPulse, setHasPulse] = useState(false);

  // ✅ DÉCLENCHER UN TOAST quand nouvelle notification arrive
  useEffect(() => {
    if (lastNotification && !isNotificationsOpen) {
      // Mapper le type de notification vers le type de toast
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

  // ✅ ANIMATION PULSE quand il y a des non-lues
  useEffect(() => {
    if (unreadCount > 0) {
      setHasPulse(true);
      const timer = setTimeout(() => setHasPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="fixed top-0 left-[260px] right-0 h-16 z-30 border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl flex items-center justify-between px-8">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search strategies, competitors..."
          className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
          <span className="text-[10px] font-bold text-slate-500">⌘</span>
          <span className="text-[10px] font-bold text-slate-500">K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell avec badge animé */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Bell className="h-4 w-4" />
            
            {/* Badge avec animation pulse */}
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#6366f1] ring-2 ring-[#080810] flex items-center justify-center px-1"
              >
                <span className="text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </motion.span>
            )}

            {/* Animation pulse autour de la cloche */}
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