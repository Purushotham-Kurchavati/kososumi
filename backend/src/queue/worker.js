const { Worker } = require("bullmq");
const { connectDatabase } = require("../config/db");
const { connection } = require("../config/redis");
const Execution = require("../models/Execution");
const Log = require("../models/Log");
const { runWorkflowExecution } = require("../workflows/workflowEngine");

async function bootWorker() {
  await connectDatabase();

  const worker = new Worker(
    "workflow-executions",
    async (job) => {
      const { workflowId, executionId } = job.data;
      try {
        await runWorkflowExecution({ workflowId, executionId });
      } catch (err) {
        await Execution.findByIdAndUpdate(executionId, {
          status: "failed",
          error: err.message,
          finishedAt: new Date()
        });
        await Log.create({
          executionId,
          workflowId,
          level: "error",
          message: "Execution failed",
          data: { error: err.message }
        });
        throw err;
      }
    },
    { connection }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err.message);
  });

  console.log("Workflow worker started");
}

bootWorker().catch((err) => {
  console.error("Worker boot failed:", err);
  process.exit(1);
});
