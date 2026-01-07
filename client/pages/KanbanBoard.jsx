import React, { useState, useEffect } from "react";
import {
  FaTasks,
  FaSpinner,
  FaPlus,
  FaUser,
  FaClock,
  FaFlag,
  FaCalendarAlt,
  FaFilter,
  FaProjectDiagram,
} from "react-icons/fa";
import { taskAPI, projectAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState("all");
  const navigate = useNavigate();

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100", badge: "bg-gray-500" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100",
      badge: "bg-blue-500",
    },
    {
      id: "review",
      title: "Review",
      color: "bg-purple-100",
      badge: "bg-purple-500",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-100",
      badge: "bg-green-500",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    if (selectedProject === "all") {
      return tasks;
    }
    return tasks.filter(
      (task) =>
        task.project?._id === selectedProject ||
        task.project === selectedProject
    );
  };

  const getTasksByStatus = (status) => {
    const filteredTasks = getFilteredTasks();
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.status === newStatus) {
      return;
    }

    try {
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === draggedTask._id ? { ...task, status: newStatus } : task
        )
      );

      // Update on server
      await taskAPI.updateStatus(draggedTask._id, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Revert on error
      await fetchData();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityIcon = (priority) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-blue-600",
    };
    return <FaFlag className={colors[priority] || "text-gray-600"} />;
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (d < today) return "Overdue";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return (
      new Date(date) < new Date() &&
      new Date(date).toDateString() !== new Date().toDateString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="text-6xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaTasks className="text-4xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Kanban Board
                </h1>
                <p className="text-gray-600">
                  Drag and drop tasks to update their status
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/tasks/create")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus />
              New Task
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-4">
              <FaFilter className="text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Filter by Project:
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Total Tasks:{" "}
                  <span className="font-bold text-gray-800">
                    {getFilteredTasks().length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div
                key={column.id}
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}>
                {/* Column Header */}
                <div
                  className={`${column.color} rounded-t-xl p-4 border-2 border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">
                      {column.title}
                    </h2>
                    <span
                      className={`${column.badge} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 bg-white border-2 border-t-0 border-gray-200 rounded-b-xl p-4 min-h-[600px]">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FaTasks className="text-5xl mb-3" />
                      <p className="text-sm">No tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <div
                          key={task._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          className={`bg-white border-2 rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-move hover:scale-[1.02] ${
                            isOverdue(task.dueDate)
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          }`}>
                          {/* Task Title */}
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                            {task.title}
                          </h3>

                          {/* Task Description */}
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Project Badge */}
                          {task.project && (
                            <div className="flex items-center gap-2 mb-3">
                              <FaProjectDiagram className="text-purple-600 text-xs" />
                              <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full font-medium">
                                {task.project.name || "Unknown Project"}
                              </span>
                            </div>
                          )}

                          {/* Priority Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            {getPriorityIcon(task.priority)}
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(
                                task.priority
                              )}`}>
                              {task.priority?.toUpperCase() || "NONE"}
                            </span>
                          </div>

                          {/* Assigned To */}
                          {task.assignedTo && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {task.assignedTo.name?.charAt(0)}
                              </div>
                              <span className="text-xs text-gray-700 font-medium">
                                {task.assignedTo.name}
                              </span>
                            </div>
                          )}

                          {/* Due Date */}
                          {task.dueDate && (
                            <div
                              className={`flex items-center gap-2 text-xs ${
                                isOverdue(task.dueDate)
                                  ? "text-red-600 font-bold"
                                  : "text-gray-600"
                              }`}>
                              <FaCalendarAlt />
                              <span>{formatDate(task.dueDate)}</span>
                              {isOverdue(task.dueDate) && (
                                <span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  OVERDUE
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            How to Use Kanban Board
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaTasks className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Drag & Drop Tasks
                </p>
                <p>
                  Click and drag any task card to move it between columns and
                  update its status automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaFilter className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Filter by Project
                </p>
                <p>
                  Use the project filter to view tasks from specific projects
                  only
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaFlag className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Priority Levels
                </p>
                <p>
                  Tasks are color-coded by priority: Red (High), Yellow
                  (Medium), Blue (Low)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClock className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Overdue Tasks
                </p>
                <p>
                  Tasks past their due date are highlighted with a red border
                  and badge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
