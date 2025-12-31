const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createComment);
router.get("/:entityType/:entityId", getComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
