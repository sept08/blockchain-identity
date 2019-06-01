/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        this.getBlockHeight()
            .then(height => {
                if (height === 0) {
                    this.addBlock(new Block.Block("First block in the chain - Genesis block"))
                }
            })
            .catch(error => console.log(error));
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return this.bd.getBlocksCount();
    }

    // Add new block
    addBlock(block) {
        return this.getBlockHeight()
            .then(height => {
                // Block height
                block.height = height;
                // UTC timestamp
                block.time = new Date().getTime().toString().slice(0, -3);
                if (height > 0) {
                    this.getBlock(height - 1)
                        .then(preBlock => {
                            // previous block hash
                            block.previousBlockHash = preBlock.hash;
                            // Block hash with SHA256 using newBlock and converting to a string
                            block.hash = SHA256(JSON.stringify(block)).toString();
                            // Adding block object to chain
                            this.bd.addLevelDBData(height, JSON.stringify(block));
                        })
                        .catch(error => console.log(error));
                } else {
                    // Block hash with SHA256 using newBlock and converting to a string
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    // Adding block object to chain
                    this.bd.addLevelDBData(height, JSON.stringify(block));
                }
            })
            .catch( error => console.log(error));
    }

    // Get Block By Height
    getBlock(height) {
        return this.bd.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // get block hash
        return this.getBlock(height)
            .then(block => {
                const objBlock = JSON.parse(block);
                let blockHash = objBlock.hash;
                // remove block hash to test block integrity
                objBlock.hash = '';
                // generate block hash
                let validBlockHash = SHA256(JSON.stringify(objBlock)).toString();
                objBlock.hash = blockHash;
                // Compare
                if (blockHash === validBlockHash) {
                    return Promise.resolve({isValidBlock: true, block: objBlock});
                } else {
                    console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                    return Promise.resolve({isValidBlock: false, block: objBlock});
                }
            })
    }

    // Validate Blockchain
    validateChain() {
        let errorLog = [];
        let previousHash = '';
        this.getBlockHeight()
            .then(height => {
                for (let i = 0; i < height; i++) {
                    this.getBlock(i)
                        .then(block => this.validateBlock(block.height))
                        .then(({isValidBlock, block}) => {
                            if (!isValidBlock) errorLog.push(i);
                            if (block.previousBlockHash !== previousHash) errorLog.push(i);
                            previousHash = block.hash;
                            if (i === height - 1) {
                                if (errorLog.length > 0) {
                                    console.log(`Block errors = ${errorLog.length}`)
                                    console.log(`Blocks: ${errorLog}`)
                                } else {
                                    console.log('No errors detected')
                                }
                            }
                        })
                }
            })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

}

module.exports.Blockchain = Blockchain;
