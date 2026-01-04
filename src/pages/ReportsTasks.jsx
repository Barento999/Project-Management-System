import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaChartBar,
  FaFlag,
} from "react-icons/fa";
import { taskAPI } from "../services/api";

const ReportsTasks = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const overdueTasks = tasks.filter((t) => {
    if (t.dueDate && t.status !== "COMPLETED") {
      return new Date(t.dueDate) < new Date();
    }
    return false;
  }).length;

  const highPriorityTasks = tasks.filter((t) => t.priority === "HIGH").length;
  const mediumPriorityTasks = tasks.filter(
    (t) => t.priority === "MEDIUM"
  ).length;
  const lowPriorityTasks = tasks.filter((t) => t.priority === "LOW").length;

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaTasks className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading task reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/reports")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div className="p-3 bg-green-600 rounded-xl">
              <FaTasks className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Reports</h1>
              <p className="text-gray-500 mt-1">
                View analytics and metrics for your tasks
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaTasks className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedTasks}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {inProgressTasks}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <FaClock className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overdueTasks}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">
              Task Completion Rate
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all"
                  style={{ width: `${completionRate}%` }}>
                  {completionRate}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {completionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaFlag className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">
              Tasks by Priority
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-semibold mb-1">
                High Priority
              </p>
              <p className="text-3xl font-bold text-red-700">
                {highPriorityTasks}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-600 font-semibold mb-1">
                Medium Priority
              </p>
              <p className="text-3xl font-bold text-amber-700">
                {mediumPriorityTasks}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-1">
                Low Priority
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {lowPriorityTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Tasks
          </h2>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <FaTasks className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              tasks.slice(0, 10).map((task) => (
                <div
                  key={task._id}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                        {task.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        {task.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTasks;
