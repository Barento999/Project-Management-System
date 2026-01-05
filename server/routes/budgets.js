const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Get all budgets
router.get("/", budgetController.getAllBudgets);

// Get financial summary
router.get("/summary", budgetController.getFinancialSummary);

// Get budget by project ID
router.get("/project/:projectId", budgetController.getBudgetByProject);

// Create or update budget
router.post("/project/:projectId", budgetController.createOrUpdateBudget);
router.put("/project/:projectId", budgetController.createOrUpdateBudget);

// Add expense
router.post("/project/:projectId/expenses", budgetController.addExpense);

// Update expense
router.put(
  "/project/:projectId/expenses/:expenseId",
  budgetController.updateExpense
);

// Delete expense
router.delete(
  "/project/:projectId/expenses/:expenseId",
  budgetController.deleteExpense
);

module.exports = router;
