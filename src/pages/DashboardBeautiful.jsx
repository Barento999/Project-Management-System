import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { projectAPI, taskAPI } from "../services/api";
import {
  FaUserFriends,
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaBullseye,
  FaRocket,
  FaStar,
  FaFire,
} from "react-icons/fa";

const DashboardBeautiful = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          projectAPI.getAll(),
          taskAPI.getAll(),
        ]);

        const projects = projectsResponse.data.projects || [];
        const tasks = tasksResponse.data.tasks || [];

        const completedTasks = tasks.filter(
          (task) => task.status === "done"
        ).length;
        const pendingTasks = tasks.filter(
          (task) => task.status !== "done"
        ).length;

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks,
          pendingTasks,
        });

        setRecentProjects(projects.slice(0, 5));
        setRecentTasks(tasks.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({
          totalProjects: 0,
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaRocket className="text-blue-600 text-2xl animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Here's what's happening with your projects today
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FaBullseye className="text-xl sm:text-2xl" />
                  <div>
                    <p className="text-xs sm:text-sm opacity-90">
                      Completion Rate
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {stats.totalTasks > 0
                        ? Math.round(
                            (stats.completedTasks / stats.totalTasks) * 100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="group bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <FaProjectDiagram className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <FaTasks className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Tasks
                </p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.totalTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <FaCheckCircle className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <FaClock className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {stats.pendingTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Projects */}
          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <FaProjectDiagram className="text-white text-lg sm:text-xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recent Projects
              </h2>
            </div>
            {recentProjects.length > 0 ? (
              <ul className="space-y-4">
                {recentProjects.map((project, index) => (
                  <li
                    key={project._id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start gap-3">
                      <FaStar className="text-yellow-500 text-lg mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {project.description}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FaProjectDiagram className="mx-auto text-5xl text-gray-300 mb-4" />
                <p className="text-gray-500">No recent projects</p>
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <FaTasks className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Recent Tasks
              </h2>
            </div>
            {recentTasks.length > 0 ? (
              <ul className="space-y-4">
                {recentTasks.map((task, index) => (
                  <li
                    key={task._id}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start gap-3">
                      <FaFire className="text-orange-500 text-lg mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 text-white text-xs font-bold rounded-full ${
                            task.status === "done"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600"
                              : task.status === "in-progress"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                              : "bg-gradient-to-r from-gray-500 to-gray-600"
                          }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FaTasks className="mx-auto text-5xl text-gray-300 mb-4" />
                <p className="text-gray-500">No recent tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="/teams"
              className="group p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaUserFriends className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Team
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Create a team
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/projects"
              className="group p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaProjectDiagram className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Project
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Start a project
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/tasks"
              className="group p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaTasks className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Task
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Create a task
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
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

export default DashboardBeautiful;
