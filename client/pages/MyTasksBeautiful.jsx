import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaFilter,
  FaCalendar,
  FaFlag,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { taskAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyTasksBeautiful = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, todo, in-progress, done
  const [sortBy, setSortBy] = useState("dueDate"); // dueDate, priority, createdAt

  useEffect(() => {
    fetchMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      // Filter only tasks assigned to current user
      const myTasks = response.data.tasks.filter(
        (task) => task.assignedTo?._id === user._id
      );
      setTasks(myTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-600 text-white border-green-600",
      medium: "bg-amber-500 text-white border-amber-500",
      high: "bg-red-600 text-white border-red-600",
      critical: "bg-red-600 text-white border-red-600",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-gray-400 text-white",
      "in-progress": "bg-blue-600 text-white",
      review: "bg-purple-600 text-white",
      done: "bg-green-600 text-white",
      blocked: "bg-red-600 text-white",
    };
    return colors[status] || colors.todo;
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: <FaClock className="text-gray-500" />,
      "in-progress": <FaSpinner className="text-blue-600" />,
      done: <FaCheckCircle className="text-green-600" />,
    };
    return icons[status] || icons.todo;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "priority") {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="text-5xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-500">Tasks assigned to you</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {taskStats.total}
              </p>
            </div>
            <FaTasks className="text-4xl text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">To Do</p>
              <p className="text-3xl font-bold text-gray-900">
                {taskStats.todo}
              </p>
            </div>
            <FaClock className="text-4xl text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {taskStats.inProgress}
              </p>
            </div>
            <FaSpinner className="text-4xl text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {taskStats.done}
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="font-semibold text-gray-900">Filter:</span>
          </div>
          <div className="flex gap-2">
            {["all", "todo", "in-progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {status === "all"
                  ? "All"
                  : status.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-semibold text-gray-900">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none">
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center border border-gray-200">
          <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No tasks found</p>
          <p className="text-gray-400 mt-2">
            {filter === "all"
              ? "You don't have any assigned tasks yet"
              : `No tasks in "${filter}" status`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => navigate(`/tasks/${task._id}`)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-600">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="text-xl font-bold text-gray-900">
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 mb-3">
                    {task.description || "No description"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        task.status
                      )}`}>
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                        task.priority
                      )}`}>
                      <FaFlag className="inline mr-1" />
                      {task.priority?.toUpperCase()}
                    </span>
                    {task.project && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                        📁 {task.project.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                        <FaCalendar className="inline mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksBeautiful;
