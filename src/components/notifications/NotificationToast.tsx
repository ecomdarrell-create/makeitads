"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Gift,
  Sparkles,
  Shield,
  Info,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import type { AppNotification } from "@/hooks/useNotifications";

const ICONS: Record<string, typeof Info> = {
  welcome: Sparkles,
  credits: Gift,
  feature: Info,
  account: Shield,
  system: AlertCircle,
};

const COLORS: Record<string, string> = {
  welcome: "text-indigo-600 bg-indigo-50",
  credits: "text-emerald-600 bg-emerald-50",
  feature: "text-violet-600 bg-violet-50",
  account: "text-amber-600 bg-amber-50",
  system: "text-slate-600 bg-slate-100",
};

// MODIFICATION 1 : Catégories qui ne disparaissent jamais automatiquement
const PERSISTENT_CATEGORIES: Array<AppNotification["category"]> = [
  "welcome",
  "credits",
];

interface NotificationToastProps {
  notification: AppNotification;
  onDismiss: () => void;
  onRead: () => void;
  // MODIFICATION 6 : callbacks pour ouvrir le panneau au clic
  onOpenPanel?: () => void;
}

export function NotificationToast({
  notification,
  onDismiss,
  onRead,
  onOpenPanel,
}: NotificationToastProps) {
  const router = useRouter();
  const Icon = ICONS[notification.category] ?? Info;
  const colorClass = COLORS[notification.category] ?? COLORS.system;

  // MODIFICATION 1 : pas d'auto-dismiss pour welcome et credits
  const isPersistent = PERSISTENT_CATEGORIES.includes(notification.category);

  useEffect(() => {
    if (isPersistent) return;
    const timer = setTimeout(onDismiss, 7000);
    return () => clearTimeout(timer);
  }, [onDismiss, isPersistent]);

  // MODIFICATION 6 : clic sur le corps du toast = marquer comme lu + ouvrir le panneau
  const handleBodyClick = () => {
    if (!notification.read_at) onRead();
    onOpenPanel?.();
    onDismiss();
  };

  // Bouton "action" (ex: "Voir mes crédits") — comportement préservé
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.read_at) onRead();
    if (notification.action_path) {
      router.push(notification.action_path);
    }
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={handleBodyClick}
      className="pointer-events-auto w-[min(360px,calc(100vw-24px))] cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all hover:border-slate-300 hover:shadow-[0_16px_48px_rgba(15,23,42,0.16)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-3 p-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorClass}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold leading-tight text-slate-900">
              {notification.title}
            </p>

            {/* MODIFICATION 2 : croix de fermeture plus visible */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              aria-label="Fermer la notification"
              className="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-90"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-slate-600">
            {notification.message}
          </p>

          {notification.action_label && notification.action_path && (
            <button
              type="button"
              onClick={handleAction}
              className="mt-2 inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#6366F1] transition-colors hover:text-[#4f46e5]"
            >
              {notification.action_label}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}