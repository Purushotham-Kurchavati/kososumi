const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { apiRateLimiter } = require("./middleware/rateLimiter");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.use("/", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
