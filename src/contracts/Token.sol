// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import safemath library
import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';

contract Token {
	// all the smart contract code goes in here

	// instruct the smart contract to use the safe math module
	using SafeMath for uint;

	// specify the datatype first - Variables
	string public name = "Artemis";
	string public symbol = 'MOON';
	uint256 public decimals = 18;
	uint256 public totalSupply;

	// Track balances
	mapping(address => uint256) public balanceOf;

	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);

	// contract constructor
	constructor() {
		totalSupply = 1000000 * (10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	// Send tokens
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// check if address is valid or not
		require(_to != address(0));

		// use the require method to check the balance, if it evaluates to false then it will throw an error and stop execution
		require(balanceOf[msg.sender] >= _value);

		// main part of the function to be executed if the sender has enough tokens
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	// Approve Tokens


	// Transfer From

}

