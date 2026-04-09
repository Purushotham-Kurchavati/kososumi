const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Execution",
      required: true,
      index: true
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
      index: true
    },
    nodeId: { type: String, required: false },
    level: { type: String, enum: ["info", "warn", "error"], default: "info" },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
