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
    getLevelDBData(key) {
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

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            let height = 0;
            self.db.createReadStream()
                .on('data', function () {
                    height++;
                })
                .on('error', function (error) {
                    reject('Unable to read data stream!', error);
                })
                .on('close', function () {
                    resolve(height);
                });
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;
