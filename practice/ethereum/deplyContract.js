var Web3 = require("web3");
var web3 = new Web3('HTTP://127.0.0.1:7545');

web3.eth.getTransactionCount('0x795B2690769b5303Df4eEf48d1BEf5cCF462068B').then(console.log);
