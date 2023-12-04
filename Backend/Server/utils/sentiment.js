const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function sentimentLabel(content) {
  try {
    const analysis = sentiment.analyze(content);

    if (analysis.score > 0) {
      return "positive";
    } else if (analysis.score < 0) {
      return "negative";
    } else {
      return "neutral";
    }
  } catch (error) {
    // Handle the error here
    return "neutral";
  }
}

module.exports = { sentimentLabel };
