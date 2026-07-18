const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: String,
  templateId: { type: String, default: "modern" },

  personalInfo: Object,
  summary: String,

  experience: Array,
  education: Array,
  skills: Array,
  projects: Array,
  certifications: Array,

  atsScore: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);