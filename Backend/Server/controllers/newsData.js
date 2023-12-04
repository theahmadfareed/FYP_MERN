const { sentimentLabel } = require("../utils/sentiment");
const { news_articles } = require("../models/newsArticles");
const len = require("lodash/size");

async function fetchNewsData(keywords, userSearchId) {
  const news_Data = {};
  const news_Sentiments = {};
  const newsGraphData = {};

  try {
    await Promise.all(
      keywords.map(async (keyword, index) => {
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${process.env.NEWS_API_KEY}&sort_by=relevancy&language=en&pageSize=100`;

        const newsApiResponse = await fetch(newsApiUrl);

        if (!newsApiResponse.ok) {
          throw new Error(`Failed to fetch news data for keyword: ${keyword}`);
        }

        const keywordNewsData = await newsApiResponse.json();
        const length = len(keywordNewsData.articles);
        // console.log(length);
        // Initialize sentiment counters for the current keyword
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        const sentimentCountsByDate = {};

        // Filter the news articles to only include the desired attributes
        const filteredNewsArticles = keywordNewsData.articles.map((article) => {
          const sentiment = sentimentLabel(article.description);

          if (sentiment === "positive") {
            positiveCount++;
          } else if (sentiment === "negative") {
            negativeCount++;
          } else {
            neutralCount++;
          }

          // Count sentiment occurrences by date
          const date = article.publishedAt.split("T")[0];
          if (!sentimentCountsByDate[date]) {
            sentimentCountsByDate[date] = {
              positive: 0,
              negative: 0,
              neutral: 0,
            };
          }

          if (sentiment === "positive") {
            sentimentCountsByDate[date].positive++;
          } else if (sentiment === "negative") {
            sentimentCountsByDate[date].negative++;
          } else {
            sentimentCountsByDate[date].neutral++;
          }
          return {
            keyword: keyword,
            source_name: "News-API",
            url: article.url,
            title: article.title,
            author: article.author,
            content: article.description,
            published_at: article.publishedAt.split("Z")[0],
            url_to_image: "https://newsapi.org/images/n-logo-border.png",
            sentiment_label: sentiment,
          };
        });

        // Store the data with the key format "K1_news_Data", "K2_news_Data", etc.
        news_Data[`K${index + 1}_News_Data`] = filteredNewsArticles;
        news_Sentiments[`K${index + 1}_News_Sentiments`] = {
          keyword: `${keyword}`,
          sentiments: {
            positive: positiveCount,
            negative: negativeCount,
            neutral: neutralCount,
          },
        };
        // Prepare graph data for each keyword
        newsGraphData[`K${index + 1}_News_Graph_Data`] = {
          keyword: keyword,
          Dates: Object.keys(sentimentCountsByDate),
          Positive: Object.values(sentimentCountsByDate).map(
            (count) => count.positive
          ),
          Negative: Object.values(sentimentCountsByDate).map(
            (count) => count.negative
          ),
          Neutral: Object.values(sentimentCountsByDate).map(
            (count) => count.neutral
          ),
        };
      })
    );

    // Create a single document and store the aggregated news data and sentiments
    const newNewsArticle = new news_articles({
      searched_keywords: keywords,
      searched_keywords_news_data: news_Data,
      searched_keywords_news_sentiments: news_Sentiments,
      user_search: userSearchId,
    });

    // Save the new document to the database
    await newNewsArticle.save();

    return { news_Data, news_Sentiments, newsGraphData };
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
}

module.exports = { fetchNewsData };
