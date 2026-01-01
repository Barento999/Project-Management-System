import { useState, useEffect } from "react";
import {
  FaCalendar,
  FaDownload,
  FaChartPie,
  FaClock,
  FaProjectDiagram,
} from "react-icons/fa";
import { timeTrackingAPI } from "../services/api";

const TimesheetBeautiful = () => {
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTimesheet();
  }, [dateRange]);

  const fetchTimesheet = async () => {
    try {
      setLoading(true);
      const res = await timeTrackingAPI.getTimesheet(dateRange);
      setTimesheet(res.data);
    } catch (error) {
      console.error("Error fetching timesheet:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const exportToCSV = () => {
    if (!timesheet || !timesheet.timeEntries) return;

    const headers = [
      "Date",
      "Task",
      "Project",
      "Description",
      "Duration (hours)",
    ];
    const rows = timesheet.timeEntries.map((entry) => [
      new Date(entry.startTime).toLocaleDateString(),
      entry.task?.title || "N/A",
      entry.project?.name || "N/A",
      entry.description || "",
      (entry.duration / 60).toFixed(2),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timesheet_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaCalendar className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading timesheet...</p>
        </div>
      </div>
    );
  }

  const projectsData = timesheet?.byProject
    ? Object.values(timesheet.byProject)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            📊 Timesheet Report
          </h1>
          <p className="text-gray-600">
            View and export your time tracking reports
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2">
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-green-600">
                  {timesheet?.totalHours || "0.00"}h
                </p>
              </div>
              <FaClock className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-teal-600">
                  {timesheet?.timeEntries?.length || 0}
                </p>
              </div>
              <FaChartPie className="w-12 h-12 text-teal-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Projects</p>
                <p className="text-3xl font-bold text-blue-600">
                  {projectsData.length}
                </p>
              </div>
              <FaProjectDiagram className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Time by Project */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaProjectDiagram className="text-teal-600" /> Time by Project
          </h2>

          {projectsData.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No time entries in this period
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectsData.map((projectData, index) => {
                const percentage = (
                  (projectData.totalDuration / timesheet.totalDuration) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border-l-4 border-teal-500">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800">
                        {projectData.project.name}
                      </h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-600">
                          {formatDuration(projectData.totalDuration)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {percentage}% of total
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {projectData.entries.length} entries
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Entries */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaClock className="text-green-600" /> Detailed Entries
          </h2>

          {!timesheet?.timeEntries || timesheet.timeEntries.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timesheet.timeEntries.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className={`border-b border-gray-100 hover:bg-teal-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(entry.startTime).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {entry.task?.title || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {entry.project?.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {entry.description || "-"}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-teal-600">
                        {formatDuration(entry.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td
                      colSpan="4"
                      className="py-4 px-4 text-right font-bold text-gray-800">
                      Total:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-2xl text-teal-600">
                      {timesheet.totalHours}h
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
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

export default TimesheetBeautiful;
