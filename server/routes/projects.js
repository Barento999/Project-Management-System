const express = require('express');
const router = express.Router();
const { 
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// All routes here are protected
router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.put('/:id/add-member', protect, addMember);
router.put('/:id/remove-member', protect, removeMember);

module.exports = router;