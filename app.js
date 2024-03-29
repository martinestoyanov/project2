require("dotenv/config");
require("./db");
const express = require("express");
const hbs = require("hbs");
const Review = require("./models/Review.model");
const Comment = require("./models/Comment.model")
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

//Middleware Config
require("./config")(app);
require("./config/session.config")(app);
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));

//hbs Helpers
// hbs.registerHelper("homeSearch", function (reqgenre) {
//   console.log(reqgenre);
//   const genreMap = {
//     action: 1,
//     adventure: 2,
//     comedy: 4,
//     fantasy: 10,
//     magic: 16,
//     mystery: 7,
//     shounen: 27,
//     unknown: 99,
//   };
//   console.log(genreMap[reqgenre]);
// });

//Default title
app.locals.title = `Welcome to the Animation Station!`;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// global variable. create custom middleware to access req object and pass to layout
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

//Route Handling

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const dev = require("./routes/dev");
app.use("/dev/", dev);

const reviews = require("./routes/reviews");
app.use("/reviews/", reviews);

// app.get("/reviews", (req, res) => {
//   Review.find()
//     .then((reviews) => {
//       res.render("reviews-index", { reviews: reviews });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });


// // NEW
// app.get("/reviews/new", (req, res) => {
//   res.render("reviews-new", { title: "New Review" });
// });

// // CREATE
// app.post("/reviews", (req, res) => {
//   console.log(req.body);
//   Review.create({...req.body, author: req.session.user._id })
//     .then((review) => {
//       console.log(review);
//       res.redirect(`/reviews/${review._id}`); // Redirect to reviews/:id
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// // SHOW
// // app.get("/reviews/:id", (req, res) => {
// //   Review.findById(req.params.id)
// //     .then((review) => {
// //       res.render("reviews-show", { review: review });
// //     })
// //     .catch((err) => {
// //       console.log(err.message);
// //     });
// // });

// // EDIT
// app.get("/reviews/:id/edit", (req, res) => {
//   Review.findById(req.params.id, function (err, review) {
//     res.render("reviews-edit", { review: review });
//   });
// });

// // UPDATE
// app.put("/reviews/:id", (req, res) => {
//   Review.findByIdAndUpdate(req.params.id, req.body)
//     .then((review) => {
//       res.redirect(`/reviews/${review._id}`);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// // DELETE
// app.delete("/reviews/:id", function (req, res) {
//   console.log("DELETE review");
//   Review.findByIdAndRemove(req.params.id)
//     .then((review) => {
//       res.redirect("/reviews");
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// //  // NEW Comment
// //  app.post('/reviews/comments', (req, res) => {
// //   res.send('reviews comment')
// // });

// CREATE Comment
app.post('/reviews/comments', (req, res) => {
  Comment.create(req.body).then((comment) => {
    console.log(comment)
    Review.findByIdAndUpdate(req.body.reviewId, { $push: {comments: comment._id }}).then(review => {
      res.redirect(`/reviews/${req.body.reviewId}`);
    })
  }).catch((err) => {
    console.log(err.message);
  });
});

// // SHOW
// app.get('/reviews/:id', (req, res) => {
//   // find review
//   Review.findById(req.params.id).then(review => {
//     // fetch its comments
//     Comment.find({ reviewId: req.params.id }).then(comments => {
//       // respond with the template with both values
//       console.log('148', comments)
//       res.render('reviews-show', { review, comments: review.comments })
//     })
//   }).catch((err) => {
//     // catch errors
//     console.log(err.message)
//   });
// });



//Error Handling
require("./error-handling")(app);

module.exports = app;
