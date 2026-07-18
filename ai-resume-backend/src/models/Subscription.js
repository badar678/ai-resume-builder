const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  paymentId: String,
  startDate: Date,
  expiryDate: Date,
  status: { type: String, enum: ["active", "cancelled"], default: "active" },

  // Paddle-specific tracking
  paddleSubscriptionId: { type: String, default: null },
  paddleCustomerId: { type: String, default: null },
  paddleTransactionId: { type: String, default: null }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);