import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaUser,
  FaClock,
  FaComment,
  FaUpload,
} from "react-icons/fa";
import { activityLogAPI } from "../services/api";

const ActivityFeed = ({ entityType, entityId, limit = 20 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [entityType, entityId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let res;
      if (entityType && entityId) {
        res = await activityLogAPI.getByEntity(entityType, entityId);
      } else {
        res = await activityLogAPI.getAll({ limit });
      }
      setActivities(res.data.logs || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: <FaPlus className="text-green-600" />,
      UPDATE: <FaEdit className="text-blue-600" />,
      DELETE: <FaTrash className="text-red-600" />,
      COMPLETE: <FaCheck className="text-green-600" />,
      COMMENT: <FaComment className="text-purple-600" />,
      UPLOAD: <FaUpload className="text-indigo-600" />,
      ASSIGN: <FaUser className="text-blue-600" />,
      UNASSIGN: <FaUser className="text-gray-600" />,
    };
    return icons[action] || <FaClock className="text-gray-600" />;
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 border-green-300",
      UPDATE: "bg-blue-100 border-blue-300",
      DELETE: "bg-red-100 border-red-300",
      COMPLETE: "bg-green-100 border-green-300",
      COMMENT: "bg-purple-100 border-purple-300",
      UPLOAD: "bg-indigo-100 border-indigo-300",
      ASSIGN: "bg-blue-100 border-blue-300",
      UNASSIGN: "bg-gray-100 border-gray-300",
    };
    return colors[action] || "bg-gray-100 border-gray-300";
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return activityDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-center py-8">
          <FaHistory className="w-8 h-8 text-gray-400 animate-spin" />
          <span className="ml-3 text-gray-500">Loading activity...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaHistory className="text-indigo-600" />
          Activity Log
        </h3>
        <span className="text-sm text-gray-500">
          {activities.length} activities
        </span>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <FaHistory className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400">Activity will appear here</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200"></div>

            {activities.map((activity, index) => (
              <div key={activity._id} className="relative pl-12 pb-6 last:pb-0">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 w-10 h-10 rounded-full border-2 ${getActionColor(
                    activity.action
                  )} flex items-center justify-center shadow-lg`}>
                  {getActionIcon(activity.action)}
                </div>

                {/* Activity content */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {activity.user?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.action === "CREATE"
                          ? "bg-green-100 text-green-700"
                          : activity.action === "UPDATE"
                          ? "bg-blue-100 text-blue-700"
                          : activity.action === "DELETE"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      {activity.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{formatDate(activity.createdAt)}</span>
                    </div>
                    {activity.entityType && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {activity.entityType}: {activity.entityName}
                      </span>
                    )}
                  </div>

                  {/* Show changes if available */}
                  {activity.changes &&
                    Object.keys(activity.changes).length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-semibold text-blue-800 mb-2">
                          Changes:
                        </p>
                        <div className="space-y-1 text-xs">
                          {Object.entries(activity.changes).map(
                            ([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-medium text-gray-700">
                                  {key}:
                                </span>
                                <span className="text-gray-600">
                                  {value.from && (
                                    <span className="line-through text-red-600">
                                      {value.from}
                                    </span>
                                  )}
                                  {value.from && value.to && " → "}
                                  {value.to && (
                                    <span className="text-green-600">
                                      {value.to}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
