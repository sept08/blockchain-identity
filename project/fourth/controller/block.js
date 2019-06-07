const SHA256 = require('crypto-js/sha256');
const blockchain = require('../utils/blockchain');
const validation = require('../utils/validation');

class Block {
    constructor(data) {
        this.hash = "";
        this.height = 0;
        this.body = data;
        this.time = new Date().getTime().toString().slice(0, -3);
        this.previousBlockHash = "";
    }
}

exports.createBlock = (req, res) => {
    const { address, star } = req.body;
    if (address && star) {
        if (star.dec && star.ra) {
            if (star.story.split(' ').length <= 250) {
                let block = new Block(req.body);
                blockchain.getBlockHeight().then((height) => {
                    if (height === 0) {
                        let firstBlock = new Block("First block in the chain - Genesis block");
                        firstBlock.hash = SHA256(JSON.stringify(firstBlock)).toString();
                        blockchain.addDataToLevelDB(JSON.stringify(firstBlock)).then(() => {
                            validation.getLevelDBData(address).then((value) => {
                                if (value.messageSignature) {
                                    block.previousBlockHash = firstBlock.hash;
                                    block.height = height + 1;
                                    block.hash = SHA256(JSON.stringify(block)).toString();
                                    blockchain.addDataToLevelDB(JSON.stringify(block)).then((data) => {
                                        validation.invalidate(address);
                                        res.send(data);
                                    }).catch((error) => {
                                        res.send(error);
                                    });
                                } else {
                                    res.send({"error": "Signature is not valid"});
                                }
                            }).catch((error) => {
                                res.send(error);
                            })
                        }).catch((error) => {
                            res.send(error);
                        });
                    } else {
                        blockchain.getBlock(height - 1).then((prevBlock) => {
                            // validate the address
                            validation.getLevelDBData(address).then((value) => {
                                if (value.messageSignature) {
                                    block.previousBlockHash = prevBlock.hash;
                                    block.height = height;
                                    block.hash = SHA256(JSON.stringify(block)).toString();
                                    blockchain.addDataToLevelDB(JSON.stringify(block)).then((data) => {
                                        validation.invalidate(address);
                                        res.send(data);
                                    }).catch((error) => {
                                        res.send(error);
                                    });
                                } else {
                                    res.send({"error": "Signature is not valid"});
                                }
                            }).catch((error) => {
                                res.send(error);
                            })
                        }).catch((error) => {
                            res.send(error);
                        });
                    }
                }).catch((error) => {
                    res.send(error);
                });
            } else {
                res.send({"error": "star_story data for star is limited to 250 words"});
            }
        } else {
            res.send({"error": "right_ascension and declination data for star is required."});
        }
    } else {
        res.send({"error": "Wallet address and star data is required."});
    }
};

exports.blockDetails = function(req, res) {
    let blockId = req.params.blockId;
    blockchain.getBlock(blockId).then((block) => {
        res.send(block);
    }).catch((error) => {
        res.send(error);
    });
};

exports.blockDetailsByAddress = (req, res) => {
    const walletAddress = req.params.walletAddress;
    blockchain.getBlocksByAddress(walletAddress).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send({"error": error});
    });
};

exports.blockDetailsByBlockHash = (req, res) => {
    const blockHash = req.params.blockHash;
    blockchain.getBlockByHash(blockHash).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send({"error": error});
    });
};
