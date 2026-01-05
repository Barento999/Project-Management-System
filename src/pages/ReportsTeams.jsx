import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUser,
  FaProjectDiagram,
  FaChartLine,
  FaArrowLeft,
  FaChartBar,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";
import { teamAPI, projectAPI } from "../services/api";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  formatDataForExport,
} from "../utils/exportUtils";

const ReportsTeams = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, projectsRes] = await Promise.all([
        teamAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setTeams(teamsRes.data.teams || []);
      setProjects(projectsRes.data.projects || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTeams([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    const formattedData = formatDataForExport(teams, "teams");
    const filename = `team-report-${new Date().toISOString().split("T")[0]}`;

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

  const totalMembers = teams.reduce(
    (acc, team) => acc + (team.members?.length || 0),
    0
  );
  const activeProjects = projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const avgTeamSize =
    teams.length > 0 ? Math.round(totalMembers / teams.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaUsers className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading team reports...</p>
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
              <div className="p-3 bg-purple-600 rounded-xl">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Team Reports
                </h1>
                <p className="text-gray-500 mt-1">
                  View analytics and metrics for your teams
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
                <p className="text-sm text-gray-500 mb-1">Total Teams</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teams.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalMembers}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUser className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {activeProjects}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <FaProjectDiagram className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Team Size</p>
                <p className="text-3xl font-bold text-gray-900">
                  {avgTeamSize}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Team Size Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-purple-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">
              Team Size Distribution
            </h2>
          </div>
          <div className="space-y-3">
            {teams.map((team) => {
              const memberCount = team.members?.length || 0;
              const percentage =
                totalMembers > 0 ? (memberCount / totalMembers) * 100 : 0;
              return (
                <div key={team._id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      {team.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {memberCount} members
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teams List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Teams</h2>
          <div className="space-y-3">
            {teams.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No teams found</p>
              </div>
            ) : (
              teams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => navigate(`/teams/${team._id}`)}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {team.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Members</p>
                        <p className="text-lg font-bold text-gray-900">
                          {team.members?.length || 0}
                        </p>
                      </div>
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

export default ReportsTeams;
