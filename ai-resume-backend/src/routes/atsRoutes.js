const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/atsController");

router.post("/analyze", auth, ctrl.analyze);
router.post("/job-match", auth, ctrl.jobMatch);

module.exports = router;


