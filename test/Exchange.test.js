import { tokens, EVM_Revert } from './helpers'



// grab the Token contract 
const Exchange = artifacts.require('./Exchange')

// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()

// use the contract methd to include the tests
contract('Exchange', ([deployer, feeAccount]) => {
	// call this method once for all the tests, that way we don't need to call it every time a test is executed
	var exchange,
			feePercent = 10;

	beforeEach(async () => {
		// 1. fetch the toekn info that was deployed to the blockchain
		exchange = await Exchange.new(feeAccount, feePercent);
	})

	// write the tests for the 4 basic token attributes
	describe('deployment', ()=> {
		it('tracks the Fee Account', async () => {
			var result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})

		it('tracks the fee percent', async () => {
			var result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})
	})

})