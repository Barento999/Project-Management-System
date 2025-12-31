const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, teamId } = req.body;

  // Validation
  if (!name || !teamId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide project name and team ID'
    });
  }

  // Check if team exists and user has access
  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  // Check if user has access to this team (owner or member)
  if (req.user.role !== 'ADMIN' && 
      team.owner.toString() !== req.user._id.toString() && 
      !team.members.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this team'
    });
  }

  // Create project
  const project = await Project.create({
    name,
    description,
    team: teamId,
    owner: req.user._id
  });

  // Add project to team
  team.projects.push(project._id);
  await team.save();

  res.status(201).json({
    success: true,
    project
  });
});

// @desc    Get all projects (for admin) or user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;

  if (req.user.role === 'ADMIN') {
    // Admin can see all projects
    projects = await Project.find({})
      .populate('team', 'name')
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
  } else {
    // Regular user can see only their projects
    projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('team', 'name')
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    count: projects.length,
    projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('team', 'name description owner members')
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has access to this project
  if (req.user.role !== 'ADMIN' && 
      project.owner.toString() !== req.user._id.toString() && 
      !project.members.includes(req.user._id) &&
      !project.team.members.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this project'
    });
  }

  res.status(200).json({
    success: true,
    project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to update (owner, team owner, or admin)
  const team = await Team.findById(project.team);
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isTeamOwner = team && team.owner.toString() === req.user._id.toString();
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isTeamOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to update this project'
    });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.status = req.body.status || project.status;
  project.startDate = req.body.startDate || project.startDate;
  project.endDate = req.body.endDate || project.endDate;
  project.avatar = req.body.avatar || project.avatar;

  const updatedProject = await project.save();

  res.status(200).json({
    success: true,
    project: updatedProject
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to delete (owner, team owner, or admin)
  const team = await Team.findById(project.team);
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isTeamOwner = team && team.owner.toString() === req.user._id.toString();
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isTeamOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to delete this project'
    });
  }

  await project.remove();

  // Remove project from team
  if (team) {
    team.projects = team.projects.filter(proj => proj.toString() !== project._id.toString());
    await team.save();
  }

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// @desc    Add member to project
// @route   PUT /api/projects/:id/add-member
// @access  Private
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to add members (owner, team owner, or admin)
  const team = await Team.findById(project.team);
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isTeamOwner = team && team.owner.toString() === req.user._id.toString();
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isTeamOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to add members to this project'
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
  if (project.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: 'User is already a member of this project'
    });
  }

  project.members.push(userId);
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Member added successfully',
    project
  });
});

// @desc    Remove member from project
// @route   PUT /api/projects/:id/remove-member
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to remove members (owner, team owner, or admin)
  const team = await Team.findById(project.team);
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isTeamOwner = team && team.owner.toString() === req.user._id.toString();
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isTeamOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to remove members from this project'
    });
  }

  // Cannot remove the owner from the project
  if (userId === project.owner.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot remove owner from the project'
    });
  }

  // Check if user is a member
  if (!project.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: 'User is not a member of this project'
    });
  }

  project.members = project.members.filter(member => member.toString() !== userId);
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    project
  });
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};