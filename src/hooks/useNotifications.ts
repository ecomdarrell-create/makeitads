import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      setNotifications((prev: Notification[]) =>
        prev.map((n: Notification) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .eq("is_read", false);

      setNotifications((prev: Notification[]) =>
        prev.map((n: Notification) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const lastNotification = notifications.length > 0 ? notifications[0] : null;

  return {
    notifications,
    loading,
    unreadCount,
    lastNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}