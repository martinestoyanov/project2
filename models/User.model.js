const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Username must be in valid form"],
    },
    passwordHash: {
      type: String,
      required: true,
      match: [  /(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}/,
          "Password has to have one Alphabetic char one number or special char",
        ],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
