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
      low: "bg-green-100 text-green-700 border-green-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      critical: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-gray-100 text-gray-700 border-gray-300",
      active: "bg-blue-100 text-blue-700 border-blue-300",
      "on-hold": "bg-yellow-100 text-yellow-700 border-yellow-300",
      completed: "bg-green-100 text-green-700 border-green-300",
    };
    return colors[status] || colors.planned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaProjectDiagram className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all">
          <FaArrowLeft />
          <span>Back to Projects</span>
        </button>

        {/* Project Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600">
                {project.description || "No description"}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${getPriorityColor(
                  project.priority
                )}`}>
                {project.priority?.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(
                  project.status
                )}`}>
                {project.status?.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Project Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <FaUsers className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Team</p>
                <p className="font-semibold text-gray-800">
                  {project.team?.name || "No team"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <FaTasks className="text-purple-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Tasks</p>
                <p className="font-semibold text-gray-800">
                  {project.tasks?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <FaCalendar className="text-green-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-800">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <FaCalendar className="text-orange-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">End Date</p>
                <p className="font-semibold text-gray-800">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-xl border border-white/50 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "comments"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "activity"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              📊 Activity
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "files"
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              📎 Files
            </button>
            <button
              onClick={() => setActiveTab("workload")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "workload"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              📊 Workload
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "members"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              👥 Members
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-b-3xl shadow-xl border border-white/50 p-6">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
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

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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
      `}</style>
    </div>
  );
};

export default ProjectDetailsBeautiful;
