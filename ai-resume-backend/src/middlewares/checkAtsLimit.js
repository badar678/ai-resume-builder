const User = require("../models/User");
const JobAnalysis = require("../models/JobAnalysis");

const FREE_MONTHLY_LIMIT = 3;

// Gates POST /api/analyze: Free-plan users get a limited number of ATS
// analyses per calendar month; Pro is unlimited. This is what actually
// makes "Advanced ATS scoring" on the Pricing page mean something —
// previously Free and Pro hit the exact same unthrottled endpoint.
module.exports = async function checkAtsLimit(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Pro users are unlimited — skip the count entirely.
    if (user.subscriptionPlan === "pro") return next();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usedThisMonth = await JobAnalysis.countDocuments({
      userId: user._id,
      createdAt: { $gte: startOfMonth },
    });

    if (usedThisMonth >= FREE_MONTHLY_LIMIT) {
      return res.status(403).json({
        msg: `Free plan is limited to ${FREE_MONTHLY_LIMIT} ATS analyses per month. Upgrade to Pro for unlimited analyses.`,
        upgradeRequired: true,
        limit: FREE_MONTHLY_LIMIT,
        used: usedThisMonth,
      });
    }

    next();
  } catch (err) {
    console.error("checkAtsLimit error:", err.message);
    res.status(500).json({ msg: "Failed to verify usage limit" });
  }
};