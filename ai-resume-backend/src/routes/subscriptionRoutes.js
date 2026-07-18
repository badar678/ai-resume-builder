const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/subscriptionController");

router.post("/subscribe", auth, ctrl.subscribe);
router.get("/subscription", auth, ctrl.getSubscription);
router.post("/subscription/cancel", auth, ctrl.cancelSubscription);

module.exports = router;