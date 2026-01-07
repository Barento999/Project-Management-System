import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI, taskAPI } from "../services/api";
import {
  FaChartBar,
  FaCalendarAlt,
  FaFilter,
  FaExpand,
  FaCompress,
  FaDownload,
} from "react-icons/fa";

const GanttChart = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("all");
  const [viewMode, setViewMode] = useState("month"); // day, week, month
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        projectAPI.getAll(),
        taskAPI.getAll(),
      ]);

      setProjects(projectsRes.data.projects || projectsRes.data || []);
      let allTasks = tasksRes.data.tasks || tasksRes.data || [];

      if (selectedProject !== "all") {
        allTasks = allTasks.filter(
          (task) => task.project?._id === selectedProject
        );
      }

      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3);
    return { startDate, endDate };
  };

  const generateTimelineColumns = () => {
    const { startDate, endDate } = getDateRange();
    const columns = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      if (viewMode === "month") {
        columns.push({
          label: current.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          date: new Date(current),
        });
        current.setMonth(current.getMonth() + 1);
      } else if (viewMode === "week") {
        columns.push({
          label: `Week ${Math.ceil(current.getDate() / 7)}`,
          date: new Date(current),
        });
        current.setDate(current.getDate() + 7);
      } else {
        columns.push({
          label: current.getDate().toString(),
          date: new Date(current),
        });
        current.setDate(current.getDate() + 1);
      }
    }

    return columns;
  };

  const calculateTaskPosition = (task, columns) => {
    if (!task.dueDate) return null;

    const taskStart = task.startDate ? new Date(task.startDate) : new Date();
    const taskEnd = new Date(task.dueDate);
    const { startDate, endDate } = getDateRange();

    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const taskStartDays = (taskStart - startDate) / (1000 * 60 * 60 * 24);
    const taskDuration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);

    const left = (taskStartDays / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;

    return { left: `${Math.max(0, left)}%`, width: `${Math.max(2, width)}%` };
  };

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-400",
      "In Progress": "bg-blue-500",
      Review: "bg-yellow-500",
      Done: "bg-green-500",
    };
    return colors[status] || "bg-gray-400";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "border-l-4 border-green-500",
      Medium: "border-l-4 border-yellow-500",
      High: "border-l-4 border-orange-500",
      Urgent: "border-l-4 border-red-500",
    };
    return colors[priority] || "";
  };

  const columns = generateTimelineColumns();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : ""} bg-gray-50 p-6`}>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaChartBar className="text-4xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Gantt Chart
                </h1>
                <p className="text-gray-600">Visual project timeline</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 rounded ${
                  viewMode === "day"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 rounded ${
                  viewMode === "week"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                Week
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-3 py-1 rounded ${
                  viewMode === "month"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Timeline Header */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <div className="w-64 p-4 font-semibold text-gray-700 border-r border-gray-200">
                  Task Name
                </div>
                <div className="flex-1 flex">
                  {columns.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex-1 p-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200">
                      {col.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Rows */}
              <div className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">No tasks to display</p>
                    <p className="text-sm mt-2">
                      Create tasks with due dates to see them here
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const position = calculateTaskPosition(task, columns);
                    return (
                      <div
                        key={task._id}
                        className="flex hover:bg-gray-50 group">
                        <div className="w-64 p-4 border-r border-gray-200">
                          <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/tasks/${task._id}`)}>
                            <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {task.project?.name || "No Project"}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 relative p-4">
                          {position && (
                            <div
                              className={`absolute top-1/2 transform -translate-y-1/2 h-8 rounded ${getStatusColor(
                                task.status
                              )} ${getPriorityColor(
                                task.priority
                              )} shadow-md cursor-pointer hover:shadow-lg transition-shadow group`}
                              style={position}
                              onClick={() => navigate(`/tasks/${task._id}`)}
                              title={`${task.title} - ${task.status}`}>
                              <div className="px-2 py-1 text-white text-xs font-medium truncate h-full flex items-center">
                                {task.title}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-xs text-gray-600">To Do</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-600">Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">Done</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Priority:
              </p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-l-4 border-green-500 bg-gray-200"></div>
                  <span className="text-xs text-gray-600">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-l-4 border-yellow-500 bg-gray-200"></div>
                  <span className="text-xs text-gray-600">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-l-4 border-orange-500 bg-gray-200"></div>
                  <span className="text-xs text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-l-4 border-red-500 bg-gray-200"></div>
                  <span className="text-xs text-gray-600">Urgent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
