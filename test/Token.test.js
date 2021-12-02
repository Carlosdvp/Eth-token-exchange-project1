import { tokens } from './helpers'



// grab the Token contract 
const Token = artifacts.require('./Token')

// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()

// use the contract methd to include the tests
contract('Token', ([deployer, receiver]) => {
	// call this method once for all the tests, that way we don't need to call it every time a test is executed
	var token;
	const name = 'Artemis'
	const symbol = 'MOON'
	const decimals = '18'
	const totalSupply = tokens(1000000).toString()

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

		it('assigns the total supply to the deployer', async () => {
			const result = await token.balanceOf(deployer)
			result.toString().should.equal(totalSupply)
		})

	})

	describe('sending tokens', () => {
		it('transfers token balances', async () => {
			let balanceOf

			// before the transfer
			balanceOf = await token.balanceOf(deployer)
			console.log('Deployer balance before the transfer', balanceOf.toString())
			balanceOf = await token.balanceOf(receiver)
			console.log('Receiver balance before the transfer', balanceOf.toString())

			// transfer
			await token.transfer(receiver, tokens(100), { from: deployer })

			// After the transfer
			balanceOf = await token.balanceOf(deployer)
			console.log('Deployer balance after transher', balanceOf.toString())
			balanceOf = await token.balanceOf(receiver)
			console.log('Receiver balance after transher', balanceOf.toString())

		})
	})
})