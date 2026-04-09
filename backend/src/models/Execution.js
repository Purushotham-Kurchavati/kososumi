const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema(
  {
    workflowId: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
    triggerType: { type: String, enum: ["manual", "webhook"], required: true },
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, default: {} },
    memory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    status: {
      type: String,
      enum: ["queued", "running", "success", "failed"],
      default: "queued",
      index: true
    },
    attempts: { type: Number, default: 0 },
    error: { type: String, default: null },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Execution", executionSchema);
