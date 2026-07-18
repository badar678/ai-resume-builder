const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/pdfController");

router.post("/generate-pdf", auth, ctrl.generatePDF);

module.exports = router;