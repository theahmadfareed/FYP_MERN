const { user_search } = require("../models/userSearch");
const { fetchNewsData } = require("./newsData");
const { fetchRedditData } = require("./redditData");

async function fetchData(keywords) {
  const userSearch = new user_search({
    searched_keywords: keywords,
  });
  const userSearchId = userSearch._id;
  console.log(userSearchId);

  try {
    const { news_Data, news_Sentiments, newsGraphData } = await fetchNewsData(
      keywords,
      userSearchId
    );
    const { reddit_Data, reddit_Sentiments, reddit_graph_data } =
      await fetchRedditData(keywords, userSearchId);

    // Check if news_Sentiments and reddit_Sentiments are defined and not null
    if (news_Sentiments && reddit_Sentiments) {
      // Create a dictionary to store the total sentiments for each keyword
      const each_keyword_total_Sentiments = {};

      for (const keyword of keywords) {
        const keywordIndex = keywords.indexOf(keyword);

        each_keyword_total_Sentiments[`K${keywordIndex + 1}_Sentiments`] = {
          keyword,
          sentiments: {
            positive:
              news_Sentiments[`K${keywordIndex + 1}_News_Sentiments`].sentiments
                .positive +
              reddit_Sentiments[`K${keywordIndex + 1}_Reddit_Sentiments`]
                .sentiments.positive,
            negative:
              news_Sentiments[`K${keywordIndex + 1}_News_Sentiments`].sentiments
                .negative +
              reddit_Sentiments[`K${keywordIndex + 1}_Reddit_Sentiments`]
                .sentiments.negative,
            neutral:
              news_Sentiments[`K${keywordIndex + 1}_News_Sentiments`].sentiments
                .neutral +
              reddit_Sentiments[`K${keywordIndex + 1}_Reddit_Sentiments`]
                .sentiments.neutral,
          },
        };
      }

      const each_keyword_total_Data = {};
      let Data = [];

      for (const [index, keyword] of keywords.entries()) {
        const combinedData = {
          [`K${index + 1}_Data`]: [
            ...news_Data[`K${index + 1}_News_Data`],
            ...reddit_Data[`K${index + 1}_Reddit_Data`],
          ],
        };

        each_keyword_total_Data[`K${index + 1}_Data`] =
          combinedData[`K${index + 1}_Data`];
        Data = Data.concat(...combinedData[`K${index + 1}_Data`]);
      }

      Data.sort((a, b) => {
        return new Date(b.published_at) - new Date(a.published_at);
      });

      // Initialize the dictionary to store data
      const graphData = {
        Dates: [],
        Positive: [],
        Negative: [],
        Neutral: [],
      };

      // Iterate over the data and update sentiment counts for each date
      Data.forEach((item) => {
        const date = item.published_at; // Assuming date is in the format ""YYYY-MM-DDTHH:mm:ss"
        const sentiment = item.sentiment_label;

        // Format the date to "YYYY-MM-DD"
        const formattedDate = date.split("T")[0];

        // Check if the date is already in the dictionary
        const dateIndex = graphData.Dates.indexOf(formattedDate);

        if (dateIndex !== -1) {
          // Date is already in the dictionary, update sentiment counts
          if (sentiment === "positive") {
            graphData.Positive[dateIndex]++;
          } else if (sentiment === "negative") {
            graphData.Negative[dateIndex]++;
          } else {
            graphData.Neutral[dateIndex]++;
          }
        } else {
          // Date is not in the dictionary, add it and initialize sentiment counts
          graphData.Dates.push(formattedDate);
          graphData.Positive.push(sentiment === "positive" ? 1 : 0);
          graphData.Negative.push(sentiment === "negative" ? 1 : 0);
          graphData.Neutral.push(sentiment === "neutral" ? 1 : 0);
        }
      });
      console.log(graphData);
      // Calculate the sum of each array
      const sum_positive = graphData["Positive"].reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const sum_negative = graphData["Negative"].reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const sum_neutral = graphData["Neutral"].reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      // Store the results in a dictionary
      const results = {
        Positive: sum_positive,
        Negative: sum_negative,
        Neutral: sum_neutral,
      };
      // Print the results
      console.log(results);
      // Create a single document and store the aggregated news data and sentiments
      (userSearch.searched_keywords_total_data = each_keyword_total_Data),
        (userSearch.searched_keywords_total_sentiments =
          each_keyword_total_Sentiments),
        (userSearch.news_sentiments = news_Sentiments),
        (userSearch.reddit_sentiments = reddit_Sentiments),
        (userSearch.Data = Data),
        (userSearch.graph_data = graphData),
        (userSearch.news_graph_data = newsGraphData),
        (userSearch.reddit_graph_data = reddit_graph_data),
        (userSearch.Total_Sentiments = results),
        // Save the new document to the database
        userSearch.save();

      return {
        // each_keyword_total_Data,
        // each_keyword_total_Sentiments,
        // Data,
        // graphData,
        userSearchId,
      };
    } else {
      return { error: "Inner Internal server error" };
    }
  } catch (error) {
    console.error("Error in try block:", error);
    return { error: "Outer Internal server error" };
  }
}

module.exports = { fetchData };
