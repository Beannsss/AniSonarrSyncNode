const { SONARRAPIKEY, ACCESSTOKEN, USERNAME, SONARRURL } = require('./auth');
const { StringDecoder } = require("string_decoder");
const fetch = require('node-fetch');
const fs = require('fs')
const queries = require('./queries');
const { isTypeSystemDefinitionNode } = require('graphql');
const { title } = require('process');

const SONARRLOOKUP = 'series/lookup'
var newAnilistShows = []
var tags = []
var userListResponse = '';

function handleAnilistResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json.data : Promise.reject(json.data);
    });
}

function handleSonarrResponse(response) {
  return response.json().then(function (json) {
    //   console.log(json)
      return response.ok ? json : Promise.reject(json.data);
  });
}

function handleError(error) {
    console.log(error);
}

function writePrettyJSON(obj) {
    fs.writeFile('./list.json', JSON.stringify(obj), err => {
        if (err) {
            console.error(err);
            return
        }
    })
}

//Anilist
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


//SONARR
function test(callback) {
    //probably want to change this
    fetch(SONARRURL + 'series?apikey=' + SONARRAPIKEY, callback).then(handleSonarrResponse)
        .then(callback)
        .catch(handleError);
}

function getTVDBIDForNewShow(item, callback) {
    let title = ''
    if(item.media.title.english)
        title = item.media.title.english
    else
        title = item.media.title.romaji
    title = title + ' (' + item.media.startDate.year +')'
    sonnarrQuery(SONARRLOOKUP + '?term=' + encodeURIComponent(title), 'GET', null, callback)
}

function sonnarrQuery(endpoint, reqType, params, callback) {
    let headers = {
        'X-Api-Key': SONARRAPIKEY
    }
    let options = {
        headers: headers,
        method: reqType,
    }
    if(params)
        options.body = params
    fetch(SONARRURL + endpoint, options).then(handleSonarrResponse).then(callback).catch(handleError)
}

// fetchUserAnilist()
module.exports = {
    fetchUserAnilist: fetchUserAnilist,
    searchByName: searchByName,
    test: test,
    setCustomLists: setCustomLists,
    getTVDBIDForNewShow: getTVDBIDForNewShow,

}
