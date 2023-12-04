const axios = require("axios");
const { sentimentLabel } = require("../utils/sentiment");
const { reddit_comments } = require("../models/redditComments");
const len = require("lodash/size");

async function fetchDataForSubreddits(subreddit) {
  try {
    const response = await axios.get(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=100&count=100`,
      {
        headers: {
          "User-Agent": process.env.USER_AGENT,
        },
      }
    );

    const posts = response.data.data.children;
    const length = len(posts);
    // console.log(length);

    // Initialize sentiment counters for each keyword
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    // Create a dictionary to store sentiment data for each keyword
    const sentimentData = {};
    const sentimentCountsByDate = {};

    // Calculate sentiment for each post and format the data
    const data = posts.map((post) => {
      const sentiment = sentimentLabel(post.data.selftext);
      const isoDateString = new Date(post.data.created_utc * 1000)
        .toISOString()
        .split(".")[0];

      if (sentiment === "positive") {
        positiveCount++;
      } else if (sentiment === "negative") {
        negativeCount++;
      } else {
        neutralCount++;
      }
      //       // Count sentiment occurrences by date
      if (!sentimentCountsByDate[isoDateString.split("T")[0]]) {
        sentimentCountsByDate[isoDateString.split("T")[0]] = {
          positive: 0,
          negative: 0,
          neutral: 0,
        };
      }
      if (sentiment === "positive") {
        sentimentCountsByDate[isoDateString.split("T")[0]].positive++;
      } else if (sentiment === "negative") {
        sentimentCountsByDate[isoDateString.split("T")[0]].negative++;
      } else {
        sentimentCountsByDate[isoDateString.split("T")[0]].neutral++;
      }

      return {
        keyword: subreddit,
        source_name: "Reddit-API",
        url: post.data.url,
        title: post.data.title,
        author: post.data.author,
        content: post.data.selftext,
        published_at: isoDateString,
        url_to_image: "https://cdn-icons-png.flaticon.com/512/2111/2111589.png",
        sentiment_label: sentiment,
      };
    });
    // Store sentiment counts for the current keyword
    sentimentData["keyword"] = subreddit;
    sentimentData["sentiments"] = {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
    };

    redditGraphData = {
      keyword: subreddit,
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
    return { data, sentimentData, redditGraphData };
  } catch (error) {
    console.error(`Error fetching data for ${subreddit}:`, error);
    return null;
  }
}

async function fetchRedditData(subredditList, userSearchId) {
  const reddit_Data = {};
  const reddit_Sentiments = {};
  const reddit_graph_data = {};

  for (const [index, subreddit] of subredditList.entries()) {
    // Corrected loop syntax
    const { data, sentimentData, redditGraphData } =
      await fetchDataForSubreddits(subreddit);
    reddit_Data[`K${index + 1}_Reddit_Data`] = data;
    reddit_Sentiments[`K${index + 1}_Reddit_Sentiments`] = sentimentData;
    reddit_graph_data[`K${index + 1}_Reddit_graph_data`] = redditGraphData;
  }

  // Create a single document and store the aggregated news data and sentiments
  const newRedditComments = new reddit_comments({
    searched_keywords: subredditList,
    searched_keywords_reddit_data: reddit_Data,
    searched_keywords_reddit_sentiments: reddit_Sentiments,
    user_search: userSearchId,
  });

  // Save the new document to the database
  await newRedditComments.save();

  return { reddit_Data, reddit_Sentiments, reddit_graph_data };
}

module.exports = { fetchRedditData };
