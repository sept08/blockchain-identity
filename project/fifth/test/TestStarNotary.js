const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    const instance = await StarNotary.deployed();
    const [tokenName, tokenSymbol] = await Promise.all([instance.name.call(), instance.symbol.call()]);
    assert.equal(tokenName, 'Star Notary Token');
    assert.equal(tokenSymbol, 'SNT');
});

it('lets 2 users exchange stars', async() => {
    const instance = await StarNotary.deployed()
    // 1. create 2 Stars with different tokenId
    const user1 = accounts[1];
    const user2 = accounts[2];
    const star1 = { tokenId: 6, name: 'Awesome star6' };
    const star2 = { tokenId: 7, name: 'Awesome star7' };
    await Promise.all([
        instance.createStar(star1.name, star1.tokenId, {from: user1}),
        instance.createStar(star2.name, star2.tokenId, {from: user2}),
    ]);
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(star1.tokenId, star2.tokenId, { from: user1 });
    // 3. Verify that the owners changed
    const [ownerOf1, ownerOf2] = await Promise.all([
        instance.ownerOf.call(star1.tokenId),
        instance.ownerOf.call(star2.tokenId),
    ]);
    assert.equal(ownerOf1, user2);
    assert.equal(ownerOf2, user1);
});

it('lets a user transfer a star', async() => {
    const instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    const user1 = accounts[1];
    const user2 = accounts[2];
    const star1 = { tokenId: 8, name: 'Awesome star8' };
    await instance.createStar(star1.name, star1.tokenId, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2, star1.tokenId, { from: user1 });
    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(star1.tokenId), user2)
});

it('lookUptokenIdToStarInfo test', async() => {
    const instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    const user1 = accounts[1];
    const star1 = { tokenId: 9, name: 'Awesome star' };
    await instance.createStar(star1.name, star1.tokenId, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    const starName = await instance.lookUptokenIdToStarInfo.call(star1.tokenId);
    // 3. Verify if you Star name is the same
    assert.equal(starName, star1.name);
});
