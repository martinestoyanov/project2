const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.jikan.moe/v3",
  timeout: 10000,
});
const genreMap = {
  action: 1,
  adventure: 2,
  comedy: 4,
  fantasy: 10,
  magic: 16,
  mystery: 7,
  shounen: 27,
};
const search = async (req, res, next) => {
  const data = await api
    .get(`/search/anime?q=${req.body.search}`)
    .then((result) => {
      req.result = result.data;
    })
    .catch((error) => {
      req.result = error;
    });
  next();
};
const details = async (req, _, next) => {
  try {
    const result = await api.get(`/anime/${req.body.mal_id}`);
    req.result = result.data;
  } catch (error) {
    req.result = error;
  }
  next();
};
const detailsGet = async (req, res, next) => {
  const data = await api
    .get(`/anime/${req.params.mal_id}`)
    .then((result) => {
      req.result = result.data;
    })
    .catch((error) => {
      req.result = error;
    });
  next();
};
const top = async (req, res, next) => {
  const data = await api
    .get(`/top/anime/`)
    .then((result) => {
      req.result = result.data;
    })
    .catch((error) => {
      req.result = error;
    });
  next();
};

const topAll = async (req, res, next) => {
  console.log("topAll Begin");
  req.top10all = {};
  let genreMapKeys = Object.keys(genreMap);
  let index = 0;

  const intervalID = setInterval(() => {
    let getUrl =
      "/search/anime?q=&page=1&genre=" +
      genreMap[genreMapKeys[index]] +
      "&order_by=score&sort=desc";
    console.log(getUrl);

    api
      .get(getUrl)
      .then((result) => {
        req.top10all[genreMapKeys[index]] = result.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
    index++;
    if (index >= genreMapKeys.length) {
      clearInterval(intervalID);
      next();
    }
  }, 1500);

  // next();
};

module.exports.topAll = topAll;
module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
module.exports.detailsGet = detailsGet;