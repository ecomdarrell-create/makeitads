"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  category: "welcome" | "credits" | "feature" | "account" | "system";
  title: string;
  message: string;
  action_label: string | null;
  action_path: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  expires_at: string | null;
  target_plan: string | null; // ✅ NOUVEAU
}

const PAGE_SIZE = 20;

export function useNotifications() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [userPlan, setUserPlan] = useState<string>('free');

  const seenToastIds = useRef<Set<string>>(new Set());
  const offsetRef = useRef(0);

  const fetchNotifications = useCallback(
    async (reset = true) => {
      if (!user) return;

      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const supabase = createClient();
        const from = reset ? 0 : offsetRef.current;
        const to = from + PAGE_SIZE - 1;

        // ✅ Récupérer le plan du user
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .maybeSingle();

        const currentPlan = profile?.plan || 'free';
        setUserPlan(currentPlan);

        // ✅ Filtre : notifications ciblées à son plan OU non ciblées
        const { data, error: fetchError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .or(`target_plan.is.null,target_plan.eq.${currentPlan}`)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;

        const list = (data ?? []) as AppNotification[];

        if (reset) {
          setNotifications(list);
          setUnreadCount(list.filter((n) => !n.read_at).length);

          const fresh = list
            .filter((n) => !n.read_at && !seenToastIds.current.has(n.id))
            .slice(0, 3);
          if (fresh.length > 0) {
            fresh.forEach((n) => seenToastIds.current.add(n.id));
            setToasts((prev) => [...fresh, ...prev].slice(0, 3));
          }
        } else {
          setNotifications((prev) => [...prev, ...list]);
        }

        setHasMore(list.length === PAGE_SIZE);
        offsetRef.current = to + 1;
      } catch {
        setError("Impossible de charger les notifications.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchNotifications(false);
  }, [fetchNotifications, hasMore, loadingMore]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setToasts([]);
      setHasMore(true);
      seenToastIds.current = new Set();
      offsetRef.current = 0;
      return;
    }
    fetchNotifications(true);

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresInsertPayload<AppNotification>) => {
          const notif = payload.new;

          // ✅ Filtrer en temps réel aussi : ignorer si ciblée pour un autre plan
          if (notif.target_plan && notif.target_plan !== userPlan) {
            return;
          }

          setNotifications((prev) => [notif, ...prev]);
          setUnreadCount((c) => c + 1);

          if (!seenToastIds.current.has(notif.id)) {
            seenToastIds.current.add(notif.id);
            setToasts((prev) => [notif, ...prev].slice(0, 3));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications, userPlan]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!user) return;
      const now = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((n) => (n.id === id && !n.read_at ? { ...n, read_at: now } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read_at: now })
        .eq("id", id)
        .eq("user_id", user.id)
        .is("read_at", null);

      if (updateError) fetchNotifications(true);
    },
    [user, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const now = new Date().toISOString();

    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now }))
    );
    setUnreadCount(0);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);

    if (updateError) fetchNotifications(true);
  }, [user, fetchNotifications]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    loading: loading || authLoading,
    loadingMore,
    hasMore,
    error,
    toasts,
    dismissToast,
    refetch: () => fetchNotifications(true),
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}