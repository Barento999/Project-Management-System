import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI, teamAPI } from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolder,
  FaUsers,
  FaRocket,
  FaStar,
  FaClock,
} from "react-icons/fa";

const ProjectsBeautiful = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "active",
    priority: "medium",
  });

  const loadData = async () => {
    try {
      const [projectsRes, teamsRes] = await Promise.all([
        projectAPI.getAll(),
        teamAPI.getAll(),
      ]);
      setProjects(projectsRes.data.projects || []);
      setTeams(teamsRes.data.teams || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.teamId) {
      alert("Please select a team!");
      return;
    }

    try {
      await projectAPI.create(formData);
      setFormData({
        name: "",
        description: "",
        teamId: "",
        status: "active",
        priority: "medium",
      });
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.update(currentProject._id, currentProject);
      setShowEditForm(false);
      setCurrentProject(null);
      loadData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await projectAPI.delete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Error deleting project");
      }
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "from-green-400 to-emerald-500",
      medium: "from-yellow-400 to-orange-500",
      high: "from-orange-500 to-red-500",
      critical: "from-red-500 to-pink-600",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "from-purple-400 to-indigo-500",
      active: "from-green-400 to-emerald-500",
      "on-hold": "from-yellow-400 to-orange-500",
      completed: "from-blue-400 to-cyan-500",
      cancelled: "from-gray-400 to-gray-500",
    };
    return colors[status] || colors.active;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaRocket className="text-blue-600 text-2xl animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
              2️⃣ Create Projects After Teams
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Projects
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Manage your amazing projects
          </p>
        </div>

        {/* Create Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 sm:gap-3">
              <FaPlus className="text-lg sm:text-xl group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm sm:text-base lg:text-lg">
                {showCreateForm ? "Cancel" : "Create New Project"}
              </span>
              <FaRocket className="text-lg sm:text-xl group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                ✨ Create New Project
              </h2>

              {teams.length === 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl">
                  <p className="font-bold text-yellow-800 mb-2">
                    ⚠️ No teams available!
                  </p>
                  <p className="text-yellow-700 text-sm mb-3">
                    Create a team first before creating a project.
                  </p>
                  <a
                    href="/teams"
                    className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    Go to Teams →
                  </a>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      placeholder="Enter an awesome project name..."
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      rows="3"
                      placeholder="Describe your project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Team *
                    </label>
                    <select
                      value={formData.teamId}
                      onChange={(e) =>
                        setFormData({ ...formData, teamId: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      required>
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all">
                      <option value="planned">📋 Planned</option>
                      <option value="active">🚀 Active</option>
                      <option value="on-hold">⏸️ On Hold</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🟠 High</option>
                      <option value="critical">🔴 Critical</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={teams.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  🚀 Create Project
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && currentProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 animate-slide-down max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Edit Project
              </h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={currentProject.name}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentProject.description}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={currentProject.status}
                      onChange={(e) =>
                        setCurrentProject({
                          ...currentProject,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all">
                      <option value="planned">📋 Planned</option>
                      <option value="active">🚀 Active</option>
                      <option value="on-hold">⏸️ On Hold</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={currentProject.priority}
                      onChange={(e) =>
                        setCurrentProject({
                          ...currentProject,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🟠 High</option>
                      <option value="critical">🔴 Critical</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setCurrentProject(null);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
              <FaFolder className="mx-auto text-6xl text-gray-300 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first project to get started!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Create First Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project, index) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-white/50 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}>
                {/* Card Header with Gradient */}
                <div
                  className={`h-2 bg-gradient-to-r ${getPriorityColor(
                    project.priority
                  )}`}></div>

                <div className="p-4 sm:p-6">
                  {/* Project Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 sm:p-3 bg-gradient-to-r ${getPriorityColor(
                          project.priority
                        )} rounded-lg sm:rounded-xl shadow-lg flex-shrink-0`}>
                        <FaFolder className="text-white text-lg sm:text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaStar className="text-yellow-400 text-xs sm:text-sm flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProject(project);
                          setShowEditForm(true);
                        }}
                        className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                    {project.description || "No description provided"}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaUsers className="text-blue-500 text-sm" />
                      <span>{project.members?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-purple-500 text-sm" />
                      <span className="truncate">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(
                        project.status
                      )} text-white text-xs font-bold rounded-full shadow-md`}>
                      {project.status}
                    </span>
                    <span
                      className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(
                        project.priority
                      )} text-white text-xs font-bold rounded-full shadow-md`}>
                      {project.priority}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <button className="w-full text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
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

export default ProjectsBeautiful;
