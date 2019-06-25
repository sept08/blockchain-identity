// 引入web3库
const Web3 = require('web3');
// connect web3 to ganache
const web3 = new Web3('HTTP://127.0.0.1:7545');
// get accounts
web3.eth.getAccounts().then(accounts => console.log(accounts));
