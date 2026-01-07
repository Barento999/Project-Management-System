import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaArrowRight,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { projectAPI, taskAPI, teamAPI, activityLogAPI } from "../services/api";

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes, teamsRes, activityRes] = await Promise.all([
        projectAPI.getAll(),
        taskAPI.getAll(),
        teamAPI.getAll(),
        activityLogAPI.getAll({ limit: 5 }),
      ]);

      setProjects(projectsRes.data.projects || []);
      setTasks(tasksRes.data.tasks || []);
      setTeams(teamsRes.data.teams || []);
      setRecentActivity(activityRes.data.activityLogs || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProjects([]);
      setTasks([]);
      setTeams([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const activeProjects = projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;

  const totalMembers = teams.reduce(
    (acc, team) => acc + (team.members?.length || 0),
    0
  );
  const activeTeams = teams.filter(
    (t) => t.members && t.members.length > 0
  ).length;

  // Calculate this month's projects
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthProjects = projects.filter((p) => {
    const createdDate = new Date(p.createdAt);
    return createdDate >= thisMonth;
  }).length;

  const reportCategories = [
    {
      title: "Project Reports",
      description: "View project progress, timelines, and metrics",
      icon: <FaProjectDiagram className="text-4xl text-blue-600" />,
      path: "/reports/projects",
      stats: {
        total: projects.length,
        active: activeProjects,
        completed: completedProjects,
      },
      color: "blue",
    },
    {
      title: "Task Reports",
      description: "View task completion rates and performance",
      icon: <FaTasks className="text-4xl text-green-600" />,
      path: "/reports/tasks",
      stats: {
        total: tasks.length,
        completed: completedTasks,
        pending: pendingTasks,
      },
      color: "green",
    },
    {
      title: "Team Reports",
      description: "View team productivity and activity metrics",
      icon: <FaUsers className="text-4xl text-purple-600" />,
      path: "/reports/teams",
      stats: {
        total: teams.length,
        members: totalMembers,
        active: activeTeams,
      },
      color: "purple",
    },
  ];

  const quickStats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: <FaProjectDiagram className="text-2xl" />,
      color: "blue",
    },
    {
      label: "Completed Tasks",
      value: completedTasks.toString(),
      icon: <FaTasks className="text-2xl" />,
      color: "green",
    },
    {
      label: "Team Members",
      value: totalMembers.toString(),
      icon: <FaUsers className="text-2xl" />,
      color: "purple",
    },
    {
      label: "This Month",
      value: thisMonthProjects.toString(),
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "amber",
    },
  ];

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

  const getActivityIcon = (action) => {
    if (action.includes("project") || action.includes("Project")) {
      return <FaProjectDiagram className="text-blue-600 text-lg" />;
    } else if (action.includes("task") || action.includes("Task")) {
      return <FaTasks className="text-green-600 text-lg" />;
    } else if (action.includes("team") || action.includes("Team")) {
      return <FaUsers className="text-purple-600 text-lg" />;
    }
    return <FaClock className="text-gray-600 text-lg" />;
  };

  const getActivityColor = (action) => {
    if (action.includes("project") || action.includes("Project")) {
      return "bg-blue-100";
    } else if (action.includes("task") || action.includes("Task")) {
      return "bg-green-100";
    } else if (action.includes("team") || action.includes("Team")) {
      return "bg-purple-100";
    }
    return "bg-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaChartBar className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FaChartBar className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-500 mt-1">
                View analytics and performance reports
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-3 bg-${stat.color}-600 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {category.icon}
                  <FaChartLine
                    className={`text-2xl text-${category.color}-600 opacity-20`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.entries(category.stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                      <p className="text-lg font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>

                {/* View Button */}
                <button
                  onClick={() => navigate(category.path)}
                  className={`w-full px-4 py-3 bg-${category.color}-600 text-white rounded-lg hover:bg-${category.color}-700 transition-all font-semibold flex items-center justify-center gap-2`}>
                  View Report <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FaClock className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <FaClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getActivityColor(
                        activity.action
                      )}`}>
                      {getActivityIcon(activity.action)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
