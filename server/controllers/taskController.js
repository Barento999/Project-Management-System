const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate, priority, tags } =
    req.body;

  // Validation
  if (!title || !projectId) {
    return res.status(400).json({
      success: false,
      message: "Please provide task title and project ID",
    });
  }

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check if user has access to this project (owner, member, or admin)
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isProjectMember = project.members.includes(req.user._id);
  const isTeamMember = false; // We'll check team access separately if needed

  if (
    req.user.role !== "ADMIN" &&
    !isProjectOwner &&
    !isProjectMember &&
    !isTeamMember
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this project",
    });
  }

  // Check if assigned user exists (if provided)
  let assignedUser = null;
  if (assignedTo) {
    assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
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
    tags,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

// @desc    Get all tasks (for admin) or user's tasks
// @route   GET /api/tasks
// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority } = req.query;

  let baseQuery = {};

  // Build base query based on user role
  if (req.user.role === "ADMIN") {
    // Admin can see all tasks
    baseQuery = {};
  } else {
    // Regular user can see tasks assigned to them or tasks in projects they're part of
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select("_id");

    baseQuery = {
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
        { project: { $in: userProjects.map((p) => p._id) } },
      ],
    };
  }

  // Add search filter
  if (search) {
    baseQuery.$and = baseQuery.$and || [];
    baseQuery.$and.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
  }

  // Add status filter
  if (status && status !== "all") {
    baseQuery.status = status;
  }

  // Add priority filter
  if (priority && priority !== "all") {
    baseQuery.priority = priority;
  }

  const tasks = await Task.find(baseQuery)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("project", "name description")
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check if user has access to this task
  const project = await Project.findById(task.project);
  const isAssigned =
    task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner =
    project && project.owner.toString() === req.user._id.toString();
  const isProjectMember = project && project.members.includes(req.user._id);

  if (
    req.user.role !== "ADMIN" &&
    !isAssigned &&
    !isCreator &&
    !isProjectOwner &&
    !isProjectMember
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this task",
    });
  }

  res.status(200).json({
    success: true,
    task,
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
      message: "Task not found",
    });
  }

  // Check if user has permission to update (assigned user, creator, project owner, or admin)
  const project = await Project.findById(task.project);
  const isAssigned =
    task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner =
    project && project.owner.toString() === req.user._id.toString();
  const isProjectMember = project && project.members.includes(req.user._id);

  if (
    req.user.role !== "ADMIN" &&
    !isAssigned &&
    !isCreator &&
    !isProjectOwner &&
    !isProjectMember
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied to update this task",
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
          message: "Assigned user not found",
        });
      }
      task.assignedTo = req.body.assignedTo;
    } else {
      task.assignedTo = null; // Unassign
    }
  }

  // Update completedAt if status changes to 'done'
  if (req.body.status === "done" && task.status !== "done") {
    task.completedAt = Date.now();
  } else if (req.body.status !== "done" && task.status === "done") {
    task.completedAt = null; // Reset if task is moved back from done
  }

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    task: updatedTask,
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
      message: "Task not found",
    });
  }

  // Check if user has permission to delete (creator, project owner, or admin)
  const project = await Project.findById(task.project);
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectOwner =
    project && project.owner.toString() === req.user._id.toString();

  if (req.user.role !== "ADMIN" && !isCreator && !isProjectOwner) {
    return res.status(403).json({
      success: false,
      message: "Access denied to delete this task",
    });
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
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
      message: "Project not found",
    });
  }

  // Check if user has access to this project
  const isProjectOwner = project.owner.toString() === req.user._id.toString();
  const isProjectMember = project.members.includes(req.user._id);

  if (req.user.role !== "ADMIN" && !isProjectOwner && !isProjectMember) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this project",
    });
  }

  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  // Validate status
  const validStatuses = ["todo", "in-progress", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Valid statuses are: todo, in-progress, done",
    });
  }

  // Find tasks by status for projects the user has access to
  const accessibleProjects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  }).select("_id");

  const projectIds = accessibleProjects.map((project) => project._id);

  const tasks = await Task.find({
    status,
    project: { $in: projectIds },
  })
    .populate("project", "name")
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// @desc    Add dependency to task
// @route   POST /api/tasks/:id/dependencies
// @access  Private
const addDependency = asyncHandler(async (req, res) => {
  const { dependencyId } = req.body;

  if (!dependencyId) {
    return res.status(400).json({
      success: false,
      message: "Please provide dependency task ID",
    });
  }

  const task = await Task.findById(req.params.id);
  const dependencyTask = await Task.findById(dependencyId);

  if (!task || !dependencyTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check for circular dependency
  if (dependencyTask.dependencies.includes(task._id)) {
    return res.status(400).json({
      success: false,
      message: "Circular dependency detected",
    });
  }

  // Check if dependency already exists
  if (task.dependencies.includes(dependencyId)) {
    return res.status(400).json({
      success: false,
      message: "Dependency already exists",
    });
  }

  task.dependencies.push(dependencyId);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("dependencies", "title status priority dueDate")
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Dependency added successfully",
    task: updatedTask,
  });
});

// @desc    Remove dependency from task
// @route   DELETE /api/tasks/:id/dependencies/:dependencyId
// @access  Private
const removeDependency = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.dependencies = task.dependencies.filter(
    (dep) => dep.toString() !== req.params.dependencyId
  );
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("dependencies", "title status priority dueDate")
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Dependency removed successfully",
    task: updatedTask,
  });
});

// @desc    Get task dependencies
// @route   GET /api/tasks/:id/dependencies
// @access  Private
const getTaskDependencies = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate({
    path: "dependencies",
    select: "title status priority dueDate project assignedTo",
    populate: [
      { path: "project", select: "name" },
      { path: "assignedTo", select: "name email" },
    ],
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    dependencies: task.dependencies,
  });
});

// @desc    Get tasks that depend on this task
// @route   GET /api/tasks/:id/dependents
// @access  Private
const getTaskDependents = asyncHandler(async (req, res) => {
  const dependents = await Task.find({
    dependencies: req.params.id,
  })
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    dependents,
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus,
  addDependency,
  removeDependency,
  getTaskDependencies,
  getTaskDependents,
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const addSubtask = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Please provide subtask title",
    });
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.subtasks.push({ title, isCompleted: false });
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Subtask added successfully",
    task: updatedTask,
  });
});

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const updateSubtask = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const subtask = task.subtasks.id(req.params.subtaskId);

  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: "Subtask not found",
    });
  }

  if (title !== undefined) subtask.title = title;
  if (isCompleted !== undefined) {
    subtask.isCompleted = isCompleted;
    subtask.completedAt = isCompleted ? new Date() : null;
  }

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Subtask updated successfully",
    task: updatedTask,
  });
});

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const deleteSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.subtasks.pull(req.params.subtaskId);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Subtask deleted successfully",
    task: updatedTask,
  });
});

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId/toggle
// @access  Private
const toggleSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const subtask = task.subtasks.id(req.params.subtaskId);

  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: "Subtask not found",
    });
  }

  subtask.isCompleted = !subtask.isCompleted;
  subtask.completedAt = subtask.isCompleted ? new Date() : null;

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: "Subtask toggled successfully",
    task: updatedTask,
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus,
  addDependency,
  removeDependency,
  getTaskDependencies,
  getTaskDependents,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
};
