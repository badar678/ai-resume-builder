const { Paddle, Environment, EventName } = require("@paddle/paddle-node-sdk");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment:
    process.env.PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
});

// POST /api/webhooks/paddle
exports.handlePaddleWebhook = async (req, res) => {
  const signature = req.headers["paddle-signature"] || "";
  const rawRequestBody = req.body.toString();
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET;

  console.log(
    "Raw body type:", typeof rawRequestBody,
    "| Body length:", rawRequestBody.length,
    "| Signature present:", !!signature,
    "| Secret loaded:", !!secretKey
  );

  let eventData;
  try {
    eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
  } catch (err) {
    console.error("Paddle webhook signature verification failed:", err.message);
    return res.status(401).json({ msg: "Invalid signature" });
  }

  if (!eventData) {
    return res.status(400).json({ msg: "Unable to parse webhook" });
  }

  try {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
        await activateSubscription(eventData.data);
        break;

      case EventName.SubscriptionUpdated:
        await syncSubscription(eventData.data);
        break;

      case EventName.SubscriptionCanceled:
        await cancelSubscription(eventData.data);
        break;

      case EventName.TransactionCompleted:
        // Subscription state is driven by subscription.* events above.
        // This case exists so completed one-off/renewal payments are visible in logs.
        console.log(`Transaction completed: ${eventData.data.id}`);
        break;

      default:
        console.log(`Unhandled Paddle event: ${eventData.eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error processing Paddle webhook:", err.message);
    // Return 200 so Paddle doesn't endlessly retry on our own bug;
    // the error is logged so we notice it separately.
    res.status(200).json({ received: true, error: "Internal processing error" });
  }
};

async function activateSubscription(data) {
  const userId = data.customData?.userId;

  if (!userId) {
    console.warn("Paddle subscription event missing customData.userId:", data.id);
    return;
  }

  const expiryDate = data.currentBillingPeriod?.endsAt
    ? new Date(data.currentBillingPeriod.endsAt)
    : null;

  // Supersede any existing active subscription for this user
  await Subscription.updateMany(
    { userId, status: "active" },
    { status: "cancelled" }
  );

  await Subscription.create({
    userId,
    plan: "pro",
    paymentId: data.id,
    startDate: new Date(),
    expiryDate,
    status: "active",
    paddleSubscriptionId: data.id,
    paddleCustomerId: data.customerId,
  });

  await User.findByIdAndUpdate(userId, {
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    paddleCustomerId: data.customerId,
  });
}

async function syncSubscription(data) {
  const sub = await Subscription.findOne({ paddleSubscriptionId: data.id });
  if (!sub) return;

  const isActive = data.status === "active" || data.status === "trialing";

  sub.status = isActive ? "active" : "cancelled";
  if (data.currentBillingPeriod?.endsAt) {
    sub.expiryDate = new Date(data.currentBillingPeriod.endsAt);
  }
  await sub.save();

  await User.findByIdAndUpdate(sub.userId, {
    subscriptionPlan: isActive ? "pro" : "free",
    subscriptionStatus: isActive ? "active" : "free",
  });
}

async function cancelSubscription(data) {
  const sub = await Subscription.findOne({ paddleSubscriptionId: data.id });
  if (!sub) return;

  sub.status = "cancelled";
  await sub.save();

  await User.findByIdAndUpdate(sub.userId, {
    subscriptionPlan: "free",
    subscriptionStatus: "free",
  });
}