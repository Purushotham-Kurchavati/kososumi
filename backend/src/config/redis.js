const IORedis = require("ioredis");
const env = require("./env");

const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null
});

connection.on("connect", () => console.log("Redis connected"));
connection.on("error", (err) => console.error("Redis error:", err.message));

module.exports = { connection };
