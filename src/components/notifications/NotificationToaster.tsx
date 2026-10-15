"use client";

import { AnimatePresence } from "framer-motion";
import { NotificationToast } from "./NotificationToast";
import type { AppNotification } from "@/hooks/useNotifications";

interface NotificationToasterProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}

export function NotificationToaster({
  toasts,
  onDismiss,
  onRead,
}: NotificationToasterProps) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 right-4 z-[110] flex flex-col items-center gap-2 sm:left-auto sm:items-end"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((notif) => (
          <NotificationToast
            key={notif.id}
            notification={notif}
            onDismiss={() => onDismiss(notif.id)}
            onRead={() => onRead(notif.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}