import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaCalendarAlt,
  FaChartBar,
  FaBell,
  FaSearch,
  FaFilter,
  FaStar,
  FaComments,
  FaFileAlt,
  FaHome,
  FaChartLine,
  FaFolder,
  FaEnvelope,
  FaCog as FaCog2,
  FaUserFriends,
  FaClipboardList,
  FaCalendarCheck,
  FaFileInvoice,
  FaUsersCog,
  FaClock,
} from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  // Navigation items for regular users
  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <FaHome />,
      exact: true,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: <FaUserFriends />,
      badge: "1️⃣ Start Here",
      badgeColor: "bg-green-500",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaProjectDiagram />,
      badge: "2️⃣ Then",
      badgeColor: "bg-blue-500",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
      badge: "3️⃣ Finally",
      badgeColor: "bg-purple-500",
    },
    {
      name: "My Tasks",
      path: "/tasks/my",
      icon: <FaClipboardList />,
      badge: "📋 NEW",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Time Tracking",
      path: "/time-tracking",
      icon: <FaClock />,
      badge: "⏱️ NEW",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      name: "Timesheet",
      path: "/timesheet",
      icon: <FaChartBar />,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartLine />,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: <FaFileInvoice />,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <FaEnvelope />,
    },
  ];

  // Navigation items for admin users
  const adminNavItems = [
    ...navItems,
    {
      name: "Admin Panel",
      path: "/admin",
      icon: <FaUsersCog />,
    },
  ];

  const currentNavItems = user?.role === "ADMIN" ? adminNavItems : navItems;

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl h-full flex flex-col border-r border-white/10 relative backdrop-blur-md bg-opacity-95">
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-3 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/40 to-blue-800/40 backdrop-blur-sm relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="text-white font-bold text-base sm:text-lg z-10 drop-shadow-lg">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
                {user?.name}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <span
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded-full font-bold shadow-lg ${
                    user?.role === "ADMIN"
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        {/* <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects, tasks, teams..."
              className="w-full px-4 py-3 pl-11 bg-gradient-to-r from-gray-700/40 to-gray-800/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-700/50 rounded-lg">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div> */}

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto relative z-10 min-h-0">
          <ul className="space-y-1">
            {currentNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 group ${
                    isActive(item.path, item.exact)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl transform scale-[1.02]"
                      : "text-blue-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:translate-x-1"
                  }`}>
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-3 transition-all duration-300 ${
                      isActive(item.path, item.exact)
                        ? "bg-white/20 text-white shadow-lg"
                        : "bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:scale-110"
                    }`}>
                    <span className="text-base sm:text-lg">{item.icon}</span>
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-semibold truncate w-full">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] sm:text-[10px] ${item.badgeColor} text-white px-1.5 sm:px-2 py-0.5 rounded-full mt-1 font-medium shadow-md`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out Button - Always visible at bottom */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-white/20 bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-md shadow-inner">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:via-red-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-1 hover:scale-105 border-2 border-red-400/50 hover:border-red-300 relative overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

            <div className="p-2 sm:p-2.5 bg-white/30 rounded-lg mr-2 sm:mr-3 shadow-lg relative z-10">
              <FaSignOutAlt className="text-white text-base sm:text-lg" />
            </div>
            <span className="text-sm sm:text-base relative z-10">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
