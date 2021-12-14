# Project One

## Create ERC-20 Token
	- create a smart contract for an ERC-20 token: Artemis $MOON
	- use chai and truffle for the tests

## Create a cryptocurrency exchange
	- create a smart contract with the basic functinality of an exchange
	- deposit and withdraw funds
	- place and cancel an order to swap tokens

## Tech Stack used

- Solidity for the Dapp
- JS for the tests
- Vue (Vite) for the fronend
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

I prefer to use Vue.js, so I have replaced React with Vite. And I have also replaced Bootstrap with CSS grid and custom css.