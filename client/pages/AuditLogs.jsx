import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaCalendar,
  FaFilter,
  FaDownload,
  FaSearch,
  FaEye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { activityLogAPI } from "../services/api";
import { exportToCSV } from "../utils/exportUtils";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    action: "all",
    entityType: "all",
    user: "",
    search: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    critical: 0,
    users: 0,
  });

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await activityLogAPI.getAll({ limit: 500 });
      const fetchedLogs = response.data.activityLogs || response.data || [];
      // Ensure it's an array
      const logsArray = Array.isArray(fetchedLogs) ? fetchedLogs : [];
      setLogs(logsArray);
      calculateStats(logsArray);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logData) => {
    // Ensure logData is an array
    const logsArray = Array.isArray(logData) ? logData : [];

    const today = new Date().toDateString();
    const todayLogs = logsArray.filter(
      (log) => new Date(log.createdAt).toDateString() === today
    );
    const criticalActions = ["delete", "remove", "deactivate", "failed"];
    const criticalLogs = logsArray.filter((log) =>
      criticalActions.some((action) =>
        log.action.toLowerCase().includes(action)
      )
    );
    const uniqueUsers = new Set(logsArray.map((log) => log.user?._id)).size;

    setStats({
      total: logsArray.length,
      today: todayLogs.length,
      critical: criticalLogs.length,
      users: uniqueUsers,
    });
  };

  const getActionBadgeColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add"))
      return "bg-green-100 text-green-800 border-green-300";
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "bg-blue-100 text-blue-800 border-blue-300";
    if (actionLower.includes("delete") || actionLower.includes("remove"))
      return "bg-red-100 text-red-800 border-red-300";
    if (actionLower.includes("login") || actionLower.includes("auth"))
      return "bg-purple-100 text-purple-800 border-purple-300";
    if (actionLower.includes("failed") || actionLower.includes("error"))
      return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getSeverityIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (
      actionLower.includes("delete") ||
      actionLower.includes("remove") ||
      actionLower.includes("failed")
    ) {
      return <FaExclamationTriangle className="text-red-600" />;
    }
    if (actionLower.includes("create") || actionLower.includes("add")) {
      return <FaCheckCircle className="text-green-600" />;
    }
    return <FaInfoCircle className="text-blue-600" />;
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const matchesDateFrom =
      !filters.dateFrom || logDate >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || logDate <= new Date(filters.dateTo + "T23:59:59");
    const matchesAction =
      filters.action === "all" ||
      log.action.toLowerCase().includes(filters.action.toLowerCase());
    const matchesEntityType =
      filters.entityType === "all" || log.entityType === filters.entityType;
    const matchesUser =
      !filters.user ||
      log.user?.name?.toLowerCase().includes(filters.user.toLowerCase());
    const matchesSearch =
      !filters.search ||
      log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(filters.search.toLowerCase());

    return (
      matchesDateFrom &&
      matchesDateTo &&
      matchesAction &&
      matchesEntityType &&
      matchesUser &&
      matchesSearch
    );
  });

  const handleExport = () => {
    const exportData = filteredLogs.map((log) => ({
      Timestamp: new Date(log.createdAt).toLocaleString(),
      User: log.user?.name || "Unknown",
      Email: log.user?.email || "N/A",
      Action: log.action,
      Entity: log.entityType,
      Description: log.description || "",
      "IP Address": log.ipAddress || "N/A",
    }));
    exportToCSV(
      exportData,
      `audit-logs-${new Date().toISOString().split("T")[0]}`
    );
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      action: "all",
      entityType: "all",
      user: "",
      search: "",
    });
  };

  const viewDetails = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-4xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Audit Logs & Security Compliance
                </h1>
                <p className="text-gray-600">
                  Track all system changes and user activities
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaDownload />
              Export Logs
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaShieldAlt className="text-3xl text-blue-600" />
              <span className="text-3xl font-bold text-gray-800">
                {stats.total}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Events</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaCalendar className="text-3xl text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {stats.today}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Today's Events</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaExclamationTriangle className="text-3xl text-red-600" />
              <span className="text-3xl font-bold text-red-600">
                {stats.critical}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Critical Actions
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-3xl text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">
                {stats.users}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Active Users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity Type
              </label>
              <select
                value={filters.entityType}
                onChange={(e) =>
                  setFilters({ ...filters, entityType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Entities</option>
                <option value="User">User</option>
                <option value="Project">Project</option>
                <option value="Task">Task</option>
                <option value="Team">Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) =>
                  setFilters({ ...filters, user: e.target.value })
                }
                placeholder="Search user..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  placeholder="Search..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} events
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityIcon(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {log.user?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getActionBadgeColor(
                          log.action
                        )}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.description || "No details"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewDetails(log)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No audit logs found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>

        {/* Compliance Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 mb-1">
                Security Compliance
              </p>
              <p className="text-sm text-blue-700">
                All system activities are logged for security and compliance
                purposes. Logs are retained for audit trails and can be exported
                for external review. Critical actions (deletions, access
                changes) are highlighted for easy identification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Audit Log Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Timestamp
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Action
                  </label>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getActionBadgeColor(
                      selectedLog.action
                    )}`}>
                    {selectedLog.action}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    User
                  </label>
                  <p className="text-gray-900">
                    {selectedLog.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedLog.user?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Entity Type
                  </label>
                  <p className="text-gray-900">{selectedLog.entityType}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Entity ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs">
                    {selectedLog.entityId || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    IP Address
                  </label>
                  <p className="text-gray-900">
                    {selectedLog.ipAddress || "Not recorded"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedLog.description || "No description available"}
                </p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Additional Metadata
                  </label>
                  <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
