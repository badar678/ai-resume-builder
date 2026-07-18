const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfservice");

exports.generatePDF = async (req, res) => {

  const { resumeId } = req.body;

  if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
    return res.status(400).json({ msg: "Invalid resume ID. Save the resume first." });
  }

  try {
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id
    });

    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    generateResumePDF(resume, res);
  } catch (err) {
    console.error("PDF generation error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ msg: "Failed to generate PDF" });
    }
  }
};