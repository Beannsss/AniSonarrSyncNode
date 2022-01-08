const { ACCESSTOKEN } = require("./auth");
const { syncNewShowsFromAnilistToSonarr } = require("./sync");
// const { quickstart } = require('./ds')


// quickstart()
console.log("starting")
syncNewShowsFromAnilistToSonarr();

// console.log(ACCESSTOKEN);
