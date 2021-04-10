const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.jikan.moe/v3",
  timeout: 10000,
});

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

// const detailsGet = async (req, res, next) => {
//   const data = await api
//     .get(`/anime/${req.param.mal_id}`)
//     .then((result) => {
//       req.result = result.data;
//     })
//     .catch((error) => {
//       req.result = error;
//     });
//   next();
// };

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

module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
// module.exports.detailsGet = detailsGet;