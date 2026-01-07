import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { teamAPI } from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUser,
  FaRocket,
  FaStar,
  FaCrown,
} from "react-icons/fa";

const TeamsBeautiful = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(newTeam);
      setNewTeam({ name: "", description: "" });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.update(currentTeam._id, currentTeam);
      setShowEditForm(false);
      setCurrentTeam(null);
      fetchData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Delete this team?")) {
      try {
        await teamAPI.delete(teamId);
        fetchData();
      } catch (err) {
        console.error("Error deleting team:", err);
        alert("Error deleting team");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaUsers className="text-purple-600 text-2xl animate-bounce" />
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
              1️⃣ Start Here - Create Your Team First
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Teams
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Build your dream team
          </p>
        </div>

        {/* Create Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 sm:gap-3">
            <FaPlus className="text-lg sm:text-xl" />
            <span className="text-sm sm:text-base lg:text-lg">
              {showCreateForm ? "Cancel" : "Create New Team"}
            </span>
            <FaUsers className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ✨ Create New Team
              </h2>
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    placeholder="Enter an awesome team name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    rows="3"
                    placeholder="Describe your team..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  🚀 Create Team
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && currentTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Team
              </h3>
              <form onSubmit={handleUpdateTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={currentTeam.name}
                    onChange={(e) =>
                      setCurrentTeam({ ...currentTeam, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setCurrentTeam(null);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-xl shadow-lg border border-gray-200">
              <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No teams yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first team to get started!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Create First Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200">
                {/* Card Header */}
                <div className="h-2 bg-blue-600"></div>

                <div className="p-4 sm:p-6">
                  {/* Team Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="p-2 sm:p-3 bg-blue-600 rounded-lg shadow-md flex-shrink-0">
                        <FaUsers className="text-white text-lg sm:text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaStar className="text-blue-600 text-xs sm:text-sm flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            Active Team
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTeam(team);
                          setShowEditForm(true);
                        }}
                        className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeam(team._id);
                        }}
                        className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-500 mb-4 line-clamp-2">
                    {team.description || "No description provided"}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-blue-600 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Members
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        {team.members?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaRocket className="text-blue-600 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Projects
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        {team.projects?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaCrown className="text-blue-600 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Owner
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[100px]">
                        {team.owner?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/teams/${team._id}`)}
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

export default TeamsBeautiful;
