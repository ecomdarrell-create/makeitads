"use client";

import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  isOpen?: boolean;
}

export function NotificationBell({ unreadCount, onClick, isOpen }: NotificationBellProps) {
  const display = unreadCount > 9 ? "9+" : String(unreadCount);
  const showBadge = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        showBadge ? `Notifications (${unreadCount} non lues)` : "Notifications"
      }
      aria-expanded={isOpen}
      className="relative flex h-8 w-8 md:h-9 md:w-9 items-center justify-center text-slate-900 transition-colors hover:text-[#6366F1]"
    >
      <Bell
        className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]"
        strokeWidth={2.6}
      />

      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#6366F1] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white"
          >
            {display}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}