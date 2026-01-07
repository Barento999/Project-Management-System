import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, projectAPI } from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTasks,
  FaClock,
  FaRocket,
  FaFire,
  FaCheckCircle,
} from "react-icons/fa";

const TasksBeautiful = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setTasks(tasksRes.data.tasks || []);
      setProjects(projectsRes.data.projects || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTask.projectId) {
      alert("Please select a project!");
      return;
    }

    try {
      await taskAPI.create(newTask);
      setNewTask({
        title: "",
        description: "",
        projectId: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
      });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.update(currentTask._id, currentTask);
      setShowEditForm(false);
      setCurrentTask(null);
      fetchData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      try {
        await taskAPI.delete(taskId);
        fetchData();
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Error deleting task");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating task status");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-600 text-white",
      medium: "bg-amber-500 text-white",
      high: "bg-red-600 text-white",
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
    if (status === "done") return <FaCheckCircle />;
    if (status === "in-progress") return <FaRocket />;
    return <FaClock />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaTasks className="text-blue-600 text-2xl animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md">
              3️⃣ Finally - Create Tasks for Projects
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tasks
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Manage your tasks and get things done
          </p>
        </div>

        {/* Filter and Create Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white font-semibold text-sm sm:text-base">
            <option value="all">📋 All Tasks</option>
            <option value="todo">⏳ To Do</option>
            <option value="in-progress">🚀 In Progress</option>
            <option value="done">✅ Completed</option>
          </select>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 sm:gap-3">
            <FaPlus className="text-lg sm:text-xl" />
            <span className="text-sm sm:text-base lg:text-lg">
              {showCreateForm ? "Cancel" : "Create New Task"}
            </span>
            <FaTasks className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ✨ Create New Task
              </h2>

              {projects.length === 0 && (
                <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-500 rounded-2xl">
                  <p className="font-bold text-amber-900 mb-2">
                    ⚠️ No projects available!
                  </p>
                  <p className="text-amber-800 text-sm mb-3">
                    Create a project first before creating a task.
                  </p>
                  <a
                    href="/projects"
                    className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    Go to Projects →
                  </a>
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    rows="3"
                    placeholder="Describe the task..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Project *
                    </label>
                    <select
                      value={newTask.projectId}
                      onChange={(e) =>
                        setNewTask({ ...newTask, projectId: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      required>
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({ ...newTask, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
                      <option value="todo">⏳ To Do</option>
                      <option value="in-progress">🚀 In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={projects.length === 0}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  🚀 Create Task
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && currentTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 animate-slide-down max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Edit Task
              </h3>
              <form onSubmit={handleUpdateTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={currentTask.title}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentTask.description}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={currentTask.priority}
                      onChange={(e) =>
                        setCurrentTask({
                          ...currentTask,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={currentTask.status}
                      onChange={(e) =>
                        setCurrentTask({
                          ...currentTask,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
                      <option value="todo">⏳ To Do</option>
                      <option value="in-progress">🚀 In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={currentTask.dueDate}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setCurrentTask(null);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:translate-y-0.5 transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
              <FaTasks className="mx-auto text-6xl text-gray-300 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first task to get started!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:translate-y-0.5 transition-all">
                Create First Task
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTasks.map((task, index) => (
              <div
                key={task._id}
                className="group bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-200"
                style={{ animationDelay: `${index * 100}ms` }}>
                {/* Card Header */}
                <div className={`h-2 ${getPriorityColor(task.priority)}`}></div>

                <div className="p-4 sm:p-6">
                  {/* Task Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 sm:p-3 ${getStatusColor(
                          task.status
                        )} rounded-lg sm:rounded-xl shadow-lg flex-shrink-0`}>
                        <div className="text-white text-lg sm:text-xl">
                          {getStatusIcon(task.status)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaFire className="text-amber-500 text-xs sm:text-sm flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTask(task);
                          setShowEditForm(true);
                        }}
                        className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task._id);
                        }}
                        className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-500 mb-4 line-clamp-2">
                    {task.description || "No description provided"}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Project
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-blue-600 truncate max-w-[120px]">
                        {task.project?.name || "N/A"}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-amber-500 text-sm" />
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            Due Date
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-amber-600">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Selector */}
                  <div className="mt-4">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task._id, e.target.value);
                      }}
                      className={`w-full px-3 sm:px-4 py-2 ${getStatusColor(
                        task.status
                      )} text-white rounded-xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer`}>
                      <option value="todo">⏳ To Do</option>
                      <option value="in-progress">🚀 In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="w-full text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TasksBeautiful;
