import { useState } from "react";
import {
  FaCheckCircle,
  FaCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTasks,
} from "react-icons/fa";
import { taskAPI } from "../services/api";

const TaskSubtasks = ({ task, onUpdate }) => {
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      setSubmitting(true);
      const res = await taskAPI.addSubtask(task._id, { title: newSubtask });
      setSubtasks(res.data.task.subtasks);
      setNewSubtask("");
      if (onUpdate) onUpdate(res.data.task);
    } catch (error) {
      console.error("Failed to add subtask:", error);
      alert("Failed to add subtask");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const res = await taskAPI.toggleSubtask(task._id, subtaskId);
      setSubtasks(res.data.task.subtasks);
      if (onUpdate) onUpdate(res.data.task);
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
      alert("Failed to update subtask");
    }
  };

  const handleUpdateSubtask = async (subtaskId) => {
    if (!editTitle.trim()) return;

    try {
      const res = await taskAPI.updateSubtask(task._id, subtaskId, {
        title: editTitle,
      });
      setSubtasks(res.data.task.subtasks);
      setEditingId(null);
      setEditTitle("");
      if (onUpdate) onUpdate(res.data.task);
    } catch (error) {
      console.error("Failed to update subtask:", error);
      alert("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!confirm("Delete this subtask?")) return;

    try {
      const res = await taskAPI.deleteSubtask(task._id, subtaskId);
      setSubtasks(res.data.task.subtasks);
      if (onUpdate) onUpdate(res.data.task);
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      alert("Failed to delete subtask");
    }
  };

  const startEdit = (subtask) => {
    setEditingId(subtask._id);
    setEditTitle(subtask.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const completedCount = subtasks.filter((s) => s.isCompleted).length;
  const totalCount = subtasks.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaTasks className="text-blue-600" />
            Subtasks ({completedCount}/{totalCount})
          </h3>
          {totalCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {progressPercentage.toFixed(0)}% complete
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      )}

      {/* Add Subtask Form */}
      <form onSubmit={handleAddSubtask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a new subtask..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !newSubtask.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FaPlus />
            Add
          </button>
        </div>
      </form>

      {/* Subtasks List */}
      {subtasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <FaTasks className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No subtasks yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Break this task into smaller pieces
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                subtask.isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}>
              {/* Checkbox */}
              <button
                onClick={() => handleToggleSubtask(subtask._id)}
                className="flex-shrink-0 text-2xl transition-colors">
                {subtask.isCompleted ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaCircle className="text-gray-300 hover:text-blue-500" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingId === subtask._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateSubtask(subtask._id);
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleUpdateSubtask(subtask._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p
                      className={`font-medium ${
                        subtask.isCompleted
                          ? "text-gray-500 line-through"
                          : "text-gray-800"
                      }`}>
                      {subtask.title}
                    </p>
                    {subtask.completedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Completed{" "}
                        {new Date(subtask.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              {editingId !== subtask._id && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(subtask)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteSubtask(subtask._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {totalCount > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-600">Total: </span>
                <span className="font-bold text-gray-800">{totalCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed: </span>
                <span className="font-bold text-green-600">
                  {completedCount}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Remaining: </span>
                <span className="font-bold text-blue-600">
                  {totalCount - completedCount}
                </span>
              </div>
            </div>
            {completedCount === totalCount && totalCount > 0 && (
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <FaCheckCircle />
                All Done!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700 font-medium mb-2">💡 Tips:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Break large tasks into smaller, manageable pieces</li>
          <li>• Check off subtasks as you complete them</li>
          <li>• Edit subtasks by clicking the edit icon</li>
          <li>• Press Enter to save, Escape to cancel when editing</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskSubtasks;
