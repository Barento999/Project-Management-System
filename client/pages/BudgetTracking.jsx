import React, { useState, useEffect } from "react";
import {
  FaDollarSign,
  FaSpinner,
  FaChartPie,
  FaExclamationTriangle,
  FaCheckCircle,
  FaProjectDiagram,
  FaPlus,
  FaEdit,
  FaTrash,
  FaReceipt,
  FaDownload,
} from "react-icons/fa";
import { budgetAPI, projectAPI } from "../services/api";
import { exportToCSV } from "../utils/exportUtils";

const BudgetTracking = () => {
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    totalBudget: "",
    currency: "USD",
    notes: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, projectsRes, summaryRes] = await Promise.all([
        budgetAPI.getAll(),
        projectAPI.getAll(),
        budgetAPI.getSummary(),
      ]);

      setBudgets(budgetsRes.data.budgets);
      setProjects(projectsRes.data.projects);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetAPI.createOrUpdate(selectedProject._id, budgetForm);
      await fetchData();
      setShowBudgetModal(false);
      setBudgetForm({ totalBudget: "", currency: "USD", notes: "" });
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to set budget:", error);
      alert("Failed to set budget");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await budgetAPI.updateExpense(
          selectedProject._id,
          editingExpense._id,
          expenseForm
        );
      } else {
        await budgetAPI.addExpense(selectedProject._id, expenseForm);
      }
      await fetchData();
      setShowExpenseModal(false);
      setExpenseForm({
        description: "",
        amount: "",
        category: "other",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingExpense(null);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to save expense:", error);
      alert("Failed to save expense");
    }
  };

  const handleDeleteExpense = async (projectId, expenseId) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await budgetAPI.deleteExpense(projectId, expenseId);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense");
    }
  };

  const openBudgetModal = (project, budget) => {
    setSelectedProject(project);
    setBudgetForm({
      totalBudget: budget?.totalBudget || "",
      currency: budget?.currency || "USD",
      notes: budget?.notes || "",
    });
    setShowBudgetModal(true);
  };

  const openExpenseModal = (project, expense = null) => {
    setSelectedProject(project);
    if (expense) {
      setEditingExpense(expense);
      setExpenseForm({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split("T")[0],
      });
    }
    setShowExpenseModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "under-budget":
        return "text-green-700 bg-green-100 border-green-300";
      case "on-budget":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "over-budget":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "under-budget":
        return <FaCheckCircle className="text-green-600" />;
      case "on-budget":
        return <FaExclamationTriangle className="text-yellow-600" />;
      case "over-budget":
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      labor: "bg-blue-100 text-blue-700",
      materials: "bg-purple-100 text-purple-700",
      equipment: "bg-orange-100 text-orange-700",
      software: "bg-indigo-100 text-indigo-700",
      travel: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  const exportBudgetData = () => {
    const data = budgets.map((budget) => ({
      Project: budget.project?.name || "N/A",
      "Total Budget": budget.totalBudget,
      "Total Spent": budget.totalSpent,
      Remaining: budget.remaining,
      "% Used": budget.percentageUsed.toFixed(2),
      Status: budget.status,
      Currency: budget.currency,
    }));
    exportToCSV(data, "budget-report");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="text-6xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-4xl text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Budget & Cost Tracking
              </h1>
            </div>
            <button
              onClick={exportBudgetData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaDownload />
              Export Report
            </button>
          </div>
          <p className="text-gray-600">
            Track project budgets, expenses, and financial reports
          </p>
        </div>

        {/* Financial Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <FaDollarSign className="text-3xl text-blue-600" />
                <span className="text-3xl font-bold text-gray-800">
                  {formatCurrency(summary.totalBudget)}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Total Budget</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <FaReceipt className="text-3xl text-red-600" />
                <span className="text-3xl font-bold text-red-600">
                  {formatCurrency(summary.totalSpent)}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Total Spent</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <FaCheckCircle className="text-3xl text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(summary.totalRemaining)}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Remaining</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <FaProjectDiagram className="text-3xl text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  {summary.projectCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Projects</p>
            </div>
          </div>
        )}

        {/* Budget Status Overview */}
        {summary && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Budget Status Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-700">
                  Under Budget
                </span>
                <span className="text-2xl font-bold text-green-700">
                  {summary.underBudgetCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-yellow-700">
                  On Budget (90%+)
                </span>
                <span className="text-2xl font-bold text-yellow-700">
                  {summary.onBudgetCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-red-700">
                  Over Budget
                </span>
                <span className="text-2xl font-bold text-red-700">
                  {summary.overBudgetCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Expenses by Category */}
        {summary && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaChartPie className="text-2xl text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Expenses by Category
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(summary.expensesByCategory).map(
                ([category, amount]) => (
                  <div
                    key={category}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 capitalize mb-1">
                      {category}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Project Budgets */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Project Budgets
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No projects found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => {
                const budget = budgets.find(
                  (b) => b.project?._id === project._id
                );
                const hasBudget = budget && budget.totalBudget > 0;

                return (
                  <div
                    key={project._id}
                    className={`border-2 rounded-xl p-6 ${
                      budget ? getStatusColor(budget.status) : "border-gray-200"
                    }`}>
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {project.name}
                          </h3>
                          {budget && getStatusIcon(budget.status)}
                          {budget && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                budget.status
                              )}`}>
                              {budget.status.replace("-", " ").toUpperCase()}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openBudgetModal(project, budget)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <FaEdit />
                        {hasBudget ? "Edit Budget" : "Set Budget"}
                      </button>
                    </div>

                    {hasBudget ? (
                      <>
                        {/* Budget Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white bg-opacity-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Total Budget
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                              {formatCurrency(
                                budget.totalBudget,
                                budget.currency
                              )}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Spent</p>
                            <p className="text-xl font-bold text-red-600">
                              {formatCurrency(
                                budget.totalSpent,
                                budget.currency
                              )}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Remaining
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {formatCurrency(
                                budget.remaining,
                                budget.currency
                              )}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">% Used</p>
                            <p className="text-xl font-bold text-purple-600">
                              {budget.percentageUsed.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                budget.percentageUsed > 100
                                  ? "bg-red-600"
                                  : budget.percentageUsed >= 90
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  budget.percentageUsed,
                                  100
                                )}%`,
                              }}></div>
                          </div>
                        </div>

                        {/* Expenses */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">
                              Expenses ({budget.expenses?.length || 0})
                            </h4>
                            <button
                              onClick={() => openExpenseModal(project)}
                              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                              <FaPlus />
                              Add Expense
                            </button>
                          </div>

                          {budget.expenses && budget.expenses.length > 0 ? (
                            <div className="space-y-2">
                              {budget.expenses.map((expense) => (
                                <div
                                  key={expense._id}
                                  className="flex items-center justify-between p-3 bg-white bg-opacity-70 rounded-lg border border-gray-200">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-gray-800">
                                        {expense.description}
                                      </p>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                          expense.category
                                        )}`}>
                                        {expense.category}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      {new Date(
                                        expense.date
                                      ).toLocaleDateString()}{" "}
                                      • Added by {expense.addedBy?.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <p className="text-lg font-bold text-gray-800">
                                      {formatCurrency(
                                        expense.amount,
                                        budget.currency
                                      )}
                                    </p>
                                    <button
                                      onClick={() =>
                                        openExpenseModal(project, expense)
                                      }
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteExpense(
                                          project._id,
                                          expense._id
                                        )
                                      }
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 text-center py-4">
                              No expenses recorded yet
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FaDollarSign className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">
                          No budget set for this project
                        </p>
                        <button
                          onClick={() => openBudgetModal(project, null)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Set Budget Now
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {budgetForm.totalBudget ? "Edit" : "Set"} Budget for{" "}
              {selectedProject?.name}
            </h3>
            <form onSubmit={handleSetBudget}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Budget *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={budgetForm.totalBudget}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        totalBudget: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={budgetForm.currency}
                    onChange={(e) =>
                      setBudgetForm({ ...budgetForm, currency: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={budgetForm.notes}
                    onChange={(e) =>
                      setBudgetForm({ ...budgetForm, notes: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Budget notes or details..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowBudgetModal(false);
                    setSelectedProject(null);
                    setBudgetForm({
                      totalBudget: "",
                      currency: "USD",
                      notes: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingExpense ? "Edit" : "Add"} Expense for{" "}
              {selectedProject?.name}
            </h3>
            <form onSubmit={handleAddExpense}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Software license"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="labor">Labor</option>
                    <option value="materials">Materials</option>
                    <option value="equipment">Equipment</option>
                    <option value="software">Software</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setSelectedProject(null);
                    setEditingExpense(null);
                    setExpenseForm({
                      description: "",
                      amount: "",
                      category: "other",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  {editingExpense ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracking;
