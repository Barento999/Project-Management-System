import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaArrowLeft,
  FaUsers,
  FaCalendar,
  FaFlag,
  FaTasks,
} from "react-icons/fa";
import { projectAPI } from "../services/api";
import CommentsSection from "../components/CommentsSection";
import ActivityFeed from "../components/ActivityFeed";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import WorkloadDistribution from "../components/WorkloadDistribution";
import ProjectMemberManagement from "../components/ProjectMemberManagement";

const ProjectDetailsBeautiful = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");
  const [fileRefresh, setFileRefresh] = useState(0);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getOne(id);
      setProject(res.data.project);
    } catch (error) {
      console.error("Error fetching project:", error);
      alert("Project not found");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-600 text-white border-green-600",
      medium: "bg-amber-500 text-white border-amber-500",
      high: "bg-red-600 text-white border-red-600",
      critical: "bg-red-600 text-white border-red-600",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-gray-400 text-white border-gray-400",
      active: "bg-blue-600 text-white border-blue-600",
      "on-hold": "bg-amber-500 text-white border-amber-500",
      completed: "bg-green-600 text-white border-green-600",
      cancelled: "bg-red-600 text-white border-red-600",
    };
    return colors[status] || colors.planned;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaProjectDiagram className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all">
          <FaArrowLeft />
          <span>Back to Projects</span>
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-500">
                {project.description || "No description"}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-xl font-semibold ${getPriorityColor(
                  project.priority
                )}`}>
                {project.priority?.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(
                  project.status
                )}`}>
                {project.status?.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Project Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaUsers className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Team</p>
                <p className="font-semibold text-gray-900">
                  {project.team?.name || "No team"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaTasks className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Tasks</p>
                <p className="font-semibold text-gray-900">
                  {project.tasks?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaCalendar className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaCalendar className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-3xl shadow-xl border border-gray-200 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "comments"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "activity"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              📊 Activity
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "files"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              📎 Files
            </button>
            <button
              onClick={() => setActiveTab("workload")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "workload"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              📊 Workload
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "members"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              👥 Members
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-3xl shadow-xl border border-gray-200 p-6">
          {activeTab === "comments" ? (
            <CommentsSection
              entityType="Project"
              entityId={project._id}
              entityName={project.name}
            />
          ) : activeTab === "activity" ? (
            <ActivityFeed entityType="Project" entityId={project._id} />
          ) : activeTab === "files" ? (
            <div className="space-y-6">
              <FileUpload
                entityType="project"
                entityId={project._id}
                onUploadSuccess={() => setFileRefresh((prev) => prev + 1)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attached Files
                </h3>
                <FileList
                  entityType="project"
                  entityId={project._id}
                  refreshTrigger={fileRefresh}
                />
              </div>
            </div>
          ) : activeTab === "workload" ? (
            <WorkloadDistribution projectId={project._id} />
          ) : (
            <ProjectMemberManagement
              project={project}
              onUpdate={fetchProject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsBeautiful;
