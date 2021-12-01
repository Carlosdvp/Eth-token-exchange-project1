// grab the Toekn contract 
const Token = artifacts.require('./Token')

// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()



// use the contract methd to include the tests
contract('Token', (accounts) => {
	// call this method once for all the tests, that way we don't need to call it every time a test is executed
	var token;
	const name = 'Artemis'
	const symbol = 'MOON'
	const decimals = '18'
	const totalSupply = '1000000000000000000000000'

	beforeEach(async () => {
		// 1. fetch the toekn info that was deployed to the blockchain
		token = await Token.new();
	})

	// write the tests for the 4 basic token attributes
	
	describe('deployment', ()=> {
		it('tracks the name', async () => {
			// 2. Read the token name by fetching the result
			var result = await token.name()
			// 3. Check the token name, should be 'Artemis'
			result.should.equal(name)
		})

		it('tracks the symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimals', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimals)
		})

		it('tracks the total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply)
		})

	})
})