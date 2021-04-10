const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    score: {
      type: Number,
      min: [1, 'Rating cannot be below 1.0'],
      max: [10, 'Rating cannot be above 10.0']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author']
    },
    anime: {
      type: mongoose.Schema.ObjectId,
      ref: 'Anime',
      required: [true, 'Review must belong to a anime']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
