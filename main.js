const { ACCESSTOKEN } = require("./auth");
const { syncNewShowsFromAnilistToSonarr } = require("./sync");

syncNewShowsFromAnilistToSonarr();

// console.log(ACCESSTOKEN);