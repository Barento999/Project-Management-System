const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { content, entityType, entityId, mentions } = req.body;

  if (!content || !entityType || !entityId) {
    return res.status(400).json({
      success: false,
      message: "Please provide content, entityType, and entityId",
    });
  }

  // Verify entity exists and user has access
  let entity;
  if (entityType === "Task") {
    entity = await Task.findById(entityId).populate("project");
    if (!entity) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
  } else if (entityType === "Project") {
    entity = await Project.findById(entityId);
    if (!entity) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    entityType,
    entityId,
    mentions: mentions || [],
  });

  await comment.populate("author", "name email avatar");

  // Create notifications for mentions
  if (mentions && mentions.length > 0) {
    const notificationPromises = mentions.map((userId) =>
      Notification.create({
        recipient: userId,
        sender: req.user._id,
        type: "MENTION",
        title: "You were mentioned",
        message: `${req.user.name} mentioned you in a comment`,
        entityType,
        entityId,
      })
    );
    await Promise.all(notificationPromises);
  }

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: "COMMENT",
    entityType,
    entityId,
    entityName: entity.title || entity.name,
    description: `Added a comment`,
  });

  res.status(201).json({
    success: true,
    comment,
  });
});

// @desc    Get comments for an entity
// @route   GET /api/comments/:entityType/:entityId
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const comments = await Comment.find({ entityType, entityId })
    .populate("author", "name email avatar")
    .populate("mentions", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    comments,
  });
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Only author can update
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  comment.content = req.body.content || comment.content;
  comment.isEdited = true;
  comment.editedAt = Date.now();

  await comment.save();

  res.status(200).json({
    success: true,
    comment,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Only author or admin can delete
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
