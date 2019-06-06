const level = require('level');
const chainDB = './validation';
const db = level(chainDB);

// Add data to levelDB with key/value pair
exports.addLevelDBData = (key, data) => new Promise((resolve, reject) => {
    db.put(key, data, (error) => {
        if (error) {
            reject('Block ' + key + ' submission failed', error);
        } else {
            resolve(data);
        }
    });
});

// Get data from levelDB with key
exports.getLevelDBData = (key) => new Promise((resolve, reject) => {
    db.get(key, (error, response) => {
        if (error) {
            reject('Not found!', error);
        } else {
            resolve(JSON.parse(response));
        }
    });
});
