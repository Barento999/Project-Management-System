import { useState, useEffect } from "react";
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
      low: "bg-green-100 text-green-700 border-green-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      critical: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-gray-100 text-gray-700",
      "in-progress": "bg-blue-100 text-blue-700",
      done: "bg-green-100 text-green-700",
    };
    return colors[status] || colors.todo;
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: <FaClock className="text-gray-600" />,
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <FaSpinner className="text-5xl text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
          My Tasks
        </h1>
        <p className="text-gray-600">Tasks assigned to you</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800">
                {taskStats.total}
              </p>
            </div>
            <FaTasks className="text-4xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">To Do</p>
              <p className="text-3xl font-bold text-gray-800">
                {taskStats.todo}
              </p>
            </div>
            <FaClock className="text-4xl text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-800">
                {taskStats.inProgress}
              </p>
            </div>
            <FaSpinner className="text-4xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-800">
                {taskStats.done}
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {["all", "todo", "in-progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {status === "all"
                  ? "All"
                  : status.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-semibold text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No tasks found</p>
          <p className="text-gray-500 mt-2">
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
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-purple-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="text-xl font-bold text-gray-800">
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-3">
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
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                        task.priority
                      )}`}>
                      <FaFlag className="inline mr-1" />
                      {task.priority?.toUpperCase()}
                    </span>
                    {task.project && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        📁 {task.project.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
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
