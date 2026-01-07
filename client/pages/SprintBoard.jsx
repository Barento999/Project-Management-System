import React, { useState, useEffect } from "react";
import { taskAPI, projectAPI } from "../services/api";
import {
  FaRunning,
  FaPlus,
  FaClock,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

const SprintBoard = () => {
  const [sprints, setSprints] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [backlog, setBacklog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: "",
    startDate: "",
    endDate: "",
    goal: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get sprints from localStorage (demo mode)
      const storedSprints = JSON.parse(localStorage.getItem("sprints") || "[]");
      setSprints(storedSprints);

      const active = storedSprints.find((s) => s.status === "active");
      setActiveSprint(active);

      // Fetch all tasks
      const tasksRes = await taskAPI.getAll();
      const allTasks = tasksRes.data.tasks || tasksRes.data || [];

      // Filter backlog tasks (not in any sprint)
      const backlogTasks = allTasks.filter(
        (task) => !task.sprintId && task.status !== "Done"
      );
      setBacklog(backlogTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSprint = () => {
    const sprint = {
      id: Date.now().toString(),
      ...newSprint,
      status: "planned",
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...sprints, sprint];
    setSprints(updated);
    localStorage.setItem("sprints", JSON.stringify(updated));

    setShowCreateSprint(false);
    setNewSprint({ name: "", startDate: "", endDate: "", goal: "" });
  };

  const startSprint = (sprintId) => {
    const updated = sprints.map((s) => ({
      ...s,
      status:
        s.id === sprintId
          ? "active"
          : s.status === "active"
          ? "completed"
          : s.status,
    }));
    setSprints(updated);
    localStorage.setItem("sprints", JSON.stringify(updated));
    setActiveSprint(updated.find((s) => s.id === sprintId));
  };

  const completeSprint = (sprintId) => {
    const updated = sprints.map((s) => ({
      ...s,
      status: s.id === sprintId ? "completed" : s.status,
    }));
    setSprints(updated);
    localStorage.setItem("sprints", JSON.stringify(updated));
    setActiveSprint(null);
  };

  const calculateSprintProgress = (sprint) => {
    if (!sprint || !sprint.tasks || sprint.tasks.length === 0) return 0;
    const completed = sprint.tasks.filter((t) => t.status === "Done").length;
    return Math.round((completed / sprint.tasks.length) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaRunning className="text-4xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Sprint Board
                </h1>
                <p className="text-gray-600">Agile sprint management</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateSprint(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus />
              Create Sprint
            </button>
          </div>
        </div>

        {/* Active Sprint */}
        {activeSprint && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeSprint.name}
                </h2>
                <p className="text-gray-600 mt-1">{activeSprint.goal}</p>
              </div>
              <button
                onClick={() => completeSprint(activeSprint.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Complete Sprint
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Days Remaining
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {getDaysRemaining(activeSprint.endDate)}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {calculateSprintProgress(activeSprint)}%
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Total Tasks
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {activeSprint.tasks?.length || 0}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaRunning className="text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Story Points
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {activeSprint.tasks?.reduce(
                    (sum, t) => sum + (t.storyPoints || 0),
                    0
                  ) || 0}
                </p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sprint Progress</span>
                <span>{calculateSprintProgress(activeSprint)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${calculateSprintProgress(activeSprint)}%`,
                  }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Planned Sprints */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Planned Sprints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprints
              .filter((s) => s.status === "planned")
              .map((sprint) => (
                <div
                  key={sprint.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {sprint.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{sprint.goal}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>
                      {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                      {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => startSprint(sprint.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Start Sprint
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Backlog */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Product Backlog
          </h2>
          <div className="space-y-3">
            {backlog.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No items in backlog
              </p>
            ) : (
              backlog.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {task.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      SP: {task.storyPoints || "?"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Sprint Modal */}
        {showCreateSprint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Create New Sprint
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sprint Name
                  </label>
                  <input
                    type="text"
                    value={newSprint.name}
                    onChange={(e) =>
                      setNewSprint({ ...newSprint, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sprint 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sprint Goal
                  </label>
                  <textarea
                    value={newSprint.goal}
                    onChange={(e) =>
                      setNewSprint({ ...newSprint, goal: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="What do you want to achieve?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newSprint.startDate}
                      onChange={(e) =>
                        setNewSprint({
                          ...newSprint,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newSprint.endDate}
                      onChange={(e) =>
                        setNewSprint({ ...newSprint, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateSprint(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={createSprint}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintBoard;
