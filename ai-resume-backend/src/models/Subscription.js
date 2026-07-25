const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  paymentId: String,
  startDate: Date,
  expiryDate: Date,
  status: { type: String, enum: ["active", "cancelled"], default: "active" },

  // True once the user has clicked "Cancel" and we've told Paddle to stop
  // renewing. status stays "active" (they keep Pro access through what
  // they already paid for) until Paddle's subscription.canceled webhook
  // actually fires at the end of the current billing period.
  cancelAtPeriodEnd: { type: Boolean, default: false },

  // Paddle-specific tracking
  paddleSubscriptionId: { type: String, default: null },
  paddleCustomerId: { type: String, default: null },
  paddleTransactionId: { type: String, default: null }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);