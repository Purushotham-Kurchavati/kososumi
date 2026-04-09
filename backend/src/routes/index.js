const express = require("express");
const authRoutes = require("./authRoutes");
const workflowRoutes = require("./workflowRoutes");
const executionRoutes = require("./executionRoutes");
const webhookRoutes = require("./webhookRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "kososumi-backend" });
});

router.use("/auth", authRoutes);
router.use("/workflows", workflowRoutes);
router.use("/", executionRoutes);
router.use("/", webhookRoutes);

module.exports = router;
