"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bell,
  Gift,
  Sparkles,
  Shield,
  Info,
  AlertCircle,
  CheckCheck,
  X,
  ArrowRight,
} from "lucide-react";
import type { AppNotification } from "@/hooks/useNotifications";

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "unread", label: "Non lues" },
  { id: "credits", label: "Crédits" },
  { id: "feature", label: "Nouveautés" },
  { id: "account", label: "Compte" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const ICONS: Record<string, typeof Bell> = {
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

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

interface NotificationPanelProps {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read_at);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const handleClick = (n: AppNotification) => {
    if (!n.read_at) onMarkAsRead(n.id);
    if (n.action_path) {
      router.push(n.action_path);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-slate-900/30 backdrop-blur-sm md:hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed right-3 left-3 top-[68px] z-[75] max-h-[calc(100dvh-90px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] md:absolute md:left-auto md:right-0 md:top-[calc(100%+8px)] md:w-[380px]"
        role="dialog"
        aria-label="Notifications"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6366F1]/10 px-1.5 text-[10px] font-bold text-[#6366F1]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
              Retrouvez ici les informations importantes concernant votre espace
              MakeItAds.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:text-[#6366F1]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tout marquer comme lu
            </button>
            <button
              onClick={() => {
                router.push("/notifications");
                onClose();
              }}
              className="text-[11px] font-medium text-[#6366F1] transition-colors hover:text-[#4f46e5]"
            >
              Voir tout
            </button>
          </div>
        )}

        {/* Filtres */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 px-3 py-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-[#6366F1]/10 text-[#6366F1]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Liste */}
        <div className="max-h-[calc(100dvh-280px)] overflow-y-auto md:max-h-[420px]">
          {loading && notifications.length === 0 ? (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl bg-slate-50 p-3"
                >
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                  <div className="mt-2 h-2 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <Bell className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-[13px] font-semibold text-slate-900">
                Vous êtes à jour
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Vous retrouverez ici les informations importantes concernant vos
                crédits, votre compte et les nouveautés MakeItAds.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((n) => {
                const Icon = ICONS[n.category] ?? Info;
                const colorClass = COLORS[n.category] ?? COLORS.system;
                const unread = !n.read_at;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        unread ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.4} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-[12.5px] leading-tight ${
                              unread
                                ? "font-semibold text-slate-900"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {n.title}
                          </p>
                          {unread && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-slate-500">
                          {n.message}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {timeAgo(n.created_at)}
                          </span>
                          {n.action_label && (
                            <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-[#6366F1]">
                              {n.action_label}
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </>
  );
}