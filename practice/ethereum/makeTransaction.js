// Configuration
var Web3 = require("web3");
var EthereumTransaction = require("ethereumjs-tx");
var web3 = new Web3('HTTP://127.0.0.1:7545');

// Set Addresses
var sendingAddress = '0x795B2690769b5303Df4eEf48d1BEf5cCF462068B';
var receivingAddress = '0x90fabB6f857747d997B9A109A5a339F6A143808F';

// Create transaction
var rawTransaction = {
    nonce: 1,
    to: receivingAddress,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 1,
    data: ""
};

// Sign Transaction
var privateKeySender = '0dc163968db3be201f6bca2f1024ebd0d3493fa5ebe06f0e94465cb3fb9cd856';
var privateKeySenderHex = new Buffer(privateKeySender, 'hex');
var transaction = new EthereumTransaction.Transaction(rawTransaction);
transaction.sign(privateKeySenderHex);
var serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction);

