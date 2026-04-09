const { z } = require("zod");
const Workflow = require("../models/Workflow");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { createWorkflow } = require("../services/workflowService");

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["webhook", "http_request", "ai_agent", "delay", "condition"]),
  name: z.string().min(1),
  config: z.record(z.any()).optional()
});

const edgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.enum(["true", "false"]).optional()
});

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(nodeSchema).min(1),
  edges: z.array(edgeSchema).default([]),
  isActive: z.boolean().optional()
});

const createWorkflowController = asyncHandler(async (req, res) => {
  const payload = workflowSchema.parse(req.body);
  const workflow = await createWorkflow(req.user._id, payload);
  res.status(201).json(workflow);
});

const listWorkflowsController = asyncHandler(async (req, res) => {
  const workflows = await Workflow.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json(workflows);
});

const getWorkflowController = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findOne({ _id: req.params.id, userId: req.user._id });
  if (!workflow) throw new ApiError(404, "Workflow not found");
  res.json(workflow);
});

const updateWorkflowController = asyncHandler(async (req, res) => {
  const payload = workflowSchema.partial().parse(req.body);
  const workflow = await Workflow.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    payload,
    { new: true }
  );
  if (!workflow) throw new ApiError(404, "Workflow not found");
  res.json(workflow);
});

const deleteWorkflowController = asyncHandler(async (req, res) => {
  const deleted = await Workflow.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) throw new ApiError(404, "Workflow not found");
  res.status(204).send();
});

module.exports = {
  createWorkflowController,
  listWorkflowsController,
  getWorkflowController,
  updateWorkflowController,
  deleteWorkflowController
};
