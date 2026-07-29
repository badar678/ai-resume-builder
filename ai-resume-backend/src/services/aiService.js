const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.improveText = async (text, tone = "professional") => {
  const toneInstructions = {
    professional: "formal, professional, and corporate",
    confident: "bold, confident, and assertive",
    concise: "brief, punchy, and to the point",
    quantified: "data-driven with specific numbers and metrics",
  };

  const toneDesc = toneInstructions[tone] || toneInstructions.professional;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: "You are an expert resume writer. Return ONLY the rewritten text, no explanations, no preamble, no quotes.",
      },
      {
        role: "user",
        content: `Rewrite this resume bullet point to be more ${toneDesc}.

Rules:
- Start with a strong action verb
- Be specific and impactful  
- Keep it to 1-2 lines maximum
- Do NOT add fictional numbers unless they already exist in the original
- Return ONLY the rewritten bullet point

Original:
${text}`,
      },
    ],
  });

  const improved = response.choices[0]?.message?.content?.trim() || text;

  return {
    original: text,
    improved,
    tone,
  };
};

exports.generateSummary = async (resumeData) => {
  const { personalInfo, experience, skills, education, summary } = resumeData;

  const context = `
Name: ${personalInfo?.fullName || ""}
Skills: ${(skills || []).join(", ")}
Experience: ${(experience || []).map((e) => `${e.jobTitle} at ${e.company}`).join(", ")}
Education: ${(education || []).map((e) => `${e.degree} from ${e.school}`).join(", ")}
  `.trim();

  // If the user has already typed something in the Summary field, the AI
  // must treat it as the source of truth and build on it — not generate a
  // generic summary from scratch that ignores what they wrote. This was
  // the actual bug: previously resumeData.summary was never included in
  // the prompt at all, so anything typed there was silently discarded.
  const hasDraft = summary && summary.trim().length > 0;

  const userPrompt = hasDraft
    ? `Rewrite and polish this resume summary the person already drafted. Keep their core facts, role, and intent — do NOT invent a different job, company, or background. Just make it more professional and impactful (2-3 sentences).

Their draft:
"${summary.trim()}"

Other resume context (use only to fill in relevant detail, not to override their draft):
${context}`
    : `Write a professional resume summary (2-3 sentences) for this person:

${context}`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: "You are an expert resume writer. Return ONLY the summary text, no explanations, no preamble.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "";
};