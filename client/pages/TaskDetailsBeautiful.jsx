import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCalendar,
  FaFlag,
  FaProjectDiagram,
  FaUserPlus,
} from "react-icons/fa";
import { taskAPI } from "../services/api";
import CommentsSection from "../components/CommentsSection";
import ActivityFeed from "../components/ActivityFeed";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import TaskAssignment from "../components/TaskAssignment";
import TaskDependencies from "../components/TaskDependencies";
import TaskSubtasks from "../components/TaskSubtasks";

const TaskDetailsBeautiful = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");
  const [fileRefresh, setFileRefresh] = useState(0);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      low: "bg-green-600 text-white border-green-600",
      medium: "bg-amber-500 text-white border-amber-500",
      high: "bg-red-600 text-white border-red-600",
      critical: "bg-red-600 text-white border-red-600",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-gray-400 text-white border-gray-400",
      "in-progress": "bg-blue-600 text-white border-blue-600",
      review: "bg-purple-600 text-white border-purple-600",
      done: "bg-green-600 text-white border-green-600",
      blocked: "bg-red-600 text-white border-red-600",
    };
    return colors[status] || colors.todo;
  };

  const handleAssignTask = async (userId) => {
    try {
      await taskAPI.update(id, { assignedTo: userId });
      await fetchTask(); // Refresh task data
    } catch (error) {
      console.error("Failed to assign task:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaTasks className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tasks")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all">
          <FaArrowLeft />
          <span>Back to Tasks</span>
        </button>

        {/* Task Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
              <p className="text-gray-500">
                {task.description || "No description"}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-xl font-semibold ${getPriorityColor(
                  task.priority
                )}`}>
                {task.priority?.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(
                  task.status
                )}`}>
                {task.status?.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaProjectDiagram className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Project</p>
                <p className="font-semibold text-gray-900">
                  {task.project?.name || "N/A"}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowAssignModal(true)}>
              <FaUser className="text-blue-600 text-xl" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="font-semibold text-gray-900">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <FaUserPlus className="text-blue-600 text-lg" />
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaCalendar className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaClock className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-3xl shadow-xl border border-gray-200 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "comments"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "activity"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              📊 Activity
            </button>
            <button
              onClick={() => setActiveTab("dependencies")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "dependencies"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              🔗 Dependencies
            </button>
            <button
              onClick={() => setActiveTab("subtasks")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "subtasks"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              ✅ Subtasks
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "files"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              📎 Files
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-3xl shadow-xl border border-gray-200 p-6">
          {activeTab === "comments" ? (
            <CommentsSection
              entityType="Task"
              entityId={task._id}
              entityName={task.title}
            />
          ) : activeTab === "activity" ? (
            <ActivityFeed entityType="Task" entityId={task._id} />
          ) : activeTab === "dependencies" ? (
            <TaskDependencies
              taskId={task._id}
              projectId={task.project?._id || task.project}
            />
          ) : activeTab === "subtasks" ? (
            <TaskSubtasks task={task} onUpdate={setTask} />
          ) : (
            <div className="space-y-6">
              <FileUpload
                entityType="task"
                entityId={task._id}
                onUploadSuccess={() => setFileRefresh((prev) => prev + 1)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attached Files
                </h3>
                <FileList
                  entityType="task"
                  entityId={task._id}
                  refreshTrigger={fileRefresh}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Assignment Modal */}
      {showAssignModal && (
        <TaskAssignment
          task={task}
          onAssign={handleAssignTask}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};

export default TaskDetailsBeautiful;
