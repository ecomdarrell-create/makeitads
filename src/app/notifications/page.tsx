"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Gift,
  Sparkles,
  Shield,
  Info,
  AlertCircle,
  CheckCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";

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
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("all");
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read_at);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const handleClick = (n: AppNotification) => {
    if (!n.read_at) markAsRead(n.id);
    if (n.action_path) router.push(n.action_path);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-10">
        {/* Retour */}
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#6366F1] sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au dashboard
        </Link>

        {/* En-tête */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6366F1]/10 px-1.5 text-[10px] font-bold text-[#6366F1] sm:text-[11px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Retrouvez ici les informations importantes concernant vos crédits,
              votre compte et les nouveautés MakeItAds.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:text-sm"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  active
                    ? "bg-[#6366F1] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Contenu */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          {loading && notifications.length === 0 ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-slate-50 p-4">
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                  <div className="mt-2 h-2 w-full rounded bg-slate-100" />
                  <div className="mt-1 h-2 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Impossible de charger les notifications
              </p>
              <p className="mt-1 text-xs text-slate-500">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                {filter === "all" ? "Vous êtes à jour" : "Aucune notification"}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                {filter === "all"
                  ? "Vous retrouverez ici les informations importantes concernant vos crédits, votre compte et les nouveautés MakeItAds."
                  : "Essayez un autre filtre pour voir plus de notifications."}
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
                      className={`flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:gap-4 sm:px-5 ${
                        unread ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${colorClass}`}
                      >
                        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.4} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-[13px] leading-tight sm:text-sm ${
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
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                          {n.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 sm:text-[11px]">
                            {timeAgo(n.created_at)}
                          </span>
                          {n.action_label && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#6366F1] sm:text-xs">
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

          {/* Load more */}
          {hasMore && !loading && filtered.length > 0 && filter === "all" && (
            <div className="border-t border-slate-100 p-3 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#6366F1] transition-colors hover:bg-indigo-50 disabled:opacity-50 sm:text-sm"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Chargement…
                  </>
                ) : (
                  "Charger plus"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}