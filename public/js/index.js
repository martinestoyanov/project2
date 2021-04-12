let rand = Math.floor(Math.random() * 10);

const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.jikan.moe/v3",
  timeout: 10000,
});

let homepageBody = document.getElementById("home-body").innerHTML;
const genreMap = {
  action: 1,
  adventure: 2,
  comedy: 4,
  fantasy: 10,
  magic: 16,
  mystery: 7,
  shounen: 27,
  unknown: 99,
};

window.addEventListener("load", () => {
  for (const [genre, number] of Object.entries(genreMap)) {
    
   }

});
