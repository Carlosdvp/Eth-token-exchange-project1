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
	// [x] 3. Withdraw Ether
	// [x] 4. Deposit tokens
	// [x] 5. Withdraw tokens
	// [x] 6. Check balances
	// [x] 7. Make an order
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
	//  way to store the order on the blockchain
	mapping (uint256 => _Order) public orders;
	uint256 public orderCount;
	
	
	// Events
	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint amount, uint balance);
	event Order(
		uint id,
		address user,
		address tokenGet,
		uint amountGet,
		address tokenGive,
		uint amountGive,
		uint timestamp
	);
	
	// STRUCTS
	// We need a way to model the order
	struct _Order {
		uint id;
		address user;
		address tokenGet;
		uint amountGet;
		address tokenGive;
		uint amountGive;
		uint timestamp;
	}
	
	// Contract constructor function
  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // Fallback: reverts if Ether is sent to this smart contract by mistake
  fallback() external {
  	revert();
  }

  // 2. Deposit Ether
  function depositEther() payable public {
  	tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
  	emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  // 3. Withdraw Ether
  function withdrawEther(uint _amount) public {
  	// make sure the amount they are withdrawing is equl to or less than the amount they have in the contract
  	require(tokens[ETHER][msg.sender] >= _amount);
  	
  	tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
  	payable(msg.sender).transfer(_amount);
  	// emit the withdraw event
  	emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
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

  // 5. Withdraw tokens
  function withdrawToken(address _token, uint256 _amount) public {
  	// make sure it is not Ether
  	require(_token != ETHER);
  	// make sure they have enough tokens in their balance to withdraw the requested amount
  	require(tokens[_token][msg.sender] >= _amount);
  	// update the deposit balance
  	tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
  	// xfer from the smart contract back to the user
  	require(Token(_token).transfer(msg.sender, _amount));
  	// emit the withdraw event
  	emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function balanceOf(address _token, address _user) public view returns (uint256 _balance) {
  	return tokens[_token][_user];
  }
  
 	// and a way to addthe order to storage
 	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
 		// create a counter to kep track of al the orders created
 		orderCount = orderCount.add(1);
 		// instantiate the _Order struct
 		orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
 		// trigger an event everytime an order is made
 		emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
 	}
 	

  
  

}