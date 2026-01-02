const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFile,
  downloadFile,
  updateFile,
  deleteFile,
  getFilesByEntity,
} = require("../controllers/fileController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes require authentication
router.use(protect);

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.get("/entity/:entityType/:entityId", getFilesByEntity);
router.get("/:id", getFile);
router.get("/:id/download", downloadFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

module.exports = router;
