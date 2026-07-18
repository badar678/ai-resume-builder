const Subscription = require("../models/Subscription");
const User = require("../models/User");

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

    sub.status = "cancelled";
    await sub.save();

    await User.findByIdAndUpdate(req.user.id, {
      subscriptionPlan: "free",
      subscriptionStatus: "free",
    });

    res.json({ msg: "Subscription cancelled" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to cancel subscription" });
  }
};