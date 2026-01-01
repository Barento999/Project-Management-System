import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCalendar,
  FaFlag,
  FaProjectDiagram,
} from "react-icons/fa";
import { taskAPI } from "../services/api";
import CommentsSection from "../components/CommentsSection";
import ActivityFeed from "../components/ActivityFeed";

const TaskDetailsBeautiful = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getOne(id);
      setTask(res.data.task);
    } catch (error) {
      console.error("Error fetching task:", error);
      alert("Task not found");
      navigate("/tasks");
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
      todo: "bg-gray-100 text-gray-700 border-gray-300",
      "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
      done: "bg-green-100 text-green-700 border-green-300",
    };
    return colors[status] || colors.todo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaTasks className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tasks")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all">
          <FaArrowLeft />
          <span>Back to Tasks</span>
        </button>

        {/* Task Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {task.title}
              </h1>
              <p className="text-gray-600">
                {task.description || "No description"}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${getPriorityColor(
                  task.priority
                )}`}>
                {task.priority?.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(
                  task.status
                )}`}>
                {task.status?.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <FaProjectDiagram className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Project</p>
                <p className="font-semibold text-gray-800">
                  {task.project?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <FaUser className="text-purple-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Assigned To</p>
                <p className="font-semibold text-gray-800">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <FaCalendar className="text-green-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-800">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <FaClock className="text-orange-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="font-semibold text-gray-800">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-xl border border-white/50 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "comments"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "activity"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              📊 Activity
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-b-3xl shadow-xl border border-white/50 p-6">
          {activeTab === "comments" ? (
            <CommentsSection
              entityType="Task"
              entityId={task._id}
              entityName={task.title}
            />
          ) : (
            <ActivityFeed entityType="Task" entityId={task._id} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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

export default TaskDetailsBeautiful;
