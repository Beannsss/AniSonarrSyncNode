const fs = require('fs')
const {BUCKET} = require('./auth')
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(BUCKET)
const LISTPATH = 'list.json'

const downloadAsJson = async (callback) => {
    const file = await bucket
      .file(LISTPATH)
      .download();
    let list = JSON.parse(file[0].toString('utf8'));
    callback(list)
  }

function writeUserListToFile(data) {
    fs.writeFileSync('list.json', JSON.stringify(data), err => {
        if (err) {
            console.log('ERROR');
            console.error(err);
            return
        }
    })
    bucket.upload('list.json')
}

function writePrettyJSON(obj, fileName) {
    // console.log(JSON.stringify(obj));
    fs.writeFile('jsonRef/' + fileName + '.json', JSON.stringify(obj, null, 2), err => {
        if (err) {
            console.error(err);
            return
        }
    })
}

module.exports = {
    // getUserListFromFile: getUserListFromFile,
    downloadAsJson: downloadAsJson,
    writeUserListToFile: writeUserListToFile,
    writePrettyJSON: writePrettyJSON
}