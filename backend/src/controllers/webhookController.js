const { asyncHandler } = require("../utils/asyncHandler");
const Workflow = require("../models/Workflow");
const { ApiError } = require("../utils/ApiError");
const { enqueueExecution } = require("../services/executionService");

const webhookTriggerController = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.workflowId);
  if (!workflow) throw new ApiError(404, "Workflow not found");

  const hasWebhookNode = workflow.nodes.some((node) => node.type === "webhook");
  if (!hasWebhookNode) throw new ApiError(400, "Workflow has no webhook trigger node");

  const execution = await enqueueExecution({
    workflowId: workflow._id.toString(),
    userId: null,
    triggerType: "webhook",
    input: req.body || {}
  });

  res.status(202).json({
    message: "Webhook accepted",
    executionId: execution._id
  });
});

module.exports = { webhookTriggerController };
