require("dotenv/config");
require("./db");
const express = require("express");
const hbs = require("hbs");
const app = express();

//Middleware Config
require("./config")(app);

//Default title
app.locals.title = `This is the title`;

//Route Handling

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

//Error Handling
require("./error-handling")(app);

module.exports = app;
