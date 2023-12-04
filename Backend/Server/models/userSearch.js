const mongoose = require("mongoose");

const K_Data = new mongoose.Schema(
  {
    keyword: String,
    source_name: String,
    author: String,
    title: String,
    content: String,
    sentiment_label: String,
    published_at: Date,
    url: String,
    url_to_image: String,
  },
  { timestamps: false, _id: false }
);

const sentiments = new mongoose.Schema(
  {
    positive: Number,
    negative: Number,
    neutral: Number,
  },
  { timestamps: false, _id: false }
);

const K_Sentiments = new mongoose.Schema(
  {
    keyword: String,
    sentiments: sentiments,
  },
  { timestamps: false, _id: false }
);

const userSearchSchema = new mongoose.Schema(
  {
    searched_keywords: [String],
    searched_keywords_total_data: {
      K1_Data: [K_Data],
      K2_Data: [K_Data],
      K3_Data: [K_Data],
    },
    searched_keywords_total_sentiments: {
      K1_Sentiments: K_Sentiments,
      K2_Sentiments: K_Sentiments,
      K3_Sentiments: K_Sentiments,
    },
    news_sentiments: {},
    reddit_sentiments: {},
    Data: [K_Data],
    graph_data: {
      Dates: [String],
      Positive: [Number],
      Negative: [Number],
      Neutral: [Number],
    },
    news_graph_data: {},
    reddit_graph_data: {},
    Total_Sentiments: {},
  },
  { timestamps: true }
);

const user_search = mongoose.model("user_search", userSearchSchema);
module.exports = { user_search };
