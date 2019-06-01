const SHA256 = require('crypto-js/sha256');
/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/
class Block {
    constructor(data){
        this.height = '';
        this.timeStamp = '';
        this.data = data;
        this.previousHash = '0x';
        this.hash = '';
    }
}

/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain{
    constructor(){
        // new chain array
        this.chain = [];
        this.addBlock(this.createGenesisBlock());
    }

    createGenesisBlock(){
        return new Block("First block in the chain - Genesis block");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    // addBlock method
    addBlock(newBlock){
        // block height
        newBlock.height = this.chain.length;
        // UTC timestamp
        newBlock.timeStamp = new Date().getTime().toString().slice(0,-3);
        if (this.chain.length > 0) {
            newBlock.previousHash = this.getLatestBlock().hash;
        }
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        this.chain.push(newBlock);
    }
}
