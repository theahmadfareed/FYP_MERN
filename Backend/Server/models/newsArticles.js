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

const newsArticlesSchema = new mongoose.Schema(
  {
    user_search: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_search",
    },
    searched_keywords: [String],
    searched_keywords_news_data: {
      K1_News_Data: [K_Data],
      K2_News_Data: [K_Data],
      K3_News_Data: [K_Data],
    },
    searched_keywords_news_sentiments: {
      K1_News_Sentiments: K_Sentiments,
      K2_News_Sentiments: K_Sentiments,
      K3_News_Sentiments: K_Sentiments,
    },
  },
  { timestamps: true }
);

const news_articles = mongoose.model("news_articles", newsArticlesSchema);
module.exports = { news_articles };
