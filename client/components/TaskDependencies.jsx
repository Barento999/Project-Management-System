import React, { useState, useEffect } from "react";
import {
  FaLink,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { taskAPI } from "../services/api";

const TaskDependencies = ({ taskId, projectId }) => {
  const [dependencies, setDependencies] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [depsRes, deptsRes, tasksRes] = await Promise.all([
        taskAPI.getDependencies(taskId),
        taskAPI.getDependents(taskId),
        taskAPI.getAll({ project: projectId }),
      ]);

      setDependencies(depsRes.data.dependencies || []);
      setDependents(deptsRes.data.dependents || []);

      // Filter out current task and existing dependencies
      const existingDepIds = [
        taskId,
        ...(depsRes.data.dependencies || []).map((d) => d._id),
      ];
      const available = (tasksRes.data.tasks || []).filter(
        (t) => !existingDepIds.includes(t._id)
      );
      setAvailableTasks(available);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependency = async () => {
    if (!selectedTask) return;

    try {
      setSubmitting(true);
      await taskAPI.addDependency(taskId, selectedTask);
      await fetchData();
      setShowAddModal(false);
      setSelectedTask("");
    } catch (error) {
      console.error("Failed to add dependency:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add dependency. Check for circular dependencies."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDependency = async (dependencyId) => {
    if (!confirm("Remove this dependency?")) return;

    try {
      await taskAPI.removeDependency(taskId, dependencyId);
      await fetchData();
    } catch (error) {
      console.error("Failed to remove dependency:", error);
      alert("Failed to remove dependency");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-700 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "review":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "done") {
      return <FaCheckCircle className="text-green-600" />;
    }
    return <FaExclamationTriangle className="text-yellow-600" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
      case "critical":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="text-4xl text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaLink className="text-blue-600" />
          Task Dependencies
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          <FaPlus />
          Add Dependency
        </button>
      </div>

      {/* Dependencies (Tasks this task depends on) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaArrowLeft className="text-gray-600" />
          <h4 className="font-semibold text-gray-800">
            Depends On ({dependencies.length})
          </h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          This task cannot start until these tasks are completed
        </p>

        {dependencies.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <FaLink className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No dependencies</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dependencies.map((dep) => (
              <div
                key={dep._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(dep.status)}
                    <p className="font-medium text-gray-800">{dep.title}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full border ${getStatusColor(
                        dep.status
                      )}`}>
                      {dep.status?.toUpperCase()}
                    </span>
                    <span className={getPriorityColor(dep.priority)}>
                      {dep.priority?.toUpperCase()}
                    </span>
                    {dep.project && (
                      <span className="text-purple-600">
                        {dep.project.name}
                      </span>
                    )}
                    {dep.dueDate && (
                      <span>
                        Due: {new Date(dep.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDependency(dep._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dependents (Tasks that depend on this task) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FaArrowRight className="text-gray-600" />
          <h4 className="font-semibold text-gray-800">
            Blocking ({dependents.length})
          </h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          These tasks are waiting for this task to be completed
        </p>

        {dependents.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <FaLink className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No dependent tasks</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dependents.map((dep) => (
              <div
                key={dep._id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(dep.status)}
                    <p className="font-medium text-gray-800">{dep.title}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full border ${getStatusColor(
                        dep.status
                      )}`}>
                      {dep.status?.toUpperCase()}
                    </span>
                    <span className={getPriorityColor(dep.priority)}>
                      {dep.priority?.toUpperCase()}
                    </span>
                    {dep.project && (
                      <span className="text-purple-600">
                        {dep.project.name}
                      </span>
                    )}
                    {dep.assignedTo && (
                      <span>Assigned to: {dep.assignedTo.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dependency Warnings */}
      {dependencies.some((d) => d.status !== "done") && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 mb-1">
              Incomplete Dependencies
            </p>
            <p className="text-sm text-yellow-700">
              This task has{" "}
              {dependencies.filter((d) => d.status !== "done").length}{" "}
              incomplete{" "}
              {dependencies.filter((d) => d.status !== "done").length === 1
                ? "dependency"
                : "dependencies"}
              . Complete them first for optimal workflow.
            </p>
          </div>
        </div>
      )}

      {/* Add Dependency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add Dependency
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a task that must be completed before this task can start
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Task *
              </label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Choose a task...</option>
                {availableTasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title} ({task.status}) - {task.project?.name}
                  </option>
                ))}
              </select>
              {availableTasks.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No available tasks to add as dependencies
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedTask("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddDependency}
                disabled={!selectedTask || submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Adding..." : "Add Dependency"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDependencies;
