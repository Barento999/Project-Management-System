const asyncHandler = require("express-async-handler");
const File = require("../models/File");
const path = require("path");
const fs = require("fs");

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const { entityType, entityId, description, tags } = req.body;

  // Create file record
  const file = await File.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`,
    entityType: entityType || "general",
    entityId: entityId || null,
    entityModel:
      entityType === "task"
        ? "Task"
        : entityType === "project"
        ? "Project"
        : null,
    uploadedBy: req.user._id,
    description: description || "",
    tags: tags ? JSON.parse(tags) : [],
  });

  res.status(201).json({
    success: true,
    file,
  });
});

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
  const { entityType, entityId, search } = req.query;

  let query = {};

  if (entityType) {
    query.entityType = entityType;
  }

  if (entityId) {
    query.entityId = entityId;
  }

  if (search) {
    query.$or = [
      { originalName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const files = await File.find(query)
    .populate("uploadedBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: files.length,
    files,
  });
});

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
const getFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id).populate(
    "uploadedBy",
    "name email avatar"
  );

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  res.status(200).json({
    success: true,
    file,
  });
});

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
const downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // Check if file exists
  if (!fs.existsSync(file.path)) {
    return res.status(404).json({
      success: false,
      message: "File not found on server",
    });
  }

  res.download(file.path, file.originalName);
});

// @desc    Update file
// @route   PUT /api/files/:id
// @access  Private
const updateFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // Check if user is the uploader or admin
  if (
    file.uploadedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this file",
    });
  }

  const { description, tags, isPublic } = req.body;

  if (description !== undefined) file.description = description;
  if (tags !== undefined) file.tags = tags;
  if (isPublic !== undefined) file.isPublic = isPublic;

  await file.save();

  res.status(200).json({
    success: true,
    file,
  });
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // Check if user is the uploader or admin
  if (
    file.uploadedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this file",
    });
  }

  // Delete file from filesystem
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  // Delete file record
  await file.deleteOne();

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});

// @desc    Get files by entity
// @route   GET /api/files/entity/:entityType/:entityId
// @access  Private
const getFilesByEntity = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const files = await File.find({
    entityType,
    entityId,
  })
    .populate("uploadedBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: files.length,
    files,
  });
});

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  downloadFile,
  updateFile,
  deleteFile,
  getFilesByEntity,
};
