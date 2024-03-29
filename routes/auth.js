//Auth Routes

const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { NotExtended } = require("http-errors");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUploader = require("../config/cloudinary.config");
const Review = require("../models/Review.model");

// Signup Routes

router.get("/signup", (req, res) => {
  // res.send("Hello")
  res.render("auth/signup", { title: "Sign up" });
});

router.post("/signup", fileUploader.single("image"), (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      title: "Sign Up",
      errorMessage: "All fields are required",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
        // imageUrl: req.file.path,
      });
    })
    .then((userFromDB) => {
      // console.log(`Newly created user is : ${userFromDB}`);
      req.session.user = userFromDB;
      req.session.user.passwordHash = "";
      // console.log("req.session.user", req.session.user);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either uername or email is already used.",
        });
      } else {
        next(error);
      }
    });
  // console.log('Form Data:', req.body);
});

// Login Routes

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  // console.log("Session", req.session);
  const { username, email, password } = req.body;
  // console.log(req.body);
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        user.passwordHash = "";
        req.session.user = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", async (req, res, next) => {
  // const { username } = req.params;
  // res.send(req.session);
  // res.render("users/user-profile", { user: req.session && req.session.userFromDB });
  // console.log(req.session.user.reviews.populate);
  const user = await User.findById(req.session.user._id);
  const userIdString = req.session.user._id;
  const actualUserId = mongoose.Types.ObjectId(userIdString);

  const happyGIFs = [
    "https://pa1.narvii.com/6937/2ec33a8f91e2b8a872059cb03f4a82039f1aad32r1-500-375_hq.gif",
    "https://pa1.narvii.com/6015/6897c17de8cbfd5f07be3e8da6333050ea79d6e4_hq.gif",
    "https://i.pinimg.com/originals/ab/d7/2e/abd72e8ca2f275b9965fd4d7aa5be2d6.gif",
    "https://giffiles.alphacoders.com/125/125339.gif",
    "https://64.media.tumblr.com/5ae32589c11403aab9afe5c3994ec362/tumblr_njf05s56AK1txim35o1_500.gifv",
    "https://thumbs.gfycat.com/SpiritedGrimHadrosaurus-size_restricted.gif",
    "https://data.whicdn.com/images/100365953/original.gif",
    "http://1.bp.blogspot.com/-OqD_2-GUaf4/VR5bxsKfacI/AAAAAAAAFfI/Ml3NWyB3Cyw/s1600/giphy.gif",
    "https://i.pinimg.com/originals/8b/b4/b1/8bb4b14a035fddf8f69db86c2245a63a.gif",
    "https://data.whicdn.com/images/219868722/original.gif",
  ];

  function randomGIF(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  let happyGIF = randomGIF(happyGIFs);
  const reviews = await Review.find({ author: user._id });
  // reviews.populate;
  console.log("reviews :", reviews, "user :", user);
  res.render("users/user-profile", { user, reviews, happyGIF });
});

// Edit routes
router.get("/userProfile/:id/edit", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.render("users/user-edit", user))
    .catch((err) => next(err));
});

router.post(
  "/userProfile/:id/edit",
  fileUploader.single("image"),
  (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = req.body.existingImage;
    }

    User.findByIdAndUpdate(id, { username, email, imageUrl }, { new: true })
      .then((user) => {
        req.session.user = user;
        res.redirect("/userProfile");
      })
      .catch((err) => next(err));
  }
);

// Lougout route
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
