const OpenAI = require("openai");
const env = require("../config/env");
const { tools, runTool } = require("./toolRegistry");

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function safeJson(input) {
  try {
    return JSON.parse(input);
  } catch (_err) {
    return { raw: input };
  }
}

async function runAgent({ goal, input, memory = [] }) {
  if (!client) {
    return {
      summary: "OpenAI key missing; returning mocked agent output.",
      priority: "low",
      shouldNotify: false,
      originalInput: input
    };
  }

  const system =
    "You are Kososumi AI agent. Return strict JSON only. Be concise and deterministic.";
  const user = JSON.stringify({ goal, input, memory });

  let response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    tools
  });

  const toolCalls = response.output
    .flatMap((item) => item.type === "tool_call" ? [item] : [])
    .filter(Boolean);

  if (toolCalls.length > 0) {
    const toolOutputs = [];
    for (const call of toolCalls) {
      const args = safeJson(call.arguments || "{}");
      const result = await runTool(call.name, args);
      toolOutputs.push({
        type: "tool_output",
        call_id: call.call_id,
        output: JSON.stringify(result)
      });
    }

    response = await client.responses.create({
      model: env.OPENAI_MODEL,
      previous_response_id: response.id,
      input: toolOutputs
    });
  }

  return safeJson(response.output_text || "{}");
}

module.exports = { runAgent };
