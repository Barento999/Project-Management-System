import React, { useState, useEffect } from "react";
import { projectAPI, teamAPI } from "../services/api";

const ProjectsSimple = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "active",
    priority: "medium",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, teamsRes] = await Promise.all([
        projectAPI.getAll(),
        teamAPI.getAll(),
      ]);
      setProjects(projectsRes.data.projects || []);
      setTeams(teamsRes.data.teams || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error loading data: " + error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.teamId) {
      alert("Please select a team!");
      return;
    }

    try {
      console.log("Submitting:", formData);
      const response = await projectAPI.create(formData);
      console.log("Success:", response.data);

      alert("Project created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        teamId: "",
        status: "active",
        priority: "medium",
      });

      // Reload data
      loadData();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Projects (Simple Version)</h1>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>

        {teams.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-4">
            <strong>Warning:</strong> No teams found! Please create a team
            first.
            <br />
            <a href="/teams" className="underline">
              Go to Teams page
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Team *</label>
            <select
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              required>
              <option value="">-- Select a team --</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={teams.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Create Project
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Projects ({projects.length})</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-gray-200 rounded p-4">
                <h3 className="font-bold text-lg">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    {project.status}
                  </span>
                  <span className="bg-green-100 px-2 py-1 rounded">
                    {project.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSimple;
