const { SONARRAPIKEY, ACCESSTOKEN, USERNAME, SONARRURL } = require('./auth');
const { StringDecoder } = require("string_decoder");
const fetch = require('node-fetch');
const fs = require('fs')
const queries = require('./queries')


var newAnilistShows = []
var tags = []
var userListResponse = '';
const headers = {
    'X-Api-Key': SONARRAPIKEY
}

function handleAnilistResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json.data : Promise.reject(json.data);
    });
}

function handleSonarrResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json.data);
  });
}

function handleError(error) {
    console.error(error);
}

function writePrettyJSON(obj) {
    fs.writeFile('./list.json', JSON.stringify(obj), err => {
        if (err) {
            console.error(err);
            return
        }
    })
}

//Requests
function anilistQuery(query, variables, callback) {
    let url = "https://graphql.anilist.co",
        options = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + ACCESSTOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    // Make the HTTP Api request
    fetch(url, options).then(handleAnilistResponse)
        .then(callback)
        .catch(handleError);
}

function anilistMutation(query, variables, callback) {
    let url = "https://graphql.anilist.co",
        options = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + ACCESSTOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    // Make the HTTP Api request
    fetch(url, options).then(handleAnilistResponse)
        .then(callback)
        .catch(handleError);
}

// functions
function fetchUserAnilist(callback) {
    let query = queries.getUserList, variables = { username: USERNAME };
    anilistQuery(query, variables, callback)
}

function searchByName(showName, callback, page = 1, perPage = 5) {
    let query = queries.searchByName, variables = { search: showName, page: page, perPage: perPage }
    anilistQuery(query, variables, callback)
}

function setCustomLists(mediaId, customLists, callback) {
    if (!Array.isArray(customLists) || !customLists.length) {
      console.log("No Custom Lists Found, Refusing Update");
    }
    let query = queries.saveCustomLists, variables = { mediaId: mediaId, customLists: customLists };
    anilistMutation(query, variables, callback);
}

function test(callback) {
    //probably want to change this
    fetch(SONARRURL + 'series?apikey=' + SONARRAPIKEY, callback).then(handleSonarrResponse)
        .then(callback)
        .catch(handleError);
}

// fetchUserAnilist()
module.exports = {
    fetchUserAnilist: fetchUserAnilist,
    searchByName: searchByName,
    test: test,
    setCustomLists: setCustomLists,
}
