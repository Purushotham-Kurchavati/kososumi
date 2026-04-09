const Execution = require("../models/Execution");
const Workflow = require("../models/Workflow");
const { executionQueue } = require("../queue/queues");
const { ApiError } = require("../utils/ApiError");

async function enqueueExecution({ workflowId, userId, triggerType, input }) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) throw new ApiError(404, "Workflow not found");
  if (!workflow.isActive) throw new ApiError(400, "Workflow is not active");

  const execution = await Execution.create({
    workflowId,
    userId: userId || null,
    triggerType,
    input,
    status: "queued"
  });

  await executionQueue.add("workflow.execute", {
    workflowId: workflow._id.toString(),
    executionId: execution._id.toString()
  });

  return execution;
}

module.exports = { enqueueExecution };
