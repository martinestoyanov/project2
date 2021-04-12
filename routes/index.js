const router = require("express").Router();
const api = require("../api");

/* GET home page */
router.get("/", (req, res, next) => {
  // res.send("Home!");

  res.render("index", {
    session: req.session,
  });
});
module.exports = router;
