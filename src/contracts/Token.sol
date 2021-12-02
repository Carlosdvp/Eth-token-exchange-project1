// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import safemath library
import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';

contract Token {
	// all the smart contract code goes in here

	// instruct the smart contract to use the safe math module
	using SafeMath for uint;

	// specify the datatype first
	string public name = "Artemis";
	string public symbol = 'MOON';
	uint256 public decimals = 18;
	uint256 public totalSupply;

	// Track balances
	mapping(address => uint256) public balanceOf;

	// contract constructor
	constructor() {
		totalSupply = 1000000 * (10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	// Send tokens
	function transfer(address _to, uint256 _value) public returns (bool success) {
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		return true;
	}

}

