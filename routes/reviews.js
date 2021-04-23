const router = require("express").Router();
const Review = require("../models/Review.model");
const Comment = require("../models/Comment.model");

router.get("/", (req, res) => {
  console.log("Accessed Reviews Route");
  Review.find()
    .then((reviews) => {
      res.render("./reviews/reviews-index", { reviews: reviews });
    })
    .catch((err) => {
      console.log(err);
    });
});

// NEW
router.get("/new", (req, res) => {
  res.render("./reviews/reviews-new", { title: "New Review" });
});

// CREATE
router.post("/", (req, res) => {
  console.log(req.body);
  Review.create({ ...req.body, author: req.session.user._id })
    .then((review) => {
      console.log(review);
      res.redirect(`/reviews/${review._id}`); // Redirect to reviews/:id
    })
    .catch((err) => {
      console.log(err.message);
    });
});


// EDIT
router.get("/:id/edit", (req, res) => {
  Review.findById(req.params.id, function (err, review) {
    res.render("./reviews/reviews-edit", { review: review });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  Review.findByIdAndUpdate(req.params.id, req.body)
  .then((review) => {
    res.redirect(`/reviews/${review._id}`);
  })
  .catch((err) => {
    console.log(err.message);
  });
});
// SHOW
router.get("/:id", (req, res) => {
  Review.findById(req.params.id)
    .then((review) => {
      res.render("./reviews/reviews-show", { review: review });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// DELETE
router.delete("/:id", function (req, res) {
  console.log("DELETE review");
  Review.findByIdAndRemove(req.params.id)
    .then((review) => {
      res.redirect("/reviews");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
