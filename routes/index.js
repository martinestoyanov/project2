const router = require("express").Router();
const api = require("../api");

/* GET home page */
router.get("/", api.topAll, (req, res, next) => {
  res.send(req.top10all);
  // console.log(req.top10all);
  // res.render("index", {
    // session: req.session,
    // top10: req.top10all,
  // });
});

router.get("/about", (req, res, next) => {
  res.render("./extras/about");
});

router.get("/feedback", (req, res, next) => {
  res.render("./extras/feedback");
});

module.exports = router;
