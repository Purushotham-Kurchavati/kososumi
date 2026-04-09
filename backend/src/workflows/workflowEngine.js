const Execution = require("../models/Execution");
const Log = require("../models/Log");
const Workflow = require("../models/Workflow");
const { nodeExecutors } = require("./nodeExecutors");

function getOutgoingEdges(workflow, nodeId) {
  return workflow.edges.filter((edge) => edge.from === nodeId);
}

function pickNextNodeId(workflow, node, output) {
  const outgoing = getOutgoingEdges(workflow, node.id);
  if (outgoing.length === 0) return null;

  if (node.type === "condition") {
    const target = outgoing.find((edge) => edge.label === (output.pass ? "true" : "false"));
    return target ? target.to : null;
  }

  return outgoing[0].to;
}

async function addLog({ executionId, workflowId, nodeId, level = "info", message, data = null }) {
  await Log.create({ executionId, workflowId, nodeId, level, message, data });
}

async function runWorkflowExecution({ workflowId, executionId }) {
  const [workflow, execution] = await Promise.all([
    Workflow.findById(workflowId),
    Execution.findById(executionId)
  ]);

  if (!workflow || !execution) throw new Error("Workflow or execution not found");

  execution.status = "running";
  execution.startedAt = new Date();
  execution.attempts += 1;
  await execution.save();

  const context = { trigger: execution.input };
  const memory = [...execution.memory];

  const webhookNode = workflow.nodes.find((n) => n.type === "webhook");
  let currentNode = webhookNode || workflow.nodes[0];

  while (currentNode) {
    const executor = nodeExecutors[currentNode.type];
    if (!executor) throw new Error(`Unsupported node type: ${currentNode.type}`);

    await addLog({
      executionId: execution._id,
      workflowId: workflow._id,
      nodeId: currentNode.id,
      message: `Executing node ${currentNode.name} (${currentNode.type})`
    });

    const input = Object.keys(context).length ? context : execution.input;
    const output = await executor({ node: currentNode, input, context, memory });
    context[currentNode.id] = output;

    if (currentNode.type === "ai_agent") {
      memory.push({
        nodeId: currentNode.id,
        output,
        at: new Date().toISOString()
      });
    }

    await addLog({
      executionId: execution._id,
      workflowId: workflow._id,
      nodeId: currentNode.id,
      message: "Node execution completed",
      data: output
    });

    const nextNodeId = pickNextNodeId(workflow, currentNode, output);
    currentNode = nextNodeId ? workflow.nodes.find((n) => n.id === nextNodeId) : null;
  }

  execution.status = "success";
  execution.output = context;
  execution.memory = memory;
  execution.finishedAt = new Date();
  await execution.save();

  return execution;
}

module.exports = { runWorkflowExecution };
