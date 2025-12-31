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
} from "react-icons/fa";

const Dashboard = () => {
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-3">
              Here's what's happening with your projects and tasks today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <FaBullseye className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="text-sm opacity-80">Completion Rate</p>
                <p className="text-2xl font-bold">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <FaProjectDiagram className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <FaTasks className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-100 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mr-3">
              <FaProjectDiagram className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
          </div>
          {recentProjects.length > 0 ? (
            <ul className="space-y-4">
              {recentProjects.map((project) => (
                <li
                  key={project._id}
                  className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "on-hold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {project.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <FaProjectDiagram className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent projects</p>
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mr-3">
              <FaTasks className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
          </div>
          {recentTasks.length > 0 ? (
            <ul className="space-y-4">
              {recentTasks.map((task) => (
                <li
                  key={task._id}
                  className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === "todo"
                            ? "bg-gray-100 text-gray-800"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <FaTasks className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-left transition-all">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mr-4">
                <FaProjectDiagram className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">New Project</h4>
                <p className="text-blue-200">Start a new project</p>
              </div>
            </div>
          </button>
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-left transition-all">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mr-4">
                <FaTasks className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">New Task</h4>
                <p className="text-green-200">Create a new task</p>
              </div>
            </div>
          </button>
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-left transition-all">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mr-4">
                <FaUserFriends className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">New Team</h4>
                <p className="text-purple-200">Create a new team</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
