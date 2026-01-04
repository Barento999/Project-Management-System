import { useState } from "react";
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

const Reports = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  const reportCategories = [
    {
      title: "Project Reports",
      description: "View project progress, timelines, and metrics",
      icon: <FaProjectDiagram className="text-4xl text-blue-600" />,
      path: "/reports/projects",
      stats: { total: 12, active: 8, completed: 4 },
      color: "blue",
    },
    {
      title: "Task Reports",
      description: "View task completion rates and performance",
      icon: <FaTasks className="text-4xl text-green-600" />,
      path: "/reports/tasks",
      stats: { total: 48, completed: 32, pending: 16 },
      color: "green",
    },
    {
      title: "Team Reports",
      description: "View team productivity and activity metrics",
      icon: <FaUsers className="text-4xl text-purple-600" />,
      path: "/reports/teams",
      stats: { total: 5, members: 24, active: 20 },
      color: "purple",
    },
  ];

  const quickStats = [
    {
      label: "Total Projects",
      value: "12",
      icon: <FaProjectDiagram className="text-2xl" />,
      color: "blue",
    },
    {
      label: "Completed Tasks",
      value: "32",
      icon: <FaTasks className="text-2xl" />,
      color: "green",
    },
    {
      label: "Team Members",
      value: "24",
      icon: <FaUsers className="text-2xl" />,
      color: "purple",
    },
    {
      label: "This Month",
      value: "8",
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "amber",
    },
  ];

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
            {[
              {
                action: "Project Report Generated",
                time: "2 hours ago",
                type: "project",
              },
              {
                action: "Task Report Updated",
                time: "5 hours ago",
                type: "task",
              },
              {
                action: "Team Report Exported",
                time: "1 day ago",
                type: "team",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "project"
                        ? "bg-blue-100"
                        : activity.type === "task"
                        ? "bg-green-100"
                        : "bg-purple-100"
                    }`}>
                    {activity.type === "project" ? (
                      <FaProjectDiagram className={`text-blue-600 text-lg`} />
                    ) : activity.type === "task" ? (
                      <FaTasks className={`text-green-600 text-lg`} />
                    ) : (
                      <FaUsers className={`text-purple-600 text-lg`} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
