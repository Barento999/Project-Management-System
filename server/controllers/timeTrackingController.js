const asyncHandler = require("express-async-handler");
const TimeEntry = require("../models/TimeEntry");
const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Start time tracking
// @route   POST /api/time-tracking/start
// @access  Private
const startTimer = asyncHandler(async (req, res) => {
  const { taskId, description } = req.body;

  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  // Check if user already has a running timer
  const runningTimer = await TimeEntry.findOne({
    user: req.user._id,
    isRunning: true,
  });
  if (runningTimer) {
    return res.status(400).json({
      success: false,
      message: "You already have a running timer. Please stop it first.",
    });
  }

  const timeEntry = await TimeEntry.create({
    user: req.user._id,
    task: taskId,
    project: task.project,
    description,
    startTime: Date.now(),
    isRunning: true,
  });

  await timeEntry.populate([
    { path: "task", select: "title" },
    { path: "project", select: "name" },
  ]);

  res.status(201).json({
    success: true,
    timeEntry,
  });
});

// @desc    Stop time tracking
// @route   PUT /api/time-tracking/:id/stop
// @access  Private
const stopTimer = asyncHandler(async (req, res) => {
  const timeEntry = await TimeEntry.findById(req.params.id);

  if (!timeEntry) {
    return res
      .status(404)
      .json({ success: false, message: "Time entry not found" });
  }

  if (timeEntry.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (!timeEntry.isRunning) {
    return res
      .status(400)
      .json({ success: false, message: "Timer is not running" });
  }

  timeEntry.endTime = Date.now();
  timeEntry.isRunning = false;
  await timeEntry.save();

  // Update task actual hours
  const task = await Task.findById(timeEntry.task);
  if (task) {
    task.actualHours = (task.actualHours || 0) + timeEntry.duration / 60;
    await task.save();
  }

  await timeEntry.populate([
    { path: "task", select: "title" },
    { path: "project", select: "name" },
  ]);

  res.status(200).json({
    success: true,
    timeEntry,
  });
});

// @desc    Create manual time entry
// @route   POST /api/time-tracking/manual
// @access  Private
const createManualEntry = asyncHandler(async (req, res) => {
  const { taskId, description, startTime, endTime, duration } = req.body;

  if (!taskId || (!duration && (!startTime || !endTime))) {
    return res.status(400).json({
      success: false,
      message: "Task ID and either duration or start/end time are required",
    });
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const timeEntry = await TimeEntry.create({
    user: req.user._id,
    task: taskId,
    project: task.project,
    description,
    startTime: startTime || Date.now(),
    endTime: endTime || Date.now(),
    duration: duration || 0,
    isRunning: false,
  });

  // Update task actual hours
  task.actualHours = (task.actualHours || 0) + timeEntry.duration / 60;
  await task.save();

  await timeEntry.populate([
    { path: "task", select: "title" },
    { path: "project", select: "name" },
  ]);

  res.status(201).json({
    success: true,
    timeEntry,
  });
});

// @desc    Get user's time entries
// @route   GET /api/time-tracking
// @access  Private
const getTimeEntries = asyncHandler(async (req, res) => {
  const { startDate, endDate, taskId, projectId } = req.query;

  const query = { user: req.user._id };

  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }

  if (taskId) query.task = taskId;
  if (projectId) query.project = projectId;

  const timeEntries = await TimeEntry.find(query)
    .populate("task", "title")
    .populate("project", "name")
    .sort({ startTime: -1 });

  const totalDuration = timeEntries.reduce(
    (sum, entry) => sum + entry.duration,
    0
  );

  res.status(200).json({
    success: true,
    count: timeEntries.length,
    totalDuration,
    totalHours: (totalDuration / 60).toFixed(2),
    timeEntries,
  });
});

// @desc    Get running timer
// @route   GET /api/time-tracking/running
// @access  Private
const getRunningTimer = asyncHandler(async (req, res) => {
  const timeEntry = await TimeEntry.findOne({
    user: req.user._id,
    isRunning: true,
  })
    .populate("task", "title")
    .populate("project", "name");

  res.status(200).json({
    success: true,
    timeEntry,
  });
});

// @desc    Update time entry
// @route   PUT /api/time-tracking/:id
// @access  Private
const updateTimeEntry = asyncHandler(async (req, res) => {
  const timeEntry = await TimeEntry.findById(req.params.id);

  if (!timeEntry) {
    return res
      .status(404)
      .json({ success: false, message: "Time entry not found" });
  }

  if (
    timeEntry.user.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  timeEntry.description = req.body.description || timeEntry.description;
  timeEntry.duration = req.body.duration || timeEntry.duration;
  timeEntry.isBillable =
    req.body.isBillable !== undefined
      ? req.body.isBillable
      : timeEntry.isBillable;

  await timeEntry.save();

  res.status(200).json({
    success: true,
    timeEntry,
  });
});

// @desc    Delete time entry
// @route   DELETE /api/time-tracking/:id
// @access  Private
const deleteTimeEntry = asyncHandler(async (req, res) => {
  const timeEntry = await TimeEntry.findById(req.params.id);

  if (!timeEntry) {
    return res
      .status(404)
      .json({ success: false, message: "Time entry not found" });
  }

  if (
    timeEntry.user.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  await TimeEntry.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Time entry deleted successfully",
  });
});

// @desc    Get timesheet report
// @route   GET /api/time-tracking/timesheet
// @access  Private
const getTimesheet = asyncHandler(async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  const query = {};

  // Admin can view any user's timesheet
  if (userId && req.user.role === "ADMIN") {
    query.user = userId;
  } else {
    query.user = req.user._id;
  }

  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }

  const timeEntries = await TimeEntry.find(query)
    .populate("task", "title")
    .populate("project", "name")
    .populate("user", "name email")
    .sort({ startTime: -1 });

  // Group by project
  const byProject = {};
  timeEntries.forEach((entry) => {
    const projectId = entry.project._id.toString();
    if (!byProject[projectId]) {
      byProject[projectId] = {
        project: entry.project,
        totalDuration: 0,
        entries: [],
      };
    }
    byProject[projectId].totalDuration += entry.duration;
    byProject[projectId].entries.push(entry);
  });

  const totalDuration = timeEntries.reduce(
    (sum, entry) => sum + entry.duration,
    0
  );

  res.status(200).json({
    success: true,
    totalDuration,
    totalHours: (totalDuration / 60).toFixed(2),
    byProject,
    timeEntries,
  });
});

module.exports = {
  startTimer,
  stopTimer,
  createManualEntry,
  getTimeEntries,
  getRunningTimer,
  updateTimeEntry,
  deleteTimeEntry,
  getTimesheet,
};
