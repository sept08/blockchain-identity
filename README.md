# Decentralized Star Notary Service

## Token info

- ERC-721 token name: `Star Notary Token`
- ERC-721 token symbol: `SNT`
- `truffle` version: `v5.0.25`
- `openzeppelin-solidity` version: `2.3.0`

## Rinkeby deployment info

- Transaction hash: `0x7277c86033e560a6e630a27e0c856b0e247528ee77ce31108f5bb636ecbee1e7`
- Contract address: `0x56817895149DCd36323bFaf79999b9eb584cAAfB`

## Requirements

- [`yarn`](https://yarnpkg.com/)
- [`truffle`](https://truffleframework.com/truffle)

## Running

```
npm install
truffle develop
> compile
> migrate --reset
```

In another terminal, run:

```
cd app
yarn install
yarn run dev
```

Then with your browser go to the address indicated by webpack.

## Deploying to the Rinkeby network

In order to be able to deploy this contract to the Rinkeby test network, you first **MUST** create a file named `.secret` at the root of this project.

This file should contain your Metamask seed.

Then run:

```
truffle compile
truffle migrate --reset --network rinkeby
```
