const router = require("express").Router();
const api = require("../api");

/* GET home page */
router.get("/", api.top10each, (req, res, next) => {
  res.send(req.top10all);
  // console.log(req.top10all);
  // res.render("index", {
    // session: req.session,
  // });
});
module.exports = router;
