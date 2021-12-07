// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import our token contract so that we handle anyERC-20 token
import './Token.sol';
// import safemath library
import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';

// What we need the smart contract to do

	// TODO:
	// [x] 1. Set the fee account
	// [x] 2. Deposit Ether
	// [] 3. Withdraw Ether
	// [x] 4. Deposit tokens
	// [] 5. Withdraw tokens
	// [] 6. Check balances
	// [] 7. Make an order
	// [] 8. Cancel an order
	// [] 9. Fill an order
	// [] 10. Charge Fees


// 1. Set the fee account
contract Exchange {
	// import SafeMath module
	using SafeMath for uint;

	// state variables
		// the account that receives the exchanges fees
	address public feeAccount;
		// the exchange fee percentage
	uint256 public feePercent;
		// store Ether balance in tokens mapping using a blank address
	address constant ETHER = address(0);

	// 1st key is the Token address which keeps track of all the tokens deposited, the 2nd key is the user address who has deposited the tokens and will show their balances, the final value is the actual number of tokens held by the user
	mapping (address => mapping (address => uint256)) public tokens;
	
	// Events
	event Deposit(address token, address user, uint256 amount, uint256 balance);
	
	// Contract constructor function
  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // 2. Deposit Ether
  function depositEther() payable public {
  	tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
  	emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }
  
  // 4. Deposit tokens
	// which token do they want to deposit and How much? (parameters)
  function depositToken(address _token, uint _amount) public {
  	// Don't allow ether deposits
  	require(_token != ETHER);
	  	// create an instance of the Token so we use all its methods
	  	// use the require method to return a truthy value, if it ails we want the function to halt execution
  	require(Token(_token).transferFrom(msg.sender,address(this), _amount));
  	// Manage Deposit
	  	// transfer tokens and update the amount of tokens in the sender's balance
  	tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
  	// Emit event so user knows what happened and when
  	emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
  

}