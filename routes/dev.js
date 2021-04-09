const router = require("express").Router();
const api = require("../api");

router.get("/", (req, res, next) => {
  res.render("./dev/devSearch");
});

router.post("/", api.search, (req, res, next) => {
  res.send(req.result);
});

router.get("/details", (req, res, next) => {
  res.render("./dev/devDetails");
});

module.exports = router;
