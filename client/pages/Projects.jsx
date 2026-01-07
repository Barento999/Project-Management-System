import React, { useState, useEffect } from "react";
import { projectAPI, teamAPI } from "../services/api";
import { FaPlus, FaEdit, FaTrash, FaFolder, FaUsers } from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [error, setError] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "active",
    priority: "medium",
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, teamsRes] = await Promise.all([
        projectAPI.getAll(),
        teamAPI.getAll(),
      ]);
      setProjects(projectsRes.data.projects || []);
      setTeams(teamsRes.data.teams || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newProject.teamId) {
      setError("Please select a team");
      return;
    }

    try {
      console.log("Creating project with data:", newProject);
      const response = await projectAPI.create(newProject);
      console.log("Project created successfully:", response.data);

      setNewProject({
        name: "",
        description: "",
        teamId: "",
        status: "active",
        priority: "medium",
      });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error("Error creating project:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await projectAPI.update(currentProject._id, currentProject);
      setShowEditForm(false);
      setCurrentProject(null);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectAPI.delete(projectId);
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and track progress
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg">
          <FaPlus /> Create Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "active", "completed", "on-hold", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                filter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}>
              {status === "all" ? "All" : status.replace("-", " ")}
            </button>
          )
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Create New Project
          </h2>

          {teams.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">No teams available!</p>
              <p className="text-sm mt-1">
                You need to create a team first before creating a project.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  window.location.href = "/teams";
                }}
                className="mt-2 text-sm underline hover:no-underline">
                Go to Teams page
              </button>
            </div>
          )}

          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter project description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team *
                </label>
                <select
                  value={newProject.teamId}
                  onChange={(e) =>
                    setNewProject({ ...newProject, teamId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newProject.priority}
                  onChange={(e) =>
                    setNewProject({ ...newProject, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={teams.length === 0 || !newProject.teamId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                Create Project
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
      {showEditForm && currentProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Project</h3>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentProject(null);
                    setError("");
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaFolder className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === "all"
              ? "Get started by creating your first project"
              : `No ${filter} projects`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FaFolder className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentProject(project);
                      setShowEditForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description || "No description"}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "active"
                        ? "bg-green-100 text-green-800"
                        : project.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "on-hold"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status === "planned"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Priority:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.priority === "critical"
                        ? "bg-red-100 text-red-800"
                        : project.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : project.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {project.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaUsers /> Members:
                  </span>
                  <span className="text-gray-700 font-medium">
                    {project.members?.length || 0}
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

export default Projects;
