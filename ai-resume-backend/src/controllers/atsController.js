const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const JobAnalysis = require("../models/JobAnalysis");
const { analyzeATS } = require("../services/atsService");

exports.analyze = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription)
      return res.status(400).json({ msg: "resumeId and jobDescription are required" });

    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ msg: "Invalid resume ID" });

    if (jobDescription.trim().length < 50)
      return res.status(400).json({ msg: "Job description is too short. Please paste the full job description." });

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    const result = analyzeATS(resume, jobDescription);

    const analysis = await JobAnalysis.create({
      userId: req.user.id,
      resumeId,
      jobDescription,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      score: result.score,
    });

    resume.atsScore = result.score;
    await resume.save();

    res.json(analysis);
  } catch (err) {
    console.error("ATS analyze error:", err.message);
    res.status(500).json({ msg: "Failed to analyze resume" });
  }
};

exports.jobMatch = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription)
      return res.status(400).json({ msg: "resumeId and jobDescription are required" });

    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ msg: "Invalid resume ID" });

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    const result = analyzeATS(resume, jobDescription);
    res.json(result);
  } catch (err) {
    console.error("Job match error:", err.message);
    res.status(500).json({ msg: "Failed to analyze job match" });
  }
};