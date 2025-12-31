const asyncHandler = require("express-async-handler");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private
const getActivityLogs = asyncHandler(async (req, res) => {
  const { entityType, entityId, userId, action, startDate, endDate } =
    req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const query = {};

  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;
  if (userId) query.user = userId;
  if (action) query.action = action;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Non-admin users can only see their own activity
  if (req.user.role !== "ADMIN" && !userId) {
    query.user = req.user._id;
  }

  const logs = await ActivityLog.find(query)
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await ActivityLog.countDocuments(query);

  res.status(200).json({
    success: true,
    count: logs.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    logs,
  });
});

// @desc    Get activity logs for a specific entity
// @route   GET /api/activity-logs/:entityType/:entityId
// @access  Private
const getEntityActivityLogs = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const logs = await ActivityLog.find({ entityType, entityId })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(100);

  res.status(200).json({
    success: true,
    count: logs.length,
    logs,
  });
});

// @desc    Create activity log (utility function)
const createActivityLog = async (data) => {
  try {
    await ActivityLog.create(data);
  } catch (error) {
    console.error("Error creating activity log:", error);
  }
};

module.exports = {
  getActivityLogs,
  getEntityActivityLogs,
  createActivityLog,
};
