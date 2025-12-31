const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "PROJECT_MANAGER", "MEMBER", "CLIENT"],
        message: "Role must be ADMIN, PROJECT_MANAGER, MEMBER, or CLIENT",
      },
      default: "MEMBER",
    },
    avatar: {
      type: String, // URL to avatar image
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    timezone: {
      type: String,
      default: "UTC",
    },
    language: {
      type: String,
      default: "en",
    },
    notificationPreferences: {
      email: {
        taskAssigned: { type: Boolean, default: true },
        taskDue: { type: Boolean, default: true },
        taskCompleted: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
      },
      inApp: {
        taskAssigned: { type: Boolean, default: true },
        taskDue: { type: Boolean, default: true },
        taskCompleted: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
