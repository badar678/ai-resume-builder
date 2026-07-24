const jwt = require("jsonwebtoken");

// Authenticates the headless-browser print page (Puppeteer has no login
// session/cookies, so it can't use the normal authMiddleware). Accepts a
// short-lived, single-purpose token via the Authorization header — same
// convention as the regular authMiddleware — that is scoped to one
// specific resumeId so it can't be reused to read other resumes.
module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No print token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "print" || decoded.resumeId !== req.params.id) {
      return res.status(403).json({ msg: "Invalid print token scope" });
    }

    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ msg: "Invalid or expired print token" });
  }
};