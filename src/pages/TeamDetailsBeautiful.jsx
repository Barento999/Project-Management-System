import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUsers, FaArrowLeft, FaProjectDiagram } from "react-icons/fa";
import { teamAPI } from "../services/api";
import TeamMemberManagement from "../components/TeamMemberManagement";

const TeamDetailsBeautiful = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamAPI.getOne(id);
      setTeam(res.data.team);
    } catch (error) {
      console.error("Error fetching team:", error);
      alert("Team not found");
      navigate("/teams");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaUsers className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/teams")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all">
          <FaArrowLeft />
          <span>Back to Teams</span>
        </button>

        {/* Team Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {team.name}
                </h1>
              </div>
              <p className="text-gray-600">
                {team.description || "No description"}
              </p>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <FaUsers className="text-purple-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Total Members</p>
                <p className="font-semibold text-gray-800">
                  {(team.members?.length || 0) + 1}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <FaProjectDiagram className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Projects</p>
                <p className="font-semibold text-gray-800">
                  {team.projects?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <FaUsers className="text-green-600 text-xl" />
              <div>
                <p className="text-xs text-gray-600">Owner</p>
                <p className="font-semibold text-gray-800">
                  {team.owner?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
          <TeamMemberManagement team={team} onUpdate={fetchTeam} />
        </div>

        {/* Projects List */}
        {team.projects && team.projects.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Team Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FaProjectDiagram className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {project.name}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {project.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default TeamDetailsBeautiful;
