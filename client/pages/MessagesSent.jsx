import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPlus,
  FaPaperPlane,
  FaClock,
  FaSearch,
  FaStar,
  FaTimes,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { notificationAPI } from "../services/api";

const MessagesSent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await notificationAPI.getAll();
      // In a real app, you'd filter by sent messages
      // For now, we'll show all notifications as a demo
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
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

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickStats = [
    {
      label: "Total Sent",
      value: notifications.length.toString(),
      icon: <FaPaperPlane />,
    },
    {
      label: "This Week",
      value: notifications
        .filter((n) => {
          const weekAgo = new Date(Date.now() - 7 * 86400000);
          return new Date(n.createdAt) > weekAgo;
        })
        .length.toString(),
      icon: <FaClock />,
    },
    {
      label: "Today",
      value: notifications
        .filter((n) => {
          const today = new Date();
          const notifDate = new Date(n.createdAt);
          return notifDate.toDateString() === today.toDateString();
        })
        .length.toString(),
      icon: <FaEnvelope />,
    },
    {
      label: "Important",
      value: notifications
        .filter((n) => n.type === "MENTION")
        .length.toString(),
      icon: <FaStar />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaPaperPlane className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading sent messages...</p>
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
              <button
                onClick={() => navigate("/messages")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div className="p-3 bg-green-600 rounded-xl">
                <FaPaperPlane className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Sent Messages
                </h1>
                <p className="text-gray-500 mt-1">
                  Messages you have sent to your team
                </p>
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
              placeholder="Search sent messages..."
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
                <div className="p-3 bg-green-600 rounded-lg text-white text-xl">
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sent Messages List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-600 rounded-lg">
              <FaPaperPlane className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sent Messages</h2>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <FaPaperPlane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sent messages found</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      <FaPaperPlane />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
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
                    <p className="text-sm mb-1 text-gray-700">{notif.type}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {notif.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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

export default MessagesSent;
