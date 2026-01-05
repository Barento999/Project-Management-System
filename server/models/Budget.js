const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["labor", "materials", "equipment", "software", "travel", "other"],
    default: "other",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receipt: {
    type: String, // File path or URL
  },
});

const budgetSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    expenses: [expenseSchema],
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["under-budget", "on-budget", "over-budget"],
      default: "under-budget",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total spent
budgetSchema.virtual("totalSpent").get(function () {
  return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
});

// Virtual for remaining budget
budgetSchema.virtual("remaining").get(function () {
  return this.totalBudget - this.totalSpent;
});

// Virtual for percentage used
budgetSchema.virtual("percentageUsed").get(function () {
  if (this.totalBudget === 0) return 0;
  return (this.totalSpent / this.totalBudget) * 100;
});

// Ensure virtuals are included in JSON
budgetSchema.set("toJSON", { virtuals: true });
budgetSchema.set("toObject", { virtuals: true });

// Update status before saving
budgetSchema.pre("save", function (next) {
  const percentageUsed = this.percentageUsed;
  if (percentageUsed > 100) {
    this.status = "over-budget";
  } else if (percentageUsed >= 90) {
    this.status = "on-budget";
  } else {
    this.status = "under-budget";
  }
  next();
});

module.exports = mongoose.model("Budget", budgetSchema);
