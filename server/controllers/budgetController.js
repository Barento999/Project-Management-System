const Budget = require("../models/Budget");
const Project = require("../models/Project");

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find()
      .populate("project", "name status")
      .populate("expenses.addedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      budgets,
    });
  } catch (error) {
    console.error("Get all budgets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch budgets",
      error: error.message,
    });
  }
};

// Get budget by project ID
exports.getBudgetByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    let budget = await Budget.findOne({ project: projectId })
      .populate("project", "name status owner")
      .populate("expenses.addedBy", "name email");

    // If no budget exists, create a default one
    if (!budget) {
      budget = await Budget.create({
        project: projectId,
        totalBudget: 0,
        expenses: [],
      });
      await budget.populate("project", "name status owner");
    }

    res.json({
      success: true,
      budget,
    });
  } catch (error) {
    console.error("Get budget by project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch budget",
      error: error.message,
    });
  }
};

// Create or update budget
exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { totalBudget, currency, notes } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let budget = await Budget.findOne({ project: projectId });

    if (budget) {
      // Update existing budget
      budget.totalBudget = totalBudget || budget.totalBudget;
      budget.currency = currency || budget.currency;
      budget.notes = notes !== undefined ? notes : budget.notes;
      await budget.save();
    } else {
      // Create new budget
      budget = await Budget.create({
        project: projectId,
        totalBudget: totalBudget || 0,
        currency: currency || "USD",
        notes,
      });
    }

    await budget.populate("project", "name status owner");
    await budget.populate("expenses.addedBy", "name email");

    res.json({
      success: true,
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error("Create/update budget error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save budget",
      error: error.message,
    });
  }
};

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description, amount, category, date, receipt } = req.body;

    let budget = await Budget.findOne({ project: projectId });

    if (!budget) {
      // Create budget if it doesn't exist
      budget = await Budget.create({
        project: projectId,
        totalBudget: 0,
        expenses: [],
      });
    }

    const expense = {
      description,
      amount: parseFloat(amount),
      category: category || "other",
      date: date || new Date(),
      addedBy: req.user._id,
      receipt,
    };

    budget.expenses.push(expense);
    await budget.save();

    await budget.populate("project", "name status owner");
    await budget.populate("expenses.addedBy", "name email");

    res.json({
      success: true,
      message: "Expense added successfully",
      budget,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add expense",
      error: error.message,
    });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { projectId, expenseId } = req.params;
    const { description, amount, category, date, receipt } = req.body;

    const budget = await Budget.findOne({ project: projectId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const expense = budget.expenses.id(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (description) expense.description = description;
    if (amount) expense.amount = parseFloat(amount);
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (receipt !== undefined) expense.receipt = receipt;

    await budget.save();

    await budget.populate("project", "name status owner");
    await budget.populate("expenses.addedBy", "name email");

    res.json({
      success: true,
      message: "Expense updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { projectId, expenseId } = req.params;

    const budget = await Budget.findOne({ project: projectId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    budget.expenses.pull(expenseId);
    await budget.save();

    await budget.populate("project", "name status owner");
    await budget.populate("expenses.addedBy", "name email");

    res.json({
      success: true,
      message: "Expense deleted successfully",
      budget,
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};

// Get financial summary
exports.getFinancialSummary = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("project", "name status");

    const summary = {
      totalBudget: 0,
      totalSpent: 0,
      totalRemaining: 0,
      projectCount: budgets.length,
      overBudgetCount: 0,
      underBudgetCount: 0,
      onBudgetCount: 0,
      expensesByCategory: {
        labor: 0,
        materials: 0,
        equipment: 0,
        software: 0,
        travel: 0,
        other: 0,
      },
    };

    budgets.forEach((budget) => {
      summary.totalBudget += budget.totalBudget;
      summary.totalSpent += budget.totalSpent;
      summary.totalRemaining += budget.remaining;

      if (budget.status === "over-budget") summary.overBudgetCount++;
      else if (budget.status === "on-budget") summary.onBudgetCount++;
      else summary.underBudgetCount++;

      budget.expenses.forEach((expense) => {
        summary.expensesByCategory[expense.category] += expense.amount;
      });
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Get financial summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial summary",
      error: error.message,
    });
  }
};
