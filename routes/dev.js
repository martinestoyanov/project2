const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("./dev/devShowAll");
});

router.get("/details", (req, res, next) => {
  res.render("./dev/devDetails");
});

module.exports = router;
