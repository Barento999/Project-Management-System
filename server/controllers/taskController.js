const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate, priority, tags } = req.body;

  // Validation
  if (!title || !projectId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide task title and project ID'
    });
  }

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has access to this project (owner, member, or admin)
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isProjectMember = project.members.includes(req.user._id);
  const isTeamMember = false; // We'll check team access separately if needed
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isProjectMember && !isTeamMember) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this project'
    });
  }

  // Check if assigned user exists (if provided)
  let assignedUser = null;
  if (assignedTo) {
    assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found'
      });
    }
  }

  // Create task
  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    dueDate,
    priority,
    tags
  });

  res.status(201).json({
    success: true,
    task
  });
});

// @desc    Get all tasks (for admin) or user's tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let tasks;

  if (req.user.role === 'ADMIN') {
    // Admin can see all tasks
    tasks = await Task.find({})
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  } else {
    // Regular user can see tasks assigned to them or tasks in projects they're part of
    tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
        { project: { $in: await Project.find({ 
          $or: [
            { owner: req.user._id },
            { members: req.user._id }
          ]
        }).select('_id') } }
      ]
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name description')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check if user has access to this task
  const project = await Project.findById(task.project);
  const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner = project && project.owner.toString() === req.user._id.toString();
  const isProjectMember = project && project.members.includes(req.user._id);
  
  if (req.user.role !== 'ADMIN' && !isAssigned && !isCreator && !isProjectOwner && !isProjectMember) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this task'
    });
  }

  res.status(200).json({
    success: true,
    task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check if user has permission to update (assigned user, creator, project owner, or admin)
  const project = await Project.findById(task.project);
  const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner = project && project.owner.toString() === req.user._id.toString();
  const isProjectMember = project && project.members.includes(req.user._id);
  
  if (req.user.role !== 'ADMIN' && !isAssigned && !isCreator && !isProjectOwner && !isProjectMember) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to update this task'
    });
  }

  // Update allowed fields
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status !== undefined ? req.body.status : task.status;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.tags = req.body.tags || task.tags;

  // If reassigning, check if new user exists
  if (req.body.assignedTo !== undefined) {
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found'
        });
      }
      task.assignedTo = req.body.assignedTo;
    } else {
      task.assignedTo = null; // Unassign
    }
  }

  // Update completedAt if status changes to 'done'
  if (req.body.status === 'done' && task.status !== 'done') {
    task.completedAt = Date.now();
  } else if (req.body.status !== 'done' && task.status === 'done') {
    task.completedAt = null; // Reset if task is moved back from done
  }

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    task: updatedTask
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check if user has permission to delete (creator, project owner, or admin)
  const project = await Project.findById(task.project);
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner = project && project.owner.toString() === req.user._id.toString();
  
  if (req.user.role !== 'ADMIN' && !isCreator && !isProjectOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to delete this task'
    });
  }

  await task.remove();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has access to this project
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isProjectMember = project.members.includes(req.user._id);
  
  if (req.user.role !== 'ADMIN' && !isProjectOwner && !isProjectMember) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this project'
    });
  }

  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  // Validate status
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Valid statuses are: todo, in-progress, done'
    });
  }

  // Find tasks by status for projects the user has access to
  const accessibleProjects = await Project.find({
    $or: [
      { owner: req.user._id },
      { members: req.user._id }
    ]
  }).select('_id');

  const projectIds = accessibleProjects.map(project => project._id);

  const tasks = await Task.find({
    status,
    project: { $in: projectIds }
  })
    .populate('project', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus
};