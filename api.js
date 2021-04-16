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
        // req.top10all[genreMapKeys[index]].data.results = result
        console.log(
          result.data.results[0].mal_id,
          result.data.results[1].mal_id,
          result.data.results[2].mal_id,
          result.data.results[25].mal_id
        );
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(req.top10all);
    index++;
    if (index >= genreMapKeys.length) {
      clearInterval(intervalID);
    }
  }, 2000);
  // while (index < genreMapKeys.length) {

  // for (let [genre, number] of Object.entries(genreMap)) {

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
