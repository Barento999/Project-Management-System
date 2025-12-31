const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "ASSIGN",
        "UNASSIGN",
        "COMMENT",
        "UPLOAD",
        "COMPLETE",
        "REOPEN",
        "ARCHIVE",
        "RESTORE",
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ["User", "Team", "Project", "Task", "Comment", "TimeEntry"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    entityName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed, // Store before/after values
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
