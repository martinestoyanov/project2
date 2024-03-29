const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  title: String,
  content: String,
  reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
  // author: { type: Schema.Types.ObjectId, ref: "User" },
  author: { type: String },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
