const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // Duration in minutes
      default: 0,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
    isBillable: {
      type: Boolean,
      default: true,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate duration before saving
timeEntrySchema.pre("save", function (next) {
  if (this.startTime && this.endTime && !this.isRunning) {
    this.duration = Math.round((this.endTime - this.startTime) / 60000); // Convert to minutes
  }
  next();
});

// Index for faster queries
timeEntrySchema.index({ user: 1, task: 1 });
timeEntrySchema.index({ project: 1 });
timeEntrySchema.index({ startTime: -1 });

module.exports = mongoose.model("TimeEntry", timeEntrySchema);
