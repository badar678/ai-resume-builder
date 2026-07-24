const puppeteer = require("puppeteer");

// Puppeteer no longer builds its own HTML/CSS copy of each template.
// Instead it opens the app's real /print/:resumeId page, which renders the
// SAME React template component used in the on-screen preview (see
// frontend src/pages/PrintResume.jsx and src/components/templates/*).
// This means changing a template's .jsx file updates both the live
// preview AND the downloaded PDF automatically — no more editing two
// separate copies of every template.
exports.generateResumePDF = async (resume, printToken, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    if (!process.env.FRONTEND_URL) {
      throw new Error(
        "FRONTEND_URL environment variable is not set. Puppeteer needs it to load the print page (e.g. http://localhost:5173 locally, or your Vercel URL in production)."
      );
    }

    const baseUrl = process.env.FRONTEND_URL.replace(/\/+$/, ""); // strip trailing slash
    const printUrl = `${baseUrl}/print/${resume._id}?token=${printToken}`;

    await page.goto(printUrl, { waitUntil: "networkidle0" });

    // The print page renders a hidden #print-ready marker once the resume
    // data has loaded and the template has painted, so Puppeteer never
    // prints a blank/loading state.
    await page.waitForSelector("#print-ready", { timeout: 15000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(resume.title || "resume").replace(/[^a-z0-9\-_ ]/gi, "")}.pdf"`
    );
    res.send(pdf);
  } finally {
    await browser.close();
  }
};