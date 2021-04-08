const api = require('./api')
const files = require('./files')
const { StringDecoder } = require("string_decoder");

function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

var newAnilistShows = []

function syncNewShowsFromAnilist() {
    api.fetchUserAnilist(data => {
        let oldData = files.getUserListFromFile()
        if (oldData) {
            // console.log(JSON.stringify(oldData));
            let oldShows = getItemsFromList(oldData)
            let newShows = getItemsFromList(data)

            newShows.forEach(item => {
                let found = false
                oldShows.forEach(item2 => {
                    if (item.id == item2.id)
                        found = true
                })
                if (!found)
                    newAnilistShows.push(item)
            })

            console.log(JSON.stringify(newAnilistShows));

            newAnilistShows.forEach(item => {
                api.getTVDBIDForNewShow(item, data => {
                    console.log(JSON.stringify(data))
                });
            });
        }
        // files.writeUserListToFile(data)
    })
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

syncNewShowsFromAnilist()

// api.fetchUserAnilist(data => {
//     prettyJSON(data);

//     data.MediaListCollection.lists.forEach(list => {
//         list.entries.splice(1)
//     });
// files.writePrettyJSON(data, 'anilist')
// files.writeUserListToFile(data)
// });

// api.test(data => {
//     let printData = data;
//     printData.splice(5)
//     files.writePrettyJSON(printData, "sonarrList");
// })


// api.searchByName('Space', data => {
//     files.writePrettyJSON(data, 'aniListSearch')
// },1, 1)

function getCustomListsForSeries(series) {
    let customLists = [];
    for (const list in series.customLists) {
        if (Object.hasOwnProperty.call(spaceDandy.customLists, list)) {
            const element = spaceDandy.customLists[list];
            if (element)
                customLists.push(list);
        }
    }
    return customLists;
}
// customLists.push('Test')

// // customLists.Test = true
// api.setCustomLists(mediaId=20057, customLists=customLists)