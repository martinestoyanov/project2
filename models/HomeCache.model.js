const { Schema, model } = require("mongoose");

const homeCacheSchema = new Schema({
  etag: String,
  genre: String,
  genreCode: {  type : Number },
  results: [],
});

const HomeCache = model("HomeCache", homeCacheSchema);
module.exports = HomeCache;
