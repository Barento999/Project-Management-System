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

  useEffect(() => {
    fetchTimesheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaCalendar className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading timesheet...</p>
        </div>
      </div>
    );
  }

  const projectsData = timesheet?.byProject
    ? Object.values(timesheet.byProject)
    : [];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            📊 Timesheet Report
          </h1>
          <p className="text-gray-500">
            View and export your time tracking reports
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8 bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-green-600">
                  {timesheet?.totalHours || "0.00"}h
                </p>
              </div>
              <FaClock className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-blue-600">
                  {timesheet?.timeEntries?.length || 0}
                </p>
              </div>
              <FaChartPie className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Projects</p>
                <p className="text-3xl font-bold text-blue-600">
                  {projectsData.length}
                </p>
              </div>
              <FaProjectDiagram className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Time by Project */}
        <div className="mb-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaProjectDiagram className="text-blue-600" /> Time by Project
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
                    className="bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">
                        {projectData.project.name}
                      </h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatDuration(projectData.totalDuration)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {percentage}% of total
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {projectData.entries.length} entries
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Entries */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timesheet.timeEntries.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(entry.startTime).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {entry.task?.title || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {entry.project?.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {entry.description || "-"}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-blue-600">
                        {formatDuration(entry.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td
                      colSpan="4"
                      className="py-4 px-4 text-right font-bold text-gray-900">
                      Total:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-2xl text-blue-600">
                      {timesheet.totalHours}h
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimesheetBeautiful;
