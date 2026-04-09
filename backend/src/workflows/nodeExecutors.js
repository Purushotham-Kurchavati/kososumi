const axios = require("axios");
const { runAgent } = require("../agents/agentService");

function getByPath(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function renderTemplateObject(template, context) {
  if (typeof template !== "object" || template === null) return template;
  const out = {};
  for (const [key, value] of Object.entries(template)) {
    if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
      const path = value.slice(2, -2).trim();
      out[key] = getByPath(context, path);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const nodeExecutors = {
  webhook: async ({ input }) => input,

  http_request: async ({ node, context }) => {
    const method = (node.config.method || "GET").toUpperCase();
    const url = node.config.url;
    const headers = node.config.headers || {};
    const body = renderTemplateObject(node.config.bodyTemplate || {}, context);
    const response = await axios({
      method,
      url,
      headers,
      data: method === "GET" ? undefined : body,
      timeout: 15000
    });
    return { status: response.status, data: response.data };
  },

  ai_agent: async ({ node, input, memory }) => {
    const goal = node.config.goal || "Analyze input and return structured output.";
    return runAgent({ goal, input, memory });
  },

  delay: async ({ node }) => {
    const ms = Number(node.config.ms || 1000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    return { delayedMs: ms };
  },

  condition: async ({ node, context }) => {
    const left = getByPath(context, node.config.leftPath);
    const right = node.config.rightValue;
    const operator = node.config.operator || "eq";

    let pass = false;
    if (operator === "eq") pass = left === right;
    if (operator === "neq") pass = left !== right;
    if (operator === "gt") pass = Number(left) > Number(right);
    if (operator === "lt") pass = Number(left) < Number(right);

    return { pass, left, operator, right };
  }
};

module.exports = { nodeExecutors };
