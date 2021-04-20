const axios = require("axios");
const HomeCache = require("./models/HomeCache.model");

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
  });
};

// const top = async (req, res, next) => {
//   const data = await api
//     .get(`/top/anime/`)
//     .then((result) => {
//       req.result = result.data;
//     })
//     .catch((error) => {
//       req.result = error;
//     });
//   next();
// };

// const workingTopAll = async (req, res, next) => {
//   req.top10all = {};
//   let genreMapKeys = Object.keys(genreMap);
//   let index = 0;

//   const home = async (() => {
//     for (i = 0; i <= genreMapKeys.length; i++){
//               const x = await checkCache();

//   })

// }

// const intervalID = setInterval(() => {
//   const genreCode = genreMap[genreMapKeys[index]];
//   let getUrl =
//     "/search/anime?q=&page=1&genre=" +
//     genreCode +
//     "&order_by=score&sort=desc";

//   index++;
//   if (index >= genreMapKeys.length) {
//     clearInterval(intervalID);
//     next();
//   }
// }, 2000);
// };

module.exports.topAll = topAll;
module.exports.search = search;
module.exports.details = details;
// module.exports.top = top;
module.exports.detailsGet = detailsGet;

// async function checkCache() {
//   HomeCache.findOne({ genreCode: { $eq: genreCode } }).then((result) => {
//     console.log("Query GC:", genreCode);
//     if (!result) {
//       console.log("Nothing in Cache, updating");
//     } else {
//       console.log("Cache found!");
//     }
//   });
// }
// async function updateCache() {
//   api
//     .get(getUrl)
//     .then((result) => {
//       HomeCache.create({
//         etag: result.headers.etag,
//         genreCode: genreMap[genreMapKeys[index]],
//         results: result.data.results,
//       }).then((result) => {
//         console.log(result.etag);
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
// async function showCache() {
//   console.log(result.etag);
//   // req.top10all[genreMapKeys[index]] = result.results;
// }

// function updateCache() {
//   api
//     .get(getUrl)
//     .then((result) => {
//       HomeCache.create({
//         etag: result.headers.etag,
//         genreCode: genreMap[genreMapKeys[index]],
//         results: result.data.results,
//       }).then((result) => {
//         console.log(result.etag);
//       });
//       // console.log(result.data.request_hash);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function showCache(result) {
//   console.log(result.etag);
//   // req.top10all[genreMapKeys[index]] = result.results;
// }

// api
//   .get(getUrl)
//   .then((result) => {
//     console.log(result.headers.etag);
//     req.top10all[genreMapKeys[index]] = result.data.results;
//   })
//   .catch((err) => {
//     console.log(err);
//   });
