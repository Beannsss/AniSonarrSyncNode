const api = require('./api')
const files = require('./files')
const { StringDecoder } = require("string_decoder");
const { setCustomLists } = require('./api');
const { writePrettyJSON } = require('./files');

function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

var newAnilistShows = []
var aniList = []
var tvdbSearchItems = []

function syncNewShowsFromAnilist() {
    api.fetchUserAnilist(data => {
        let oldData = files.getUserListFromFile()
        aniList = data
        if (oldData) {
            // console.log(JSON.stringify(oldData));
            let oldShows = getItemsFromList(oldData)
            let newShows = getItemsFromList(data)

            newShows.forEach(anilistItem => {
                let found = false
                oldShows.forEach(anilistItem2 => {
                    if (anilistItem.id == anilistItem2.id)
                        found = true
                })
                if (!found)
                    newAnilistShows.push(anilistItem)
            })

            console.log(JSON.stringify(newAnilistShows));
            getShowsFromTVDBAndAdd()


        }
        files.writeUserListToFile(aniList)
    })
}

var sonarrShows = []

function checkAndAddShow(anilistItem, tvdbSearchItem) {
    let checkSonarrListAndAdd = data => {
        console.log(data);
        sonarrShows = data
        if (anilistItem.customLists.shame)
            return
        let sonarrShow
        let found = false
        sonarrShows.forEach(sonarrListItem => {
            if (sonarrListItem.tvdbId == tvdbSearchItem.tvdbId) {
                if (sonarrListItem.tvdbId == 397774) {
                    console.log(sonarrListItem.tvdbId);
                    console.log(tvdbSearchItem.tvdbId);
                }
                found = true
                sonarrShow = sonarrListItem
            }
        });
        console.log(found);
        if (found)
            tagShowInSonarr(anilistItem, sonarrShow)
        else
            addShowToSonarr(anilistItem, tvdbSearchItem)

        if (!anilistItem.customLists.Sonarr) {
            let customLists = getCustomListsForSeries(anilistItem)
            customLists.push('Sonarr')
            api.setCustomLists(anilistItem, customLists)
        }
        writePrettyJSON(data, 'sonarrList')
    }

    console.log(sonarrShows.length)
    if (!sonarrShows.length)
        api.fetchSonarrList(checkSonarrListAndAdd)
    else
        checkSonarrListAndAdd(sonarrShows)
}

function tagShowInSonarr(aniListItem, sonarrListItem) {
    console.log("Tagging existing show");
    getTagForShow(aniListItem, tag => {
        if (!sonarrListItem.tags.includes(tag.id))
            api.tagShowInSonarr(sonarrListItem, tag, data => {
                console.log(data)
            })
    })
}

function addShowToSonarr(aniListItem, tvdbSearchItem) {
    console.log("Adding new show");
    getTagForShow(aniListItem, tag => {
        api.addShowToSonarr(tvdbSearchItem, tag, data => {
            console.log(data)
        })
    })
}

var tags = []

function getTagForShow(aniListItem, callback) {
    let season = aniListItem.media.season.toLowerCase()
    let startYear = aniListItem.media.startDate.year
    let tagName = season + startYear

    let searchTags = data => {
        tags.forEach(tag => {
            if (tag.label == tagName)
                callback(tag)
        });
        createTagForShow(tagName, callback)
    }

    if (!tags.length) {
        api.getTagsFromSonarr(searchTags)
    }
    else {
        searchTags(tags)
    }
}

function createTagForShow(label, callback) {
    api.createTagInSonarr(label, callback)
}

function getShowsFromTVDBAndAdd() {
    let tvdbSearchItems = []
    newAnilistShows.forEach(anilistItem => {

        api.getTVDBIDForNewShow(anilistItem, sonarrItems => {
            if (!sonarrItems.length) {
                aniList.pop(anilistItem)
            } else
                for (let sonarrItem of sonarrItems) {
                    if (sonarrItem.genres.includes("Anime")) {
                        checkAndAddShow(anilistItem, sonarrItem)
                        sonarrItems.splice(5)
                        files.writePrettyJSON(sonarrItems, 'tvdbsearch')
                        break;
                    }
                }
        });
    });
}

function getItemsFromList(data) {
    let aniListShows = []
    let aniListShowID = []
    data.MediaListCollection.lists.forEach(list => {
        list.entries.forEach(entry => {
            if (!aniListShowID.includes(entry.id)) {
                aniListShows.push(entry)
                aniListShowID.push(entry.id)
            }
        })
    });
    return aniListShows
}

function getCustomListsForSeries(series) {
    let customLists = [];
    for (const list in series.customLists) {
        if (Object.hasOwnProperty.call(series.customLists, list)) {
            const element = series.customLists[list];
            if (element)
                customLists.push(list);
        }
    }
    return customLists;
}

module.exports.syncNewShowsFromAnilistToSonarr = syncNewShowsFromAnilist