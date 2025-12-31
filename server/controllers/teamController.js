const asyncHandler = require('express-async-handler');
const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide team name'
    });
  }

  // Create team
  const team = await Team.create({
    name,
    description,
    owner: req.user._id
  });

  // Add owner as a member too
  team.members.push(req.user._id);
  await team.save();

  res.status(201).json({
    success: true,
    team
  });
});

// @desc    Get all teams (for admin) or user's teams
// @route   GET /api/teams
// @access  Private
const getTeams = asyncHandler(async (req, res) => {
  let teams;

  if (req.user.role === 'ADMIN') {
    // Admin can see all teams
    teams = await Team.find({})
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
  } else {
    // Regular user can see only their teams
    teams = await Team.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    count: teams.length,
    teams
  });
});

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .populate('projects', 'name status');

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Check if user has access to this team
  if (req.user.role !== 'ADMIN' && 
      team.owner.toString() !== req.user._id.toString() && 
      !team.members.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this team'
    });
  }

  res.status(200).json({
    success: true,
    team
  });
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Only owner or admin can update team
  if (req.user.role !== 'ADMIN' && team.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to update this team'
    });
  }

  team.name = req.body.name || team.name;
  team.description = req.body.description || team.description;
  team.avatar = req.body.avatar || team.avatar;

  const updatedTeam = await team.save();

  res.status(200).json({
    success: true,
    team: updatedTeam
  });
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Only owner or admin can delete team
  if (req.user.role !== 'ADMIN' && team.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to delete this team'
    });
  }

  await team.remove();

  res.status(200).json({
    success: true,
    message: 'Team deleted successfully'
  });
});

// @desc    Add member to team
// @route   PUT /api/teams/:id/add-member
// @access  Private
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Only owner or admin can add members
  if (req.user.role !== 'ADMIN' && team.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to add members to this team'
    });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if user is already a member
  if (team.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: 'User is already a member of this team'
    });
  }

  team.members.push(userId);
  await team.save();

  res.status(200).json({
    success: true,
    message: 'Member added successfully',
    team
  });
});

// @desc    Remove member from team
// @route   PUT /api/teams/:id/remove-member
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Only owner or admin can remove members
  if (req.user.role !== 'ADMIN' && team.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to remove members from this team'
    });
  }

  // Cannot remove the owner from the team
  if (userId === team.owner.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot remove owner from the team'
    });
  }

  // Check if user is a member
  if (!team.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: 'User is not a member of this team'
    });
  }

  team.members = team.members.filter(member => member.toString() !== userId);
  await team.save();

  res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    team
  });
});

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
};