import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaFilter,
  FaCheckDouble,
} from "react-icons/fa";
import { notificationAPI } from "../services/api";

const NotificationsBeautiful = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, filter]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter === "unread" ? { unreadOnly: true } : {};
      const res = await notificationAPI.getAll(params);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  });

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.delete(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Navigate based on entity type
    if (notification.entityType === "Task") {
      navigate(`/tasks/${notification.entityId}`);
    } else if (notification.entityType === "Project") {
      navigate(`/projects/${notification.entityId}`);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      TASK_ASSIGNED: "📋",
      TASK_DUE: "⏰",
      TASK_COMPLETED: "✅",
      TASK_UPDATED: "🔄",
      PROJECT_UPDATED: "📁",
      COMMENT_ADDED: "💬",
      MENTION: "👤",
      TEAM_INVITE: "👥",
      PROJECT_INVITE: "📨",
    };
    return icons[type] || "🔔";
  };

  const getNotificationColor = (type) => {
    const colors = {
      TASK_ASSIGNED: "from-blue-100 to-indigo-100 border-blue-300",
      TASK_DUE: "from-orange-100 to-red-100 border-orange-300",
      TASK_COMPLETED: "from-green-100 to-emerald-100 border-green-300",
      TASK_UPDATED: "from-purple-100 to-pink-100 border-purple-300",
      PROJECT_UPDATED: "from-indigo-100 to-blue-100 border-indigo-300",
      COMMENT_ADDED: "from-pink-100 to-purple-100 border-pink-300",
      MENTION: "from-yellow-100 to-orange-100 border-yellow-300",
      TEAM_INVITE: "from-teal-100 to-cyan-100 border-teal-300",
      PROJECT_INVITE: "from-cyan-100 to-blue-100 border-cyan-300",
    };
    return colors[type] || "from-gray-100 to-gray-200 border-gray-300";
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return notifDate.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F7FB" }}>
        <div className="text-center">
          <FaBell className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: "#F5F7FB" }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            🔔 Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your team's activity
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">
                  {unreadCount}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                  <FaCheckDouble />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === "unread"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === "read"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-white/50 text-center">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications to show"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-gradient-to-r ${getNotificationColor(
                  notification.type
                )} backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${
                  !notification.isRead ? "ring-2 ring-blue-400" : ""
                }`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-4xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {formatTime(notification.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all flex items-center gap-1">
                            <FaCheck className="text-xs" />
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all flex items-center gap-1">
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotificationsBeautiful;
