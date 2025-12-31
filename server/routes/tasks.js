const express = require('express');
const router = express.Router();
const { 
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes here are protected
router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.get('/project/:projectId', protect, getTasksByProject);
router.get('/status/:status', protect, getTasksByStatus);

module.exports = router;