const { improveText, generateSummary } = require("../services/aiService");

exports.improveBullet = async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text || text.trim().length < 5)
      return res.status(400).json({ msg: "Text is required" });

    const result = await improveText(text, tone);
    res.json(result);
  } catch (err) {
    console.error("AI improve error:", err.message);
    res.status(500).json({ msg: "AI service failed. Check your API key." });
  }
};

exports.generateSummary = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData)
      return res.status(400).json({ msg: "Resume data is required" });

    const summary = await generateSummary(resumeData);
    res.json({ summary });
  } catch (err) {
    console.error("AI summary error:", err.message);
    res.status(500).json({ msg: "AI service failed. Check your API key." });
  }
};