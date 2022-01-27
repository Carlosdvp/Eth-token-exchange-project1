// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's SafeMath Implementation
import "@openzeppelin/contracts//utils/math/SafeMath.sol";

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
	mapping(address => mapping(address => uint256)) public allowance;

	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	// contract constructor
	constructor() {
		totalSupply = 1000000 * (10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	// Send tokens
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// use the require method to check the balance, if it evaluates to false then it will throw an error and stop execution
		require(balanceOf[msg.sender] >= _value);
		// call the nternal _transfer function
		_transfer(msg.sender, _to, _value);
		return true;
	}

	// create an internal function to handle the transfer logic
	function _transfer(address _from, address _to, uint256 _value) internal {
		// check if address is valid or not
		require(_to != address(0));
		// main part of the function to be executed if the sender has enough tokens
		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(_from, _to, _value);
	}

	// Approve Tokens
	function approve(address _spender, uint256 _value) public returns(bool success) {
		// require that the address is valid
		require(_spender != address(0));
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	// Transfer From
	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
		// make sure we can guard against insuffiient amounts
		require(_value <= balanceOf[_from]);
		require(_value <= allowance[_from][msg.sender]);
		// reset the allowance after a transfer
		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		_transfer(_from, _to, _value);
		return true;
	}
	
}

