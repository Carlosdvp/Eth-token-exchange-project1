import { tokens, EVM_Revert } from './helpers'



// grab the Token contract 
const Token = artifacts.require('./Token')

// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()

// use the contract methd to include the tests
contract('Token', ([deployer, receiver, exchange]) => {
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
		let result
		let amount

		// successful transfer
		describe('success', async ()=> {
			beforeEach(async () => {
				// keep the toekn amount in a variable
				amount = tokens(100)
				result = await token.transfer(receiver, amount, { from: deployer})
			})

			it('transfers token balances', async () => {
				let balanceOf

				// before the transfer
				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(999900).toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(100).toString())
			})

			it('emits a transfer event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Transfer')
				// now we grab the results.logs args array
				const event = log.args
				// check the from / to / and value parameters
				event.from.toString().should.equal(deployer, 'from is correct')
				event.to.toString().should.equal(receiver, 'to is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})
		})

		// failed transfer checks
		describe('failure', async () => {
			// if there are no tokens left throw an error
			it('rejects insufficient balances', async () => {
				let invalidAmount
				invalidAmount = tokens(100000000) // 100 million, greater than the total supply
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_Revert)

				// try to transfer tokens when there are none
				invalidAmount = tokens(10)
				await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_Revert)
			})

			// check for valid recipient
			it('rejects invalid recipient', async () => {
				await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
			})
		})

	})

	describe('approving tokens', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = tokens(100)
			result = await token.approve(exchange, amount, { from: deployer })
		})

		// Approval and Transfer tests
		describe('success', () => {
			// check the approved balance of the allowance
			it('allocates an allowance for delegated token spending on exchange', async () => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal(amount.toString())
			})

			// checks for the approval event to be emmited
			it('emits an approval event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Approval')
				const event = log.args

				event.owner.toString().should.equal(deployer, 'owner is correct')
				event.spender.should.equal(exchange, 'spender is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})

		})

		describe('failure', () => {
			it('rejects invalid spenders', async () => {
				await token.approve(0x0, amount, { from: deployer }).should.be.rejected
			})
		})

	})

	// Check the Transfer From logic
	describe('delegated token transfers', () => {
		let result
		let amount

		// first approve the tokens
		beforeEach(async () => {
			amount = tokens(100)
			await token.approve(exchange, amount, { from: deployer })
		})

		// successful transfer
		describe('success', async ()=> {
			beforeEach(async () => {
				// do the transfer from deployer to receiver by the exchange
				result = await token.transferFrom(deployer, receiver, amount, { from: exchange})
			})

			it('transfers token balances', async () => {
				let balanceOf
				// do the transfer
				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(999900).toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(100).toString())
			})

			it('resets the allowance', async () => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal('0')
			})

			it('emits a transfer event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Transfer')
				const event = log.args

				event.from.toString().should.equal(deployer, 'from is correct')
				event.to.should.equal(receiver, 'to is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})

		})

		// failed transfer checks - throw an error if they try to send more tokens than there are out there
		describe('failure', async () => {
			// attempt to transfer too many tokens
			it('rejects transfer when the balance is insufficient', async () => {
				const invalidAmount = tokens(15000000)
				await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_Revert)
			})

			// reject transfers to invalid recipients
			it('rejects transfer to invalid recipients', async () => {
				await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
			})
		})

	})


})