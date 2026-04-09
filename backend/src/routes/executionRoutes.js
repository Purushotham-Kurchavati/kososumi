const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  executeWorkflowController,
  getExecutionController,
  getLogsController
} = require("../controllers/executionController");

const router = express.Router();

router.post("/execute/:workflowId", authMiddleware, executeWorkflowController);
router.get("/executions/:id", authMiddleware, getExecutionController);
router.get("/logs/:executionId", authMiddleware, getLogsController);

module.exports = router;
