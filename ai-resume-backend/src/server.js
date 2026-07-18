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

app.use(cors({ origin: 'https://ai-resume-frontend.vercel.app' }))

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