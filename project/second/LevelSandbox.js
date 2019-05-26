/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key)
                .then(value => {
                    console.log('Value = ' + value);
                    resolve(value)
                })
                .catch(err => {
                    console.log('Not found!');
                    reject(err)
                })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.put(key, value)
                .then(() => resolve())
                .catch((err) => {
                    console.log('Block ' + key + ' submission failed');
                    reject(err)
                })
        });
    }

    // Add data to levelDB with value
    addDataToLevelDB(value) {
        let self = this;
        return new Promise(function(resolve, reject){
            let index = 0;
            self.db.createReadStream()
                .on('data', function () {
                    index += 1;
                })
                .on('error', function (err) {
                    console.log('Unable to read data stream!', err);
                    reject(err)
                })
                .on('close', function () {
                    console.log('Block #' + i);
                    addLevelDBData(index, value);
                });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            let cnt = 0;
            self.db.createReadStream()
                .on('data', function () {
                    cnt += 1;
                })
                .on('error', function (err) {
                    console.log('Unable to read data stream!', err);
                    reject(err)
                })
                .on('close', function () {
                    resolve(cnt);
                });
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;
