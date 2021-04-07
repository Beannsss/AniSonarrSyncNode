const api = require('./api')
const fs = require('fs')

function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
  }

// api.fetchUserAnilist(data => {
//     // prettyJSON(data);

//     data.MediaListCollection.lists.forEach(list => {
//         list.entries.splice(1)
//     });
//     writePrettyJSON(data, 'anilist')
// });



function writePrettyJSON(obj, fileName) {
    fs.writeFile('./SonarrAniSyncNode/jsonRef/' + fileName +'.json', JSON.stringify(obj, null, 2), err => {
        if (err) {
            console.error(err);
            return
        }
    })
}

api.test(data => {
    let printData = data;
    printData.splice(5)
    writePrettyJSON(printData, "sonarrList");
})


// api.searchByName('Space', data => {
//     writePrettyJSON(data, 'aniListSearch')
// },1, 1)

function getCustomListsForSeries(series) {
    let customLists = [];
    for (const list in spaceDandy.customLists) {
        if (Object.hasOwnProperty.call(spaceDandy.customLists, list)) {
            const element = spaceDandy.customLists[list];
            if(element)
                customLists.push(list);
        }
    }   
    return customLists;
}
// customLists.push('Test')

// // customLists.Test = true
// api.setCustomLists(mediaId=20057, customLists=customLists)