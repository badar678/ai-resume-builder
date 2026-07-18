const mongoose = require("mongoose");

const jobAnalysisSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  resumeId: mongoose.Schema.Types.ObjectId,

  jobDescription: String,

  matchedKeywords: [String],
  missingKeywords: [String],

  score: Number
});

module.exports = mongoose.model("JobAnalysis", jobAnalysisSchema);