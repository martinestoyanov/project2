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
const topAll = async (req, res, next) => {
  req.top10all = {};
  for (let [genre, number] of Object.entries(genreMap)) {
    let getUrl =
      "/search/anime?q=&page=1?genre=" + number + "&order_by=score&sort=desc";
    req.top10all[genre] = api.get(getUrl).catch((err) => {
      console.log(err);
    });

    // let getLoop = async function () {
    //   let getUrl =
    //     "/search/anime?q=&page=1?genre=" + number + "&order_by=score&sort=desc";
    //   console.log(getUrl);

    // api
    //   .get(getUrl)
    //   .then((result) => {
    //     req.top10all[genre] = result.data.results;
    // console.log(req.top10all);
    // console.log(req.top10all[genre].data.results.length);
    // console.log("Loop Done");
    // })
    // .catch((error) => {
    // req.result = error;
    // });
  }
  // console.log(req.)
  // getLoop();

  next();
};
// req.top10all = top10eachobj;
module.exports.topAll = topAll;
module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
module.exports.detailsGet = detailsGet;
