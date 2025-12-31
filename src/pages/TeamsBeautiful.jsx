import { useState, useEffect } from "react";
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
      } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
              1️⃣ Start Here - Create Your Team First
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Teams
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Build your dream team
          </p>
        </div>

        {/* Create Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 sm:gap-3">
              <FaPlus className="text-lg sm:text-xl group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm sm:text-base lg:text-lg">
                {showCreateForm ? "Cancel" : "Create New Team"}
              </span>
              <FaUsers className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                ✨ Create New Team
              </h2>
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    placeholder="Enter an awesome team name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    rows="3"
                    placeholder="Describe your team..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                  🚀 Create Team
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && currentTeam && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 animate-slide-down">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Edit Team
              </h3>
              <form onSubmit={handleUpdateTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={currentTeam.name}
                    onChange={(e) =>
                      setCurrentTeam({ ...currentTeam, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
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
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
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
            <div className="inline-block p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
              <FaUsers className="mx-auto text-6xl text-gray-300 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No teams yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first team to get started!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Create First Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team, index) => (
              <div
                key={team._id}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-white/50"
                style={{ animationDelay: `${index * 100}ms` }}>
                {/* Card Header */}
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

                <div className="p-4 sm:p-6">
                  {/* Team Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                        <FaUsers className="text-white text-lg sm:text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaStar className="text-yellow-400 text-xs sm:text-sm flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            Active Team
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => {
                          setCurrentTeam(team);
                          setShowEditForm(true);
                        }}
                        className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team._id)}
                        className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                    {team.description || "No description provided"}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-purple-500 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Members
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-purple-600">
                        {team.members?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaRocket className="text-blue-500 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Projects
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        {team.projects?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaCrown className="text-yellow-500 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Owner
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[100px]">
                        {team.owner?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <button className="w-full text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
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
