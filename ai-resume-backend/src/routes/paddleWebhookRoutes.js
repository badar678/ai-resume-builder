const router = require("express").Router();
const express = require("express");
const ctrl = require("../controllers/paddleWebhookController");

// Paddle requires the RAW request body to verify the webhook signature,
// so this route uses express.raw() instead of the app-wide express.json().
router.post(
  "/webhooks/paddle",
  express.raw({ type: "application/json" }),
  ctrl.handlePaddleWebhook
);

module.exports = router;