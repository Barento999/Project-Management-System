import { useState, useEffect } from "react";
import { teamAPI } from "../services/api";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUser } from "react-icons/fa";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [error, setError] = useState("");
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamsRes = await teamAPI.getAll();
      setTeams(teamsRes.data.teams || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await teamAPI.create(newTeam);
      setNewTeam({ name: "", description: "" });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create team");
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await teamAPI.update(currentTeam._id, currentTeam);
      setShowEditForm(false);
      setCurrentTeam(null);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update team");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await teamAPI.delete(teamId);
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete team");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage your teams and members</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg">
          <FaPlus /> Create Team
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Create New Team
          </h2>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows="3"
                placeholder="Enter team description"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                Create Team
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setError("");
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && currentTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Edit Team</h3>
            <form onSubmit={handleUpdateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={currentTeam.name}
                  onChange={(e) =>
                    setCurrentTeam({ ...currentTeam, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={currentTeam.description}
                  onChange={(e) =>
                    setCurrentTeam({
                      ...currentTeam,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentTeam(null);
                    setError("");
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaUsers className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No teams found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first team
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <FaPlus /> Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentTeam(team);
                      setShowEditForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {team.description || "No description"}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaUser /> Members:
                  </span>
                  <span className="text-gray-700 font-medium">
                    {team.members?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Projects:</span>
                  <span className="text-gray-700 font-medium">
                    {team.projects?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Owner:</span>
                  <span className="text-gray-700 font-medium">
                    {team.owner?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
