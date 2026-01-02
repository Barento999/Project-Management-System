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
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      name: "My Tasks",
      path: "/tasks/my",
      icon: <FaClipboardList />,
    },
    {
      name: "Time Tracking",
      path: "/time-tracking",
      icon: <FaClock />,
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
    <aside className="w-64 bg-white text-gray-900 shadow-2xl h-full flex flex-col border-r border-gray-200 relative">
      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-3 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
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
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 relative overflow-hidden">
                <span className="text-white font-bold text-base sm:text-lg z-10">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                {user?.name}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <span
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded-full font-bold shadow-sm ${
                    user?.role === "ADMIN"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
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
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}>
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-3 transition-all duration-300 ${
                      isActive(item.path, item.exact)
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 group-hover:bg-gray-300"
                    }`}>
                    <span className="text-base sm:text-lg">{item.icon}</span>
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-semibold truncate w-full">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] sm:text-[10px] ${item.badgeColor} text-white px-1.5 sm:px-2 py-0.5 rounded-full mt-1 font-medium shadow-sm`}>
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
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg">
            <FaSignOutAlt className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
