const express = require("express");
const router = express.Router();
const {
  startTimer,
  stopTimer,
  createManualEntry,
  getTimeEntries,
  getRunningTimer,
  updateTimeEntry,
  deleteTimeEntry,
  getTimesheet,
} = require("../controllers/timeTrackingController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/start", startTimer);
router.post("/manual", createManualEntry);
router.get("/", getTimeEntries);
router.get("/running", getRunningTimer);
router.get("/timesheet", getTimesheet);
router.put("/:id/stop", stopTimer);
router.put("/:id", updateTimeEntry);
router.delete("/:id", deleteTimeEntry);

module.exports = router;
