const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  createWorkflowController,
  listWorkflowsController,
  getWorkflowController,
  updateWorkflowController,
  deleteWorkflowController
} = require("../controllers/workflowController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", createWorkflowController);
router.get("/", listWorkflowsController);
router.get("/:id", getWorkflowController);
router.put("/:id", updateWorkflowController);
router.delete("/:id", deleteWorkflowController);

module.exports = router;
