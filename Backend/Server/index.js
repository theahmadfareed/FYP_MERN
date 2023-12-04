const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./models/user");
require("./models/userSearch");
require("./models/newsArticles");
require("./models/redditComments");
const { connectMongo } = require("./connection");
const dataRoutes = require("./routes/fetchData");
const userRoutes = require("./routes/userRoutes");

// Initialize Express instance
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Add Template Engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// Connect with Database
connectMongo(process.env.MONGO_URL);

// Routes
app.get("/root", (req, res) => {
  res.json({ data: "Hello World from Backend!" });
});

app.use("/api", dataRoutes);
app.use("/user", userRoutes);

// Creating Server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
