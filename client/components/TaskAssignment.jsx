import { useState, useEffect } from "react";
import { FaUser, FaTimes, FaSpinner } from "react-icons/fa";
import { userAPI, projectAPI } from "../services/api";

const TaskAssignment = ({ task, onAssign, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchProjectMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjectMembers = async () => {
    try {
      setLoading(true);
      // Get project details to find members
      const projectRes = await projectAPI.getOne(
        task.project._id || task.project
      );
      const project = projectRes.data.project;

      // Get all users
      const usersRes = await userAPI.getAll();
      const allUsers = usersRes.data.users;

      // Filter users who are project members or owner
      const projectMemberIds = [
        project.owner._id || project.owner,
        ...(project.members || []).map((m) => m._id || m),
      ];

      const projectUsers = allUsers.filter((user) =>
        projectMemberIds.includes(user._id)
      );

      setUsers(projectUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Fallback: get all users
      try {
        const usersRes = await userAPI.getAll();
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error("Failed to fetch all users:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (userId) => {
    try {
      setAssigning(true);
      await onAssign(userId);
      onClose();
    } catch (error) {
      console.error("Failed to assign task:", error);
      alert("Failed to assign task");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    try {
      setAssigning(true);
      await onAssign(null);
      onClose();
    } catch (error) {
      console.error("Failed to unassign task:", error);
      alert("Failed to unassign task");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUser className="text-2xl" />
            <h2 className="text-xl font-bold">Assign Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="text-4xl text-purple-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {/* Current Assignment */}
              {task.assignedTo && (
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">
                    Currently assigned to:
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {task.assignedTo.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {task.assignedTo.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {task.assignedTo.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleUnassign}
                      disabled={assigning}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                      Unassign
                    </button>
                  </div>
                </div>
              )}

              {/* User List */}
              <p className="text-sm text-gray-600 mb-3">
                {task.assignedTo ? "Reassign to:" : "Assign to:"}
              </p>
              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No users available
                </p>
              ) : (
                users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleAssign(user._id)}
                    disabled={
                      assigning ||
                      (task.assignedTo && task.assignedTo._id === user._id)
                    }
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      task.assignedTo && task.assignedTo._id === user._id
                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                        : "bg-gray-50 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent"
                    }`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block mt-1">
                        {user.role}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;
