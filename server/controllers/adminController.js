const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const teamCount = await Team.countDocuments();
  const projectCount = await Project.countDocuments();
  const taskCount = await Task.countDocuments();

  // Get counts for different statuses
  const activeUsers = await User.countDocuments({ isActive: true });
  const activeProjects = await Project.countDocuments({ status: 'active' });
  const completedTasks = await Task.countDocuments({ status: 'done' });
  const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers: userCount,
      activeUsers,
      totalTeams: teamCount,
      totalProjects: projectCount,
      activeProjects,
      totalTasks: taskCount,
      completedTasks,
      inProgressTasks
    }
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Build search query
  const searchQuery = search 
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const users = await User.find(searchQuery)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    users
  });
});

// @desc    Get all teams (admin only)
// @route   GET /api/admin/teams
// @access  Private/Admin
const getAllTeams = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Build search query
  const searchQuery = search 
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const teams = await Team.find(searchQuery)
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Team.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    count: teams.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    teams
  });
});

// @desc    Get all projects (admin only)
// @route   GET /api/admin/projects
// @access  Private/Admin
const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Build search query
  const searchQuery = search 
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const projects = await Project.find(searchQuery)
    .populate('team', 'name')
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    projects
  });
});

// @desc    Get all tasks (admin only)
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Build search query
  const searchQuery = search 
    ? { title: { $regex: search, $options: 'i' } }
    : {};

  const tasks = await Task.find(searchQuery)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Task.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    tasks
  });
});

// @desc    Update user (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update user fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt
    }
  });
});

// @desc    Delete user (admin only - soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Instead of hard deleting, we'll deactivate the user
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// @desc    Get recent activity (admin only)
// @route   GET /api/admin/activity
// @access  Private/Admin
const getRecentActivity = asyncHandler(async (req, res) => {
  // Get recent tasks, projects, and teams created
  const recentTasks = await Task.find({})
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentProjects = await Project.find({})
    .populate('owner', 'name email')
    .populate('team', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentTeams = await Team.find({})
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    activity: {
      recentTasks,
      recentProjects,
      recentTeams
    }
  });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllTeams,
  getAllProjects,
  getAllTasks,
  updateUser,
  deleteUser,
  getRecentActivity
};