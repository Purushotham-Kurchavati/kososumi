const env = require("./config/env");
const { connectDatabase } = require("./config/db");
require("./config/redis");
const { app } = require("./app");

async function boot() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Kososumi backend listening on port ${env.PORT}`);
  });
}

boot().catch((err) => {
  console.error("Server boot failed:", err);
  process.exit(1);
});
