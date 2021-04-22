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
  req.top10all = {};

  for (const [genre, id] of Object.entries(genreMap)) {
    console.log("New Loop", genre);
    const cacheCheckResult = await checkCache(genre, id);
    // console.log("cacheCheckResult:", cacheCheckResult);
    req.top10all[genre] = cacheCheckResult;
  }

  async function checkCache(genre, id) {
    let getUrl =
      "/search/anime?q=&page=1&genre=" + id + "&order_by=score&sort=desc";

    const cacheResult = await HomeCache.findOne({ genreCode: { $eq: id } });

    // console.log("77 What findOne found:", ((cacheResult || {}).etag || "Nothing"));

    const apiResult = await api
      .get(getUrl, {
        headers: {
          "If-None-Match": (cacheResult || {}).etag || "",
        },
      })

      .then((result) => {
        if (result.status == 200 && cacheResult) {
          console.log(
            "New info available and entry found, updating entry now."
          );
          HomeCache.findOneAndUpdate(
            { genreCode: { $eq: id } },
            {
              etag: result.headers.etag,
              genre,
              genreCode: id,
              results: result.data.results,
            },
            { new: true }
          ).then((updatedEntry) => {
            console.log("Entry has been updated!", updatedEntry.etag);
            return updatedEntry.results;
          });
        } else if (result.status == 200 && !cacheResult) {
          console.log(
            "No entry found but data available, creating entry now etag:",
            result.headers.etag,
            "Entries length:",
            result.data.results.length
          );

          return HomeCache.create({
            etag: result.headers.etag,
            genre,
            genreCode: id,
            results: result.data.results,
          }).then((newEntry) => {
            console.log("Entry has been created!", newEntry._id);
            return newEntry.results;
          });
        }
      })
      .catch((error) => {
        if (error.response.status == 304) {
          console.log("Cache up to date");
          return cacheResult.results;
        } else console.log(error.response.status, error.response.statusText);
      });
    return apiResult;
  }

  // console.log(req.top10all);
  next();
};


module.exports.topAll = topAll;
module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
module.exports.detailsGet = detailsGet;
