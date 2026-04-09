const axios = require("axios");

const tools = [
  {
    type: "function",
    function: {
      name: "http_get",
      description: "Fetch JSON data from a URL via HTTP GET.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" }
        },
        required: ["url"],
        additionalProperties: false
      }
    }
  }
];

async function runTool(toolName, args) {
  if (toolName === "http_get") {
    const { url } = args;
    const response = await axios.get(url, { timeout: 12000 });
    return { status: response.status, data: response.data };
  }

  throw new Error(`Unknown tool: ${toolName}`);
}

module.exports = { tools, runTool };
