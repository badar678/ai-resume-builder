const { extractKeywords } = require("./keywordService");

function normalize(text = "") {
  return text.toLowerCase();
}

function flatten(arr = []) {
  return arr.map(e => JSON.stringify(e)).join(" ").toLowerCase();
}

// Section weights, normalized to a 0-1 scale (skills = 1.0 is the ceiling).
// A keyword found in Skills is worth more than the same keyword only
// found in Education — but a keyword only needs to be found ONCE, in its
// best-available section, to get credit. It is NOT required to appear in
// every section to score well (that was the previous bug: dividing each
// section's match count by the FULL keyword total meant a resume would
// only approach 100% if literally every keyword appeared in literally
// every section, which no real resume does).
const SECTION_WEIGHT = {
  skills: 1.0,     // 40 / 40
  experience: 0.75, // 30 / 40
  summary: 0.5,     // 20 / 40
  education: 0.25,  // 10 / 40
};

exports.analyzeATS = (resume, jobDescription) => {

  const jdKeywords = extractKeywords(jobDescription);

  const skillsText = normalize((resume.skills || []).join(" "));
  const expText = flatten(resume.experience || []);
  const summaryText = normalize(resume.summary || "");
  const eduText = flatten(resume.education || []);

  const totalKeywords = jdKeywords.length || 1;

  const matchedKeywords = [];
  const missingKeywords = [];
  let weightSum = 0;

  jdKeywords.forEach(k => {
    let found = false;
    let bestWeight = 0;

    // Check sections in priority order — a keyword only needs to appear
    // in ONE of them; it gets credited for the highest-weighted section
    // it's actually found in, not penalized for absence from the rest.
    if (skillsText.includes(k)) { found = true; bestWeight = Math.max(bestWeight, SECTION_WEIGHT.skills); }
    if (expText.includes(k)) { found = true; bestWeight = Math.max(bestWeight, SECTION_WEIGHT.experience); }
    if (summaryText.includes(k)) { found = true; bestWeight = Math.max(bestWeight, SECTION_WEIGHT.summary); }
    if (eduText.includes(k)) { found = true; bestWeight = Math.max(bestWeight, SECTION_WEIGHT.education); }

    if (found) {
      matchedKeywords.push(k);
      weightSum += bestWeight;
    } else {
      missingKeywords.push(k);
    }
  });

  // Reaches 100 only if every keyword is found in its best possible
  // section (Skills); a keyword found only in a lower-weighted section
  // still counts as matched, but contributes proportionally less.
  const score = Math.round((weightSum / totalKeywords) * 100);

  return {
    matchedKeywords,
    missingKeywords,
    score
  };
};