const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus,
  addDependency,
  removeDependency,
  getTaskDependencies,
  getTaskDependents,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

// All routes here are protected
router.route("/").post(protect, createTask).get(protect, getTasks);

router
  .route("/:id")
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.get("/project/:projectId", protect, getTasksByProject);
router.get("/status/:status", protect, getTasksByStatus);

// Dependency routes
router.post("/:id/dependencies", protect, addDependency);
router.delete("/:id/dependencies/:dependencyId", protect, removeDependency);
router.get("/:id/dependencies", protect, getTaskDependencies);
router.get("/:id/dependents", protect, getTaskDependents);

// Subtask routes
router.post("/:id/subtasks", protect, addSubtask);
router.put("/:id/subtasks/:subtaskId", protect, updateSubtask);
router.delete("/:id/subtasks/:subtaskId", protect, deleteSubtask);
router.patch("/:id/subtasks/:subtaskId/toggle", protect, toggleSubtask);

module.exports = router;
