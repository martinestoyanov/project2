const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const animeSchema = new Schema({
  
  title: String,

  sypnopsis: {
    type: String,
  },

  airing: Boolean,

  episodes: String,

  movies: {
    type: [Schema.Types.ObjectId],
    ref: "Movie",
  },
});

module.exports = model("Anime", animeSchema);