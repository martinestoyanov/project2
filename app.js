require("dotenv/config");
require("./db");
const express = require("express");
const hbs = require("hbs");
const app = express();

//Middleware Config
require("./config")(app);
require("./config/session.config")(app);

//Default title
app.locals.title = `Welcome to the Animation Station!`;

//Route Handling

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const dev = require("./routes/dev");
app.use("/dev/", dev);

//Error Handling
require("./error-handling")(app);

module.exports = app;
