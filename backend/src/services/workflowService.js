const Workflow = require("../models/Workflow");
const { ApiError } = require("../utils/ApiError");

function assertValidGraph(nodes, edges) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new ApiError(400, `Invalid edge (${edge.from} -> ${edge.to})`);
    }
  }
}

async function createWorkflow(userId, payload) {
  assertValidGraph(payload.nodes || [], payload.edges || []);
  return Workflow.create({
    userId,
    name: payload.name,
    description: payload.description || "",
    nodes: payload.nodes || [],
    edges: payload.edges || [],
    isActive: payload.isActive ?? true
  });
}

module.exports = { createWorkflow };
