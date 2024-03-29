const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const animeSchema = new Schema({
  title: String,

  image_url: String,

  genre: {
    type: String,
    enum: [
      "Action",
      "Adventure",
      "Comedy",
      "Fantasy",
      "Magic",
      "Mystery",
      "Shounen",
         ],
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

  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Anime", animeSchema);
