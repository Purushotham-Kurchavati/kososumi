const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["webhook", "http_request", "ai_agent", "delay", "condition"],
      required: true
    },
    name: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const edgeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    label: { type: String, enum: ["true", "false"], default: null }
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workflow", workflowSchema);
