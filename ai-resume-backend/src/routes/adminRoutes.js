const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const ctrl = require("../controllers/adminController");

router.get("/admin/users", auth, admin, ctrl.getUsers);
router.get("/admin/templates", auth, admin, ctrl.getTemplates);
router.get("/admin/subscriptions", auth, admin, ctrl.getSubscriptionOverview);

module.exports = router;