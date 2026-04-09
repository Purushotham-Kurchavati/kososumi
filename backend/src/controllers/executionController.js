const Execution = require("../models/Execution");
const Log = require("../models/Log");
const Workflow = require("../models/Workflow");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { enqueueExecution } = require("../services/executionService");

const executeWorkflowController = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findOne({ _id: req.params.workflowId, userId: req.user._id });
  if (!workflow) throw new ApiError(404, "Workflow not found");

  const execution = await enqueueExecution({
    workflowId: workflow._id.toString(),
    userId: req.user._id.toString(),
    triggerType: "manual",
    input: req.body || {}
  });

  res.status(202).json({
    executionId: execution._id,
    status: execution.status
  });
});

const getExecutionController = asyncHandler(async (req, res) => {
  const execution = await Execution.findById(req.params.id);
  if (!execution) throw new ApiError(404, "Execution not found");
  res.json(execution);
});

const getLogsController = asyncHandler(async (req, res) => {
  const logs = await Log.find({ executionId: req.params.executionId }).sort({ createdAt: 1 });
  res.json(logs);
});

module.exports = {
  executeWorkflowController,
  getExecutionController,
  getLogsController
};
