const mongoose = require('mongoose');

const connectMongo = (url) => {
  mongoose
    .connect(url)
  .then(() => console.log("Mongo Connected"))
  .catch((e) => console.log(e));
}
module.exports = {connectMongo}