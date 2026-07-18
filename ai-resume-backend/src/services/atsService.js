
const { extractKeywords } = require("./keywordService");

function normalize(text = "") {
  return text.toLowerCase();
}

function flatten(arr = []) {
  return arr.map(e => JSON.stringify(e)).join(" ").toLowerCase();
}

function matchSection(sectionText, jdKeywords) {
  let matched = 0;
  jdKeywords.forEach(k => {
    if (sectionText.includes(k)) matched++;
  });
  return matched;
}

exports.analyzeATS = (resume, jobDescription) => {

  const jdKeywords = extractKeywords(jobDescription);

  const skillsText = normalize((resume.skills || []).join(" "));
  const expText = flatten(resume.experience || []);
  const summaryText = normalize(resume.summary || "");
  const eduText = flatten(resume.education || []);

  const skillsMatch = matchSection(skillsText, jdKeywords);
  const expMatch = matchSection(expText, jdKeywords);
  const summaryMatch = matchSection(summaryText, jdKeywords);
  const eduMatch = matchSection(eduText, jdKeywords);

  const totalKeywords = jdKeywords.length || 1;

  const weightedScore =
    ((skillsMatch / totalKeywords) * 40) +
    ((expMatch / totalKeywords) * 30) +
    ((summaryMatch / totalKeywords) * 20) +
    ((eduMatch / totalKeywords) * 10);

  const resumeText =
    skillsText + expText + summaryText + eduText;

  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(k => {
    if (resumeText.includes(k)) matchedKeywords.push(k);
    else missingKeywords.push(k);
  });

  return {
    matchedKeywords,
    missingKeywords,
    score: Math.round(weightedScore)
  };
};








// const { extractKeywords } = require("./keywordService");

// function flattenResume(resume) {

//   return `
//   ${resume.summary || ""}

//   ${(resume.skills || []).join(" ")}

//   ${(resume.experience || []).map(e => JSON.stringify(e)).join(" ")}

//   ${(resume.education || []).map(e => JSON.stringify(e)).join(" ")}
//   `;
// }

// exports.analyzeATS = (resume, jobDescription) => {

//   const jdKeywords = extractKeywords(jobDescription);
//   const resumeText = flattenResume(resume).toLowerCase();

//   const matched = [];
//   const missing = [];

//   jdKeywords.forEach(k => {
//     if (resumeText.includes(k)) matched.push(k);
//     else missing.push(k);
//   });

//   const score =
//     jdKeywords.length === 0
//       ? 0
//       : Math.round((matched.length / jdKeywords.length) * 100);

//   return {
//     matchedKeywords: matched,
//     missingKeywords: missing,
//     score
//   };
// };