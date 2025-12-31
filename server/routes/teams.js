const express = require('express');
const router = express.Router();
const { 
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

// All routes here are protected
router.route('/')
  .post(protect, createTeam)
  .get(protect, getTeams);

router.route('/:id')
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

router.put('/:id/add-member', protect, addMember);
router.put('/:id/remove-member', protect, removeMember);

module.exports = router;