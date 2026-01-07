import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPlus,
  FaInbox,
  FaPaperPlane,
  FaClock,
  FaSearch,
  FaStar,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { notificationAPI } from "../services/api";

const Messages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await notificationAPI.delete(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "inbox") {
      return matchesSearch;
    } else if (activeTab === "sent") {
      // In a real app, you'd filter by sent messages
      return false;
    } else if (activeTab === "starred") {
      // In a real app, you'd have a starred field
      return matchesSearch && notif.type === "MENTION";
    }
    return matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const starredCount = notifications.filter((n) => n.type === "MENTION").length;
  const todayCount = notifications.filter((n) => {
    const today = new Date();
    const notifDate = new Date(n.createdAt);
    return notifDate.toDateString() === today.toDateString();
  }).length;

  const quickStats = [
    { label: "Unread", value: unreadCount.toString(), icon: <FaEnvelope /> },
    {
      label: "Total",
      value: notifications.length.toString(),
      icon: <FaPaperPlane />,
    },
    { label: "Starred", value: starredCount.toString(), icon: <FaStar /> },
    { label: "Today", value: todayCount.toString(), icon: <FaClock /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaEnvelope className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 mt-1">Communicate with your team</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/messages/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
              <FaPlus /> New Message
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-lg text-white text-xl">
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Message Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/messages/inbox")}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FaInbox className="text-4xl text-blue-600" />
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inbox</h3>
              <p className="text-gray-500 text-sm">
                View your received messages
              </p>
            </div>
            <div className="bg-blue-50 px-6 py-3 border-t border-gray-200">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                Open →
              </button>
            </div>
          </div>

          <div
            onClick={() => navigate("/messages/sent")}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FaPaperPlane className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sent</h3>
              <p className="text-gray-500 text-sm">View your sent messages</p>
            </div>
            <div className="bg-green-50 px-6 py-3 border-t border-gray-200">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                Open →
              </button>
            </div>
          </div>

          <div
            onClick={() => navigate("/messages/new")}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FaPlus className="text-4xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                New Message
              </h3>
              <p className="text-gray-500 text-sm">
                Compose and send a new message
              </p>
            </div>
            <div className="bg-purple-50 px-6 py-3 border-t border-gray-200">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                Open →
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === "inbox"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}>
              Inbox
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === "sent"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}>
              Sent
            </button>
            <button
              onClick={() => setActiveTab("starred")}
              className={`px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === "starred"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}>
              Starred
            </button>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer ${
                    !notif.read ? "bg-blue-50" : "bg-gray-50"
                  }`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {notif.title?.charAt(0) || "N"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold ${
                          !notif.read ? "text-gray-900" : "text-gray-700"
                        }`}>
                        {notif.title || "Notification"}
                      </h4>
                      <div className="flex items-center gap-2">
                        {notif.type === "MENTION" && (
                          <FaStar className="text-amber-500 text-sm" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-1 ${
                        !notif.read
                          ? "text-gray-900 font-semibold"
                          : "text-gray-700"
                      }`}>
                      {notif.type}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {notif.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-green-600 transition-all"
                        title="Mark as read">
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif._id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete">
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
