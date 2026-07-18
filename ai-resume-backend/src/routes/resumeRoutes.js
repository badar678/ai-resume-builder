const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/resumeController");

router.get("/", auth, ctrl.getAllResumes);       // list all resumes
router.post("/", auth, ctrl.createResume);       // create resume
router.post("/:id/duplicate", auth, ctrl.duplicateResume); // duplicate resume
router.get("/:id", auth, ctrl.getResume);        // get single resume
router.put("/:id", auth, ctrl.updateResume);     // update resume
router.delete("/:id", auth, ctrl.deleteResume);  // delete resume

module.exports = router;