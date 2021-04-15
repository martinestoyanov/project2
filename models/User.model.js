const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/],
    },
    passwordHash: {
      type: String,
      required: true,
      match: [/(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}/],
    },
    imageUrl: {
      type: String,
      default:
        "https://cdn11.bigcommerce.com/s-h28kc1m5v1/images/stencil/1280x1280/products/1598/9367/goku_head_dragon_ball_z__45827.1603471213.jpg?c=2",
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    animes: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
