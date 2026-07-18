const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

const stopWords = new Set(natural.stopwords);

exports.extractKeywords = (text) => {

  const tokens = tokenizer
    .tokenize(text.toLowerCase())
    .filter(w => w.length > 2 && !stopWords.has(w));

  return [...new Set(tokens)];
};