"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Crown, 
  Sparkles,
  MoreHorizontal,
  Zap,
  FileText,
  Eye,
  Calendar,
  BarChart3,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
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
    // Marquer comme lu
    await markAsRead(notification.id);
    
    // Rediriger vers le lien si disponible
    if (notification.link) {
      onClose();
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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-[380px] rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#6366f1]/20 px-2 py-0.5 text-[10px] font-bold text-[#a78bfa]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-semibold text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#6366f1] mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 mb-1">No notifications yet</p>
                  <p className="text-xs text-slate-500">Run your first scan to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.slice(0, 10).map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-white/[0.03] transition-colors cursor-pointer ${!notification.is_read ? "bg-white/[0.02]" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${getIconColor(notification.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${!notification.is_read ? "font-semibold text-white" : "font-medium text-slate-300"}`}>
                                {notification.title}
                              </p>
                              {!notification.is_read && (
                                <span className="h-2 w-2 rounded-full bg-[#6366f1] flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-[10px] text-slate-500">{formatTimeAgo(notification.created_at)}</p>
                              {notification.link && (
                                <span className="text-[10px] text-[#8b5cf6] flex items-center gap-1">
                                  View <ArrowRight className="h-2.5 w-2.5" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-[#080810]/50">
              <a 
                href="/dashboard/notifications"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  window.location.href = "/dashboard/notifications";
                }}
                className="w-full rounded-lg py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                View all notifications
                <MoreHorizontal className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}