const express = require("express");
const router = express.Router();
const { fetchNewsData } = require("../controllers/newsData");
const { fetchRedditData } = require("../controllers/redditData");
const { fetchData } = require("../controllers/fetchData");
const { user_search } = require("../models/userSearch");
const { news_articles } = require("../models/newsArticles");
const { reddit_comments } = require("../models/redditComments");

//! Define Routes (/api/)
router.post("/fetchNewsData", async (req, res) => {
  try {
    const { keywords } = req.body; // Extract the 'keywords' array from the request body
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Invalid or missing 'keywords' array in the request body",
      });
    }

    const newsData = await fetchNewsData(keywords);
    res.json(newsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/fetchNewsData/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const userSearchNewsData = await news_articles.findOne({ user_search: id });

    if (!userSearchNewsData) {
      return res.status(404).json({ error: "User search News data not found" });
    }
    res.json(userSearchNewsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/fetchRedditData", async (req, res) => {
  try {
    const { keywords } = req.body; // Extract the 'keywords' array from the request body
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Invalid or missing 'keywords' array in the request body",
      });
    }

    const redditData = await fetchRedditData(keywords);
    res.json(redditData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/fetchRedditData/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const userSearchRedditData = await reddit_comments.findOne({
      user_search: id,
    });

    if (!userSearchRedditData) {
      return res
        .status(404)
        .json({ error: "User search Reddit data not found" });
    }
    res.json(userSearchRedditData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/fetchData", async (req, res) => {
  try {
    const { keywords } = req.body; // Extract the 'keywords' array from the request body
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Invalid or missing 'keywords' array in the request body",
      });
    }
    const Data = await fetchData(keywords);
    res.json(Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/fetchData/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const userSearchData = await user_search.findById(id);

    if (!userSearchData) {
      return res.status(404).json({ error: "User search data not found" });
    }
    res.json(userSearchData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    // Fetch only specific properties from user_search documents
    const userSearchDocuments = await user_search.find(
      {},
      "searched_keywords Total_Sentiments createdAt"
    );

    // Send the user_search documents to the frontend
    res.json(userSearchDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
