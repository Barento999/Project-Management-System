const express = require("express");
const router = express.Router();
const {
  getActivityLogs,
  getEntityActivityLogs,
} = require("../controllers/activityLogController");
const { protect, admin } = require("../middleware/auth");

router.use(protect);

router.get("/", getActivityLogs);
router.get("/:entityType/:entityId", getEntityActivityLogs);

module.exports = router;
