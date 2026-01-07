import React, { useState, useEffect } from "react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaUsers className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/teams")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all">
          <FaArrowLeft />
          <span>Back to Teams</span>
        </button>

        {/* Team Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {team.name}
                </h1>
              </div>
              <p className="text-gray-500">
                {team.description || "No description"}
              </p>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaUsers className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Total Members</p>
                <p className="font-semibold text-gray-900">
                  {(team.members?.length || 0) + 1}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaProjectDiagram className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Projects</p>
                <p className="font-semibold text-gray-900">
                  {team.projects?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaUsers className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="font-semibold text-gray-900">
                  {team.owner?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <TeamMemberManagement team={team} onUpdate={fetchTeam} />
        </div>

        {/* Projects List */}
        {team.projects && team.projects.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Team Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FaProjectDiagram className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {project.name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
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
    </div>
  );
};

export default TeamDetailsBeautiful;
