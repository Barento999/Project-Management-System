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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                Here's what's happening with your projects today
              </p>
            </div>
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg flex-shrink-0">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="group bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-blue-600 rounded-xl shadow-md group-hover:bg-blue-700 transition-colors flex-shrink-0">
                <FaProjectDiagram className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Projects
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-blue-600 rounded-xl shadow-md group-hover:bg-blue-700 transition-colors flex-shrink-0">
                <FaTasks className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Tasks
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-green-600 rounded-xl shadow-md group-hover:bg-green-700 transition-colors flex-shrink-0">
                <FaCheckCircle className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-amber-500 rounded-xl shadow-md group-hover:bg-amber-600 transition-colors flex-shrink-0">
                <FaClock className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.pendingTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Projects */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-lg shadow-md flex-shrink-0">
                <FaProjectDiagram className="text-white text-lg sm:text-xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recent Projects
              </h2>
            </div>
            {recentProjects.length > 0 ? (
              <ul className="space-y-3">
                {recentProjects.map((project) => (
                  <li
                    key={project._id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start gap-3">
                      <FaStar className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {project.description}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
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
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-lg shadow-md flex-shrink-0">
                <FaTasks className="text-white text-lg sm:text-xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recent Tasks
              </h2>
            </div>
            {recentTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentTasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start gap-3">
                      <FaFire className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 text-white text-xs font-semibold rounded-full ${
                            task.status === "done"
                              ? "bg-green-600"
                              : task.status === "in-progress"
                              ? "bg-blue-600"
                              : "bg-gray-400"
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
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="/teams"
              className="group p-4 sm:p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-blue-600 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors flex-shrink-0">
                  <FaUserFriends className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Team
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Create a team
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/projects"
              className="group p-4 sm:p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-blue-600 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors flex-shrink-0">
                  <FaProjectDiagram className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Project
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Start a project
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/tasks"
              className="group p-4 sm:p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-blue-600 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors flex-shrink-0">
                  <FaTasks className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                    New Task
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
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
