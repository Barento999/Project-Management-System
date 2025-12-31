const express = require('express');
const router = express.Router();
const { 
  getAdminStats,
  getAllUsers,
  getAllTeams,
  getAllProjects,
  getAllTasks,
  updateUser,
  deleteUser,
  getRecentActivity
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes here require admin access
router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/teams', protect, admin, getAllTeams);
router.get('/projects', protect, admin, getAllProjects);
router.get('/tasks', protect, admin, getAllTasks);
router.get('/activity', protect, admin, getRecentActivity);

router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;