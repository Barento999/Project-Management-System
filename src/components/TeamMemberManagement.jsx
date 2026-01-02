import { useState, useEffect } from "react";
import { FaUser, FaTimes, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import { userAPI, teamAPI } from "../services/api";

const TeamMemberManagement = ({ team, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use search endpoint which is accessible to all authenticated users
      const response = await userAPI.search("");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      setAdding(true);
      await teamAPI.addMember(team._id, userId);
      setShowAddModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to add member:", error);
      const errorMsg = error.response?.data?.message || "Failed to add member";
      alert(`Error: ${errorMsg}`);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await teamAPI.removeMember(team._id, userId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. You may not have permission.");
    }
  };

  const currentMemberIds = [
    team.owner._id || team.owner,
    ...(team.members || []).map((m) => m._id || m),
  ];

  const availableUsers = users.filter(
    (user) => !currentMemberIds.includes(user._id)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
          <FaPlus />
          <span>Add Member</span>
        </button>
      </div>

      {/* Owner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {team.owner.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{team.owner.name}</p>
            <p className="text-sm text-gray-600">{team.owner.email}</p>
          </div>
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
            Owner
          </span>
        </div>
      </div>

      {/* Members */}
      {team.members && team.members.length > 0 ? (
        <div className="space-y-2">
          {team.members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block mt-1">
                    {member.role}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <FaUser className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600">No members yet</p>
          <p className="text-sm text-gray-500">
            Add team members to collaborate
          </p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaPlus className="text-2xl" />
                <h2 className="text-xl font-bold">Add Team Member</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="text-4xl text-purple-600 animate-spin" />
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FaUser className="text-5xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No users available to add</p>
                  <p className="text-sm text-gray-500 mt-1">
                    All users are already members of this team
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Select users to add to your team:
                  </p>
                  {availableUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleAddMember(user._id)}
                      disabled={adding}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent transition-all disabled:opacity-50">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full inline-block mt-1">
                          {user.role}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberManagement;
