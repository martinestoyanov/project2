const session = require("express-session");
const MongoStore = require("connect-mongo");
const { options } = require("../app");

const sessionFn = (app) => {
  app.use(
    session({
      secret: "anime",
      cookie: {
        httpOnly: true,
        maxAge: 60000,
      },
      store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24, // 60 sec * 60 min * 24 hrs = 1 day
      }),
    })
  );
};

module.exports = sessionFn;
