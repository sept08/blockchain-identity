const level = require('level');
const base64 = require('base-64');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
addLevelDBData = (key, data) => {
    data = JSON.parse(data);
    if(data.body.star) {
        // data.body.star.storyDecoded = data.body.star.story; // story message shouldn't be persist
        data.body.star.story = base64.encode(data.body.star.story);
    }
    data = JSON.stringify(data);
    return new Promise(function (resolve, reject) {
        db.put(key, data, (error) => {
            if (error) {
                reject('Block ' + key + ' submission failed', error);
            } else {
                resolve(data);
            }
        });
    });
};

// Get data from levelDB with key
exports.getLevelDBData = function (key) {
    return new Promise(function (resolve, reject) {
        db.get(key, function (error, response) {
            if (error) {
                reject('Not found!', error);
            } else {
                resolve(JSON.parse(response));
            }
        });
    });
};

// Add data to levelDB with value
exports.addDataToLevelDB = function (data) {
    return new Promise(function (resolve, reject) {
        let height = 0;
        db.createReadStream()
            .on('data', function () {
                height++;
            })
            .on('error', function (error) {
                reject('Unable to read data stream!', error);
            })
            .on('close', function () {
                addLevelDBData(height, data).then((res) => {
                    resolve(JSON.parse(res))
                }).catch((error) => {
                    reject('Block ' + key + ' submission failed', error);
                });
            });
    });
};

// Get the height of the block
exports.getBlockHeight = function () {
    return new Promise(function (resolve, reject) {
        let height = 0;
        db.createReadStream()
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
};

// Get the block data
exports.getBlock = function (blockHeight) {
    return new Promise(function (resolve, reject) {
        db.get(blockHeight, function (err, value) {
            if (err) {
                reject('Not found!', err);
            } else {
                resolve(JSON.parse(value));
            }
        });
    });
};

exports.getBlocksByAddress = (walletAddress) => new Promise((resolve, reject) => {
    let height = 0;
    const data = [];
    db.createReadStream()
        .on('data', (block) => {
            block = JSON.parse(block.value);
            if(block.body.address === walletAddress) {
                data.push(block);
            }
            height++;
        })
        .on('error', (error) => reject('Unable to read data stream!', error))
        .on('close', () => resolve(data));
});

exports.getBlockByHash = (blockHash) => new Promise((resolve, reject) => {
    let height = 0;
    db.createReadStream()
        .on('data', (block) => {
            block = JSON.parse(block.value);
            if(block.hash === blockHash) {
                resolve(block);
            }
            height++;
        })
        .on('error', (error) => reject('Unable to read data stream!', error))
        .on('close', () => reject('Not found'));
});
