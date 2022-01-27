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