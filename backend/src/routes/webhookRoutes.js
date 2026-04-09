const express = require("express");
const { webhookTriggerController } = require("../controllers/webhookController");

const router = express.Router();

router.post("/webhook/:workflowId", webhookTriggerController);

module.exports = router;
