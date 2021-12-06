// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import our token contract so that we handle anyERC-20 token
import './Token.sol';

// What we need the smart contract to do

	// TODO:
	// [x] 1. Set the fee account
	// [] 2. Deposit Ether
	// [] 3. Withdraw Ether
	// [] 4. Deposit tokens
	// [] 5. Withdraw tokens
	// [] 6. Check balances
	// [] 7. Make an order
	// [] 8. Cancel an order
	// [] 9. Fill an order
	// [] 10. Charge Fees


// 1. Set the fee account
contract Exchange {
	// state variables
		// the account that receives the exchanges fees
	address public feeAccount;
	// the exchange fee percentage
	uint256 public feePercent;

  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // 4. Deposit tokens
  function depositToken(address _token, uint _amount) public {
  	// which token do they want to deposit
  	// How much?
  	// Send tokens to this contract
  	// Manage Deposit
  	// Emit event so user knows what happened and when

  	// create an instance of the Toekn contract so we may have access to all its methods
  	Token(_token).transferFrom(msg.sender,address(this), _amount);
  }
  

}
