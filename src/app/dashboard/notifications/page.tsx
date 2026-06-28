"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  FileText,
  ArrowRight,
  Loader2,
  CheckCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-emerald-500/10 text-emerald-400";
      case "info": return "bg-[#38bdf8]/10 text-[#38bdf8]";
      case "warning": return "bg-amber-500/10 text-amber-400";
      case "competitor": return "bg-purple-500/10 text-purple-400";
      default: return "bg-[#6366f1]/10 text-[#6366f1]";
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return Sparkles;
      case "info": return FileText;
      case "warning": return RefreshCw;
      case "competitor": return Eye;
      default: return Bell;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-slate-400">Stay updated with your strategies and competitors</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-6">
            <Bell className="h-10 w-10 text-[#8b5cf6]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No notifications yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            You'll receive notifications here when your strategies are generated, competitors change, or new features are available.
          </p>
          <button
            onClick={() => router.push("/dashboard/strategies/new")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Generate your first strategy
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = getIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                  !notification.is_read 
                    ? "border-[#6366f1]/30 bg-[#6366f1]/5 hover:border-[#6366f1]/50" 
                    : "border-white/10 bg-[#0f0f1a] hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${getIconColor(notification.type)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-base font-bold ${!notification.is_read ? "text-white" : "text-slate-300"}`}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1] flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{formatTimeAgo(notification.created_at)}</span>
                      {notification.link && (
                        <span className="text-xs text-[#8b5cf6] flex items-center gap-1 font-medium">
                          View details <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}