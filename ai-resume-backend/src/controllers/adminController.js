const User = require("../models/User");
const Resume = require("../models/Resume");
const Subscription = require("../models/Subscription");

const KNOWN_TEMPLATES = [
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "compact", name: "Compact" },
  { id: "classic", name: "Classic" },
];

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetToken -resetTokenExpiry")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

// GET /api/admin/templates
exports.getTemplates = async (req, res) => {
  try {
    const usage = await Resume.aggregate([
      { $group: { _id: { $ifNull: ["$templateId", "modern"] }, count: { $sum: 1 } } },
    ]);

    const usageMap = {};
    usage.forEach((u) => {
      usageMap[u._id] = u.count;
    });

    const templates = KNOWN_TEMPLATES.map((t) => ({
      ...t,
      usageCount: usageMap[t.id] || 0,
    }));

    res.json(templates);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch templates" });
  }
};

// GET /api/admin/subscriptions
exports.getSubscriptionOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({
      subscriptionPlan: "pro",
      subscriptionStatus: "active",
    });
    const freeUsers = totalUsers - proUsers;
    const estimatedMRR = proUsers * 9;

    const recentSubscriptions = await Subscription.find({ plan: "pro" })
      .sort({ startDate: -1 })
      .limit(10)
      .populate("userId", "name email");

    res.json({
      totalUsers,
      proUsers,
      freeUsers,
      estimatedMRR,
      recentSubscriptions,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch subscription overview" });
  }
};