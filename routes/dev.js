const router = require("express").Router();
const api = require("../api");

router.get("/", (req, res, next) => {
  res.render("./dev/devSearch");
});


router.post("/details", api.details, (req, res, next) => {
  // res.render("./dev/devDetails");
  res.send(req.result);
});


router.post("/", api.search, (req, res, next) => {
  res.send(req.result);
});

module.exports = router;
