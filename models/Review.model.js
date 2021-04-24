const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    title: String,

    description: String,

    animeTitle: String,

    score: Number,

    author: { type: Schema.Types.ObjectId, ref: "User" },

    mal_id: Number,

    // get rid of me
    // comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    //   user: {
    //     // type: ObjectId,
    //     ref: 'User',
    //     required: [true, 'Review must have an author']
    //   },
    //   anime: {
    //     // type: ObjectId,
    //     ref: 'Anime',
    //     required: [true, 'Review must belong to a anime']
    //   }
  },

  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
