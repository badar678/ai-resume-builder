const mongoose = require("mongoose");
const Resume = require("../models/Resume");

// GET /api/resume — list all resumes for logged-in user
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch resumes" });
  }
};

// GET /api/resume/:id
exports.getResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: "Invalid resume ID" });

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    res.json(resume);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch resume" });
  }
};

// POST /api/resume
exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, userId: req.user.id });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create resume" });
  }
};

// POST /api/resume/:id/duplicate
exports.duplicateResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: "Invalid resume ID" });

    const original = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!original) return res.status(404).json({ msg: "Resume not found" });

    const { _id, __v, createdAt, ...resumeData } = original.toObject();

    const duplicate = await Resume.create({
      ...resumeData,
      title: `${original.title || "Untitled Resume"} (Copy)`,
      userId: req.user.id,
    });

    res.json(duplicate);
  } catch (err) {
    res.status(500).json({ msg: "Failed to duplicate resume" });
  }
};

// PUT /api/resume/:id
exports.updateResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: "Invalid resume ID" });

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    res.json(resume);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update resume" });
  }
};

// DELETE /api/resume/:id
exports.deleteResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: "Invalid resume ID" });

    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete resume" });
  }
};