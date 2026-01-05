import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaChartBar,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";
import { projectAPI } from "../services/api";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  formatDataForExport,
} from "../utils/exportUtils";

const ReportsProjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    const formattedData = formatDataForExport(projects, "projects");
    const filename = `project-report-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportToCSV(formattedData, filename);
        break;
      case "excel":
        exportToExcel(formattedData, filename);
        break;
      case "pdf":
        exportToPDF("report-content", filename);
        break;
      default:
        break;
    }
  };

  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const overdueProjects = projects.filter((p) => {
    if (p.endDate && p.status !== "COMPLETED") {
      return new Date(p.endDate) < new Date();
    }
    return false;
  }).length;

  const completionRate =
    projects.length > 0
      ? Math.round((completedProjects / projects.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaProjectDiagram className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading project reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6" id="report-content">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/reports")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div className="p-3 bg-blue-600 rounded-xl">
                <FaProjectDiagram className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Reports
                </h1>
                <p className="text-gray-500 mt-1">
                  View analytics and metrics for your projects
                </p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                title="Export to CSV">
                <FaFileCsv /> CSV
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                title="Export to Excel">
                <FaFileExcel /> Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                title="Export to PDF">
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaProjectDiagram className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedProjects}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {inProgressProjects}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <FaClock className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overdueProjects}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">
              Project Completion Rate
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all"
                  style={{ width: `${completionRate}%` }}>
                  {completionRate}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {completionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Projects
          </h2>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FaProjectDiagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No projects found</p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          project.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : project.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        {project.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsProjects;
