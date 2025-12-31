const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  getMyTeams,
  getMyProjects,
  getMyTasks
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Routes that require authentication
router.get('/my-teams', protect, getMyTeams);
router.get('/my-projects', protect, getMyProjects);
router.get('/my-tasks', protect, getMyTasks);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;