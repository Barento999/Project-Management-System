import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaRocket,
  FaChartBar,
  FaCog,
  FaHome,
  FaProjectDiagram,
} from "react-icons/fa";
import NotificationBell from "./NotificationBell";
import GlobalSearch from "./GlobalSearch";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white w-full fixed top-0 left-0 z-50 border-b border-gray-200">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center flex-1 min-w-0">
            {/* Mobile menu button */}
            {user && (
              <button
                onClick={onMenuClick}
                className="md:hidden mr-2 p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors duration-200 flex-shrink-0">
                <FaBars className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            <Link
              to="/"
              className="flex items-center group min-w-0 flex-shrink">
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl mr-1.5 sm:mr-2 md:mr-3 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <FaRocket className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-400 rounded-full border border-slate-900 sm:border-2 flex items-center justify-center animate-pulse">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  ProjectFlow
                </h1>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-light hidden sm:block truncate">
                  Project Management
                </p>
              </div>
            </Link>

            {/* Navigation links for desktop - only show when user is logged in */}
            {user && (
              <nav className="hidden lg:flex ml-4 xl:ml-10 space-x-1">
                <Link
                  to="/dashboard"
                  className="px-3 xl:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center">
                  <FaHome className="mr-2 h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="px-3 xl:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center">
                  <FaProjectDiagram className="mr-2 h-4 w-4" /> Projects
                </Link>
                <Link
                  to="/tasks"
                  className="px-3 xl:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center">
                  <FaChartBar className="mr-2 h-4 w-4" /> Tasks
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
            {/* Global Search - hidden on mobile */}
            {user && (
              <div className="hidden lg:block">
                <GlobalSearch />
              </div>
            )}

            {/* Notification Bell - only show when user is logged in */}
            {user && <NotificationBell />}

            {/* User dropdown - show login/register buttons when not logged in */}
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs xl:text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] xl:text-xs text-gray-500 font-medium">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full flex-shrink-0">
                    <div className="bg-blue-600 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base">
                      {user?.name?.charAt(0)?.toUpperCase() || (
                        <FaUser className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </button>
                </div>

                {/* Dropdown menu - shows when profile is clicked */}
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-2 bg-white ring-1 ring-gray-200 focus:outline-none z-50 border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || (
                            <FaUser className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="px-5 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center border-l-4 border-transparent hover:border-blue-500"
                      onClick={() => setIsMenuOpen(false)}>
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <FaUser className="h-4 w-4 text-blue-600" />
                      </div>
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="px-5 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center border-l-4 border-transparent hover:border-blue-500"
                      onClick={() => setIsMenuOpen(false)}>
                      <div className="p-2 bg-purple-50 rounded-lg mr-3">
                        <FaCog className="h-4 w-4 text-purple-600" />
                      </div>
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full px-5 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center border-l-4 border-transparent hover:border-red-500 text-left">
                      <div className="p-2 bg-red-50 rounded-lg mr-3">
                        <FaSignOutAlt className="h-4 w-4 text-red-600" />
                      </div>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show login/register buttons when not logged in
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 rounded-lg transition-colors duration-200">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
