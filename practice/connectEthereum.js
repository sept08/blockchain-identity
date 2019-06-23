// 引入web3库
const Web3 = require('web3');
// Infura的访问地址
const url = 'mainnet.infura.io/v3/8cb49051335e4863a1c16a0cb1d02d91';
// 初始化访问Infura上远程以太坊网络的web3实例
const web3 = new Web3(`https://${url}`);
// 以太坊账户地址
const address = '0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67';
// 查询账户中的以太坊余额
web3.eth.getBalance(address, (err, bal) => {
    if (err) {
        console.log('balance', bal)
    } else {
        console.log('err', err)
    }
});
