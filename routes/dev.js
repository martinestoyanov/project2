const router = require("express").Router();
const api = require("../api");
const Review = require("../models/Review.model");

router.get("/", (req, res, next) => {
  res.render("./dev/devSearch");
});

router.post("/search", api.search, (req, res, next) => {
  // console.log(req.result);
  res.render("./dev/devShowAll", { data: req.result.results });
});

router.get("/top", api.top, (req, res, next) => {
  // res.render("./dev/devSearch");
  res.send(req.result);
});

router.post("/details", api.details, (req, res, next) => {
  res.render("./dev/devDetails",req.result);
  // res.send(req.result);
});
router.get("/detailsGet/:mal_id", api.detailsGet, (req, res, next) => {
  Review.find({ mal_id: { $eq: req.params.mal_id } }).then((allReviews) => {
    res.render("./dev/devDetails", { result: req.result, reviews: allReviews });
      })
  // res.send(req.result);
});

router.post("/detailsJson", api.details, (req, res, next) => {
  // res.render("./dev/devDetails",req.result);
  res.send(req.result);
});

router.post("/", api.search, (req, res, next) => {
  res.send(req.result);
});

module.exports = router;
