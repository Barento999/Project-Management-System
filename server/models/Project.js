const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["planned", "active", "completed", "on-hold", "cancelled"],
        message:
          "Status must be planned, active, completed, on-hold, or cancelled",
      },
      default: "planned",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "critical"],
        message: "Priority must be low, medium, high, or critical",
      },
      default: "medium",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: String,
        dueDate: Date,
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],
    budget: {
      estimated: {
        type: Number,
        default: 0,
      },
      actual: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    avatar: {
      type: String, // URL to project avatar/image
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
