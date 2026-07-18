require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const atsRoutes = require("./routes/atsRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paddleWebhookRoutes = require("./routes/paddleWebhookRoutes");



connectDB();
const app = express();

// Allowed frontend origins. FRONTEND_URL is set in Render's environment
// variables (e.g. https://ai-resume-builder-eta-lilac.vercel.app) — this
// avoids hardcoding a deployed URL into the source, which is what caused
// the CORS mismatch (a placeholder example URL got committed instead of
// the real deployed one, and any URL change would've required a code edit).
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// Paddle webhooks need the RAW request body to verify their signature,
// so this is mounted BEFORE express.json() below.
app.use("/api", paddleWebhookRoutes);

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api", atsRoutes);
app.use("/api", pdfRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", adminRoutes);
app.use("/api", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));