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
    const cacheResult = await checkCache(genre, id);
    req.top10all[genre] = cacheResult;
  }

  async function checkCache(genre, id) {
    let getUrl =
      "/search/anime?q=&page=1&genre=" + id + "&order_by=score&sort=desc";

    const cacheResult = await HomeCache.findOne({ genreCode: { $eq: id } });

    // console.log("77 What findOne found:", ((cacheResult || {}).etag || "Nothing"));

    await api
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
            { id: { $eq: cacheResult.id } },
            {
              etag: result.headers.etag,
              genre,
              genreCode: id,
              results: result.results,
            },
            { new: true }
          ).then((updatedEntry) => {
            console.log("Entry has been updated!", updatedEntry.etag);
            return updatedEntry;
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
            return newEntry;
          });
        }
      })
      .catch((error) => {
        if (error.response.status == 304) {
          console.log("Cache up to date");
        } else console.log(error.response.status, error.response.statusText);
      });
  }

  async function updateCache() {
    console.log("Ran Update Cache");
    // api
    //   .get(getUrl)
    //   .then((result) => {
    //     HomeCache.create({
    //       etag: result.headers.etag,
    //       genreCode: genreMap[genreMapKeys[index]],
    //       results: result.data.results,
    //     }).then((result) => {
    //       console.log(result.etag);
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  async function appendCache() {
    // console.log("Ran Show Cache");
    // req.top10all[genreMapKeys[index]] = result.results;
  }
};

// next();

module.exports.topAll = topAll;
module.exports.search = search;
module.exports.details = details;
module.exports.top = top;
module.exports.detailsGet = detailsGet;
