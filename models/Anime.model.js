const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const animeSchema = new Schema({
  
  title: String,

  image_url: String,

  genre: {
    type: String,
    enum: ["Action", "Adventure", "Comedy", "Fantasy", "Magic", "Mystery", "Shounen", "unknown"],
    default: "unknown"
  },

  sypnopsis: {
    type: String,
  },

  airing: Boolean,

  episodes: Number,

  score: Number,

  start_date: Date,
  end_date: Date,

  rated: Number,

  });

module.exports = model("Anime", animeSchema);