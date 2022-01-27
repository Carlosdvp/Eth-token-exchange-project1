import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
// console.log('Web3:', web3);


export default web3;