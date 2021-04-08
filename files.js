const fs = require('fs')

const LISTPATH = 'list.json'
function getUserListFromFile() {
    if (fs.existsSync(LISTPATH))
        return JSON.parse(fs.readFileSync(LISTPATH))
    else
        return false
}

function writeUserListToFile(data) {
    fs.writeFileSync('list.json', JSON.stringify(data), err => {
        if (err) {
            console.log('ERROR');
            console.error(err);
            return
        }
    })
}

function writePrettyJSON(obj, fileName) {
    // console.log(JSON.stringify(obj));
    fs.writeFile('./jsonRef/' + fileName + '.json', JSON.stringify(obj, null, 2), err => {
        if (err) {
            console.error(err);
            return
        }
    })
}

module.exports = {
    getUserListFromFile: getUserListFromFile,
    writeUserListToFile: writeUserListToFile,
    writePrettyJSON: writePrettyJSON
}