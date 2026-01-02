const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update user fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.isActive =
    req.body.isActive !== undefined ? req.body.isActive : user.isActive;

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
      createdAt: updatedUser.createdAt,
    },
  });
});

// @desc    Delete user (admin only - soft delete by deactivating)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Instead of hard deleting, we'll deactivate the user
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
  });
});

// @desc    Get current user's teams
// @route   GET /api/users/my-teams
// @access  Private
const getMyTeams = asyncHandler(async (req, res) => {
  const User = require("../models/User");
  const Team = require("../models/Team");

  // Find teams where the user is either owner or member
  const teams = await Team.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name email")
    .populate("members", "name email");

  res.status(200).json({
    success: true,
    teams,
  });
});

// @desc    Get current user's projects
// @route   GET /api/users/my-projects
// @access  Private
const getMyProjects = asyncHandler(async (req, res) => {
  const Project = require("../models/Project");

  // Find projects where the user is either owner or member
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("team", "name")
    .populate("owner", "name email");

  res.status(200).json({
    success: true,
    projects,
  });
});

// @desc    Get current user's assigned tasks
// @route   GET /api/users/my-tasks
// @access  Private
const getMyTasks = asyncHandler(async (req, res) => {
  const Task = require("../models/Task");

  // Find tasks assigned to the user
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate("project", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    tasks,
  });
});

// @desc    Search users (for team/project management)
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  // Build search criteria
  let searchCriteria = { isActive: true };

  if (query) {
    searchCriteria.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  const users = await User.find(searchCriteria)
    .select("name email role avatar")
    .limit(50)
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMyTeams,
  getMyProjects,
  getMyTasks,
  searchUsers,
};
