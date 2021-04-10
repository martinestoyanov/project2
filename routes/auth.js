//Auth Routes

const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { NotExtended } = require("http-errors");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");
const session = require("express-session");

// Signup Routes

router.get("/signup", (req, res) => {
  // res.send("Hello")
  res.render("auth/signup", { title: "Sign up" });
});

router.post("/signup", (req, res) => {
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
      });
    })
    .then((userFromDB) => {
      console.log(`Newly created user is : ${userFromDB}`);
      req.session.userFromDB = user;
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
  console.log("Session", req.session);
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
        req.session.user = user;
        user.password = "";
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res, next) => {
  // const { username } = req.params;
  res.render("users/user-profile", { user: req.session && req.session.user });
});

// Lougout route
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
