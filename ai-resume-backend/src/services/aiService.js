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
  const { personalInfo, experience, skills, education } = resumeData;

  const context = `
Name: ${personalInfo?.fullName || ""}
Skills: ${(skills || []).join(", ")}
Experience: ${(experience || []).map((e) => `${e.jobTitle} at ${e.company}`).join(", ")}
Education: ${(education || []).map((e) => `${e.degree} from ${e.school}`).join(", ")}
  `.trim();

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
        content: `Write a professional resume summary (2-3 sentences) for this person:

${context}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "";
};