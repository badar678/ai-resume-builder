const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const checkAtsLimit = require("../middlewares/checkAtsLimit");
const ctrl = require("../controllers/atsController");

router.post("/analyze", auth, checkAtsLimit, ctrl.analyze);
router.post("/job-match", auth, ctrl.jobMatch);

module.exports = router;