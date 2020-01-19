# Udacity Blockchain Capstone


# Addresses and Links
Contract address (SolnSquareVerifier) : 0xAE344E5a05bd7420281556aA312626c6E210F40f

Contract address (SquareVerifier): 0x455ce4843993df4a28226469a049F1125344304e

OpenSea Marketplace Storefront:  [Storefront](https://rinkeby.opensea.io/assets/real-estate-listing-v5)

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS).

To install, download or clone the repo, then:

`npm install`

1. Start Ganache like below .

`ganache-cli` 

or download and open genache gui

`https://www.trufflesuite.com/ganache`

2. In a separate terminal window,from inside the directory      eth-contracts/ Compile smart contracts:
    `cd eth-contracts`
    `truffle compile`

    This will create the smart contract artifacts in folder build\contracts.

3. Then compile and deploy with truffle.

`truffle migrate --network development --reset --compile-all`

## Testing
  To run truffle tests from inside the directory eth-contracts/:

`truffle test`

## Deployment
 1. Create an account in Infura
 2. Create a project in Infura and get the Address for deploying in Rinkeby test network
 3. Copy the endpoint address and update the Rinkeby network information with the mnemonic and endpoint address in Truffle.js file
 4. Fund the metamask wallet by posting a tweet in https://faucet.rinkeby.io. The post should have the address “ Requesting faucet funds into ……. On the Rinkeby Ethereum test network” Then copy the tweet in the above website and click Give me Ether.
 5. Then deploy it using 
    `truffle deploy --network rinkeby`

    If needed to deploy again with new fresh deployment 
    `truffle migrate --network rinkeby - - reset - -compile-all`

    Deploy to rinkeby and not genache and check in rinkeby.etherscan.io
    `truffle migrate --network rinkeby - - reset - -compile-all`

    Check contract in etherscan
    `https://rinkeby.etherscan.io`

# Create ZK-Snarks Proof using Zokrates
## ZoKrates
#### Step 1: Run ZoKrates in Docker
``` 
docker run -v <path to your project folder>:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash
```


#### Step 2: Compile the program written in ZoKrates DSL
``` 
./zokrates compile -i code/zokrates/code/square/square.code
``` 

#### Step 3: Generate the Trusted Setup
``` 
./zokrates setup
```

#### Step 4: Compute Witness
``` 
./zokrates compute-witness -a 3 9
```

#### Step 5: Generate Proof
```
./zokrates generate-proof
```

#### Step 6: Export Verifier
```  
./zokrates export-verifier
```

#### Step 7: Move all files to code/square
```  
mv -t code/zokrates/code/square out output.code verfier.sol proving.key proof.json witness variables.inf
```

#### Step 8: Create mnemonic seed in .secret file in eth-contracts and add into truffle-config.js
```  
nano .secret
`const mnemonic = fs.readFileSync(".secret").toString().trim();`
```

## Storefront
Create storefronte in OpenSea https://rinkeby.opensea.io/get-listed/step-two

# Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)
