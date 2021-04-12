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

const details = async (req, res, next) => {
  const data = await api
    .get(`/anime/${req.body.mal_id}`)
    .then((result) => {
      req.result = result.data;
    })
    .catch((error) => {
      req.result = error;
    });
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

//WIP to try to query multiple searches based on genre and sort by rating.
const top10each = async (req, res, next) => {
  let top10eachobj = {};
  for (const [genre, number] of Object.entries(genreMap)) {
    const data = await api
      .get(`/search/anime?q=&page=1?genre=${number}&order_by=score&sort=desc`)
      .then((result) => {
        top10eachobj[genre] = result.data.results;
        // console.log(top10eachobj[genre].data.results.length);
      })
      .catch((error) => {
        req.result = error;
      });
  }
  // console.log(top10eachobj)
  for (const [genre, arrayOfShows] of Object.entries(top10eachobj)) {
    top10eachobj[genre] = arrayOfShows.splice(40);
    console.log(genre, top10eachobj[genre].length);
  }

  req.top10all = top10eachobj;
  next();
};

module.exports.top10each = top10each;
module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
module.exports.detailsGet = detailsGet;
