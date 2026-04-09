const { Queue } = require("bullmq");
const env = require("../config/env");
const { connection } = require("../config/redis");

const executionQueue = new Queue("workflow-executions", {
  connection,
  defaultJobOptions: {
    attempts: env.WORKFLOW_MAX_RETRIES + 1,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 1000
  }
});

module.exports = { executionQueue };
