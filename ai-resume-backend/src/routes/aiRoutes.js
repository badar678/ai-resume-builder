const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/aiController");

router.post("/ai/improve", auth, ctrl.improveBullet);
router.post("/ai/summary", auth, ctrl.generateSummary);

module.exports = router;