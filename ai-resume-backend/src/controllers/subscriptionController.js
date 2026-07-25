const Subscription = require("../models/Subscription");
const User = require("../models/User");
const paddle = require("../config/paddle");

// POST /api/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !["free", "pro"].includes(plan)) {
      return res.status(400).json({ msg: "Invalid plan selected" });
    }

    // Supersede any existing active subscription so only one is ever "active"
    await Subscription.updateMany(
      { userId: req.user.id, status: "active" },
      { status: "cancelled" }
    );

    const expiryDate =
      plan === "pro" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

    const sub = await Subscription.create({
      userId: req.user.id,
      plan,
      paymentId: "dummy-payment",
      startDate: new Date(),
      expiryDate,
      status: "active",
    });

    // Keep User in sync -- Dashboard/Sidebar read from here
    await User.findByIdAndUpdate(req.user.id, {
      subscriptionPlan: plan,
      subscriptionStatus: "active",
    });

    res.json(sub);
  } catch (err) {
    res.status(500).json({ msg: "Failed to process subscription" });
  }
};

// GET /api/subscription
exports.getSubscription = async (req, res) => {
  try {
    // Only ever trust the ACTIVE subscription -- cancelled records must not be returned
    const sub = await Subscription.findOne({
      userId: req.user.id,
      status: "active",
    }).sort({ startDate: -1 });

    if (!sub) {
      return res.json({ plan: "free", status: "active", expiryDate: null });
    }

    res.json(sub);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch subscription" });
  }
};

// POST /api/subscription/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user.id,
      status: "active",
    }).sort({ startDate: -1 });

    if (!sub || sub.plan === "free") {
      return res.status(400).json({ msg: "No active paid subscription found" });
    }

    if (sub.cancelAtPeriodEnd) {
      return res.status(400).json({ msg: "Subscription is already set to cancel" });
    }

    // This is the actual fix for the known billing gap: previously this
    // endpoint only flipped a local MongoDB flag and downgraded the user
    // immediately, but never told Paddle to stop renewing — so Paddle
    // kept charging the customer's card every month regardless of what
    // this endpoint did. Real subscriptions (created via Paddle checkout)
    // have a paddleSubscriptionId; this actually cancels the recurring
    // billing with Paddle. effectiveFrom: "next_billing_period" means
    // Paddle won't charge again, but the user keeps Pro access through
    // the period they already paid for — standard SaaS cancellation UX.
    if (sub.paddleSubscriptionId) {
      await paddle.subscriptions.cancel(sub.paddleSubscriptionId, {
        effectiveFrom: "next_billing_period",
      });
    } else {
      // No Paddle subscription attached to this record (e.g. it was
      // created through the /api/subscribe dev/test endpoint rather than
      // a real Paddle checkout) — nothing to tell Paddle to stop, so just
      // fall through and cancel locally instead of erroring out.
      console.warn(
        `Cancelling subscription ${sub._id} with no paddleSubscriptionId — nothing to cancel on Paddle's side.`
      );
    }

    // Don't downgrade the user yet — they keep Pro until the period they
    // already paid for ends. The status flips to "cancelled" and the User
    // record downgrades to free automatically when Paddle's real
    // subscription.canceled webhook fires (see paddleWebhookController.js),
    // which is the source of truth for when billing actually stopped.
    sub.cancelAtPeriodEnd = true;
    await sub.save();

    res.json({
      msg: "Your subscription will not renew. You'll keep Pro access until your current billing period ends.",
      expiryDate: sub.expiryDate,
    });
  } catch (err) {
    // Paddle SDK errors carry an err.code matching Paddle's documented
    // error reference (confirmed via @paddle/paddle-node-sdk docs) — in
    // particular "forbidden" means the PADDLE_API_KEY is missing the
    // Subscriptions > Write permission scope in the Paddle dashboard,
    // which is a dashboard config issue, not a bug in this code. Logging
    // the full error object (not just err.message) so any additional
    // detail Paddle includes — e.g. a request id for their support team —
    // isn't lost.
    console.error("Failed to cancel subscription with Paddle:", err);

    if (err.code === "forbidden") {
      return res.status(500).json({
        msg: "Paddle rejected this request. The API key needs the 'Subscriptions (Write)' permission — check Developer Tools → Authentication in the Paddle dashboard.",
      });
    }

    res.status(500).json({ msg: "Failed to cancel subscription" });
  }
};

// POST /api/subscription/resume
exports.resumeSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user.id,
      status: "active",
    }).sort({ startDate: -1 });

    if (!sub || sub.plan === "free") {
      return res.status(400).json({ msg: "No active paid subscription found" });
    }

    if (!sub.cancelAtPeriodEnd) {
      return res.status(400).json({ msg: "Subscription isn't scheduled to cancel" });
    }

    // Undoing a scheduled cancellation is different from "reinstating a
    // canceled subscription" — Paddle genuinely can't do the latter once
    // status has actually flipped to canceled. But while status is still
    // "active" with a pending scheduled_change (which is exactly this
    // state — cancelAtPeriodEnd true, status still active), Paddle lets
    // you clear that scheduled change via the update-subscription
    // endpoint, and billing just continues as normal.
    if (sub.paddleSubscriptionId) {
      await paddle.subscriptions.update(sub.paddleSubscriptionId, {
        scheduledChange: null,
      });
    } else {
      console.warn(
        `Resuming subscription ${sub._id} with no paddleSubscriptionId — nothing to update on Paddle's side.`
      );
    }

    sub.cancelAtPeriodEnd = false;
    await sub.save();

    res.json({ msg: "Your subscription will renew as normal.", expiryDate: sub.expiryDate });
  } catch (err) {
    console.error("Failed to resume subscription with Paddle:", err);

    if (err.code === "forbidden") {
      return res.status(500).json({
        msg: "Paddle rejected this request. The API key needs the 'Subscriptions (Write)' permission — check Developer Tools → Authentication in the Paddle dashboard.",
      });
    }

    res.status(500).json({ msg: "Failed to resume subscription" });
  }
};