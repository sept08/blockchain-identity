const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(data){
        this.id = 0;
        this.nonce = 144444;
        this.body = data;
        this.hash = "";
    }

    /**
     * Step 1. Implement `generateHash()`
     * method that return the `self` block with the hash.
     *
     * Create a Promise that resolve with `self` after you create
     * the hash of the object and assigned to the hash property `self.hash = ...`
     */
    //
    generateHash() {
        // Use this to create a temporary reference of the class object
        let self = this;
        //Implement your code here
        return new Promise((resolve, reject) => {
            this.hash = SHA256(JSON.stringify(this))
            resolve(this)
        })
    }
}

const block = new Block("Test Block");

// Generating the block hash
block.generateHash().then((result) => {
    console.log(`Block Hash: ${result.hash}`);
    console.log(`Block: ${JSON.stringify(result)}`);
}).catch((error) => {console.log(error)});
