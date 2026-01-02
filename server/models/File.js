const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["task", "project", "comment", "general"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      enum: ["Task", "Project", "Comment", "User"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
fileSchema.index({ entityType: 1, entityId: 1 });
fileSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model("File", fileSchema);
