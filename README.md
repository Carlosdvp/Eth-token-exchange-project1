# project-one-v2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


**********************************************************************

# Blockchain Dapp Bootcamp

Following the Dapp University Dapp Bootcamp to build an Exchange. 

Some important differences:
	- I am using Vue 3 with vue router and vuex for state management.
	- Decided to replace React for the frontend as I believe Vue is a superior technology; plus it is built and maintained by the community and not by a centralized tech behemoth (i.e. Facebook). This keep sthe whole thing more in line with the philosophy of decentralization and community.
	- I have also decided to use one of the latest versions for Solidity, 0.8.0; since the version used in the course is very old and there have been many breaking changes between then and now. This I believe will future proof the work and help me develop with current tech and not obsolete build patterns.

## Some of the things I've learned so far

* Coding the contract and then the front end went well as separate units.
* Ran into a wall when trying to import and use the web3 library in the frontend app.
* Through trial and error I finally figured it out; online resources were 2-3 yeras old at best, nearly non-existent for dapps using Vue.
* The key was apparebtly to import web3 in a separate js file; and then to import that into a Vue component View; where the methods and function calls also reside.


-----------------------------------------------------------------------------

# Project One v2

## Create ERC-20 Token
	- create a smart contract for an ERC-20 token: Artemis $MOON
	- use chai and truffle for the tests

## Create a cryptocurrency exchange
	- create a smart contract with the basic functinality of an exchange
	- deposit and withdraw funds
	- place and cancel an order to swap tokens

## Tech Stack used

- Solidity for the Dapp - 0.8.0
- JS for the tests
- Vue for the fronend
- Vue Router and Vuex 
- git for version control


----------------------------------------------------------------------

## Deploy Contracts

### Exchange Contract

- when using ganache
	- if you restart Ganache to rest the ETH balances make sure to redeploy the smart contracts:
		1. run this command: `truffle migrate --rest`
		2. and then seed the exchange: `truffle exec scripts/seed-exchange.js`



---------------------------------------------------------------------


# Project - Part 2

## The Front end application

- run the dev server: `npm run dev`

### Notes and Observations regarding the Bootcamp content

The Part 2 project uses React and Bootstrap or the framework and the scaffolding respectively.

I prefer to use Vue.js, so I have replaced React with Vite. And I have also replaced Bootstrap/flexbox with CSS grid and custom css.