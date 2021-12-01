pragma solidity ^0.5.0;


contract Token {
	// all the smart contract code goes in here
	// specify the datatype first
	string public name = "Artemis";
	string public symbol = 'MOON';
	uint256 public decimals = 18;
	uint256 public totalSupply;

	constructor() public {
		totalSupply = 1000000 * (10**decimals);
	}
}

