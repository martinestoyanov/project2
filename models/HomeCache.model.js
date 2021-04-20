const { Schema, model } = require("mongoose");

const homeCacheSchema = new Schema({
  etag: String,
  genre: String,
  genreCode: Number,
  results: [],
});

const HomeCache = model("HomeCache", homeCacheSchema);
module.exports = HomeCache;
