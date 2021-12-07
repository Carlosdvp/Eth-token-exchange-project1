import { ether, tokens, EVM_Revert, ETHER_ADDRESS } from './helpers'



// grab the Token contract 
const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')


// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()

// use the contract methd to include the tests
contract('Exchange', ([deployer, feeAccount, user1]) => {
	// call this method once for all the tests, that way we don't need to call it every time a test is executed
	var exchange,
			token,
			feePercent = 10;

	beforeEach(async () => {
		// Deploy token
		token = await Token.new();
		// Transfer some tokens to user1
		token.transfer(user1, tokens(10), { from: deployer })
		// Deploy exchange
		exchange = await Exchange.new(feeAccount, feePercent);
	})

	// write the tests for the Exchange contract
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

	describe('fallback', () => {
		
	})

	describe('depositing Ether', async () => {
		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({ from: user1, value: amount })
		})

		it('tracks the Ether deposit', async () => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})

		it('emits a Deposit event', async () => {
			const log = result.logs[0]
			log.event.should.equal('Deposit')
			const event = log.args
			// check each of the Event's parameters
			event.token.should.equal(ETHER_ADDRESS, 'ether address is correct')
			event.user.should.equal(user1, 'user address is correct')
			event.amount.toString().should.equal(amount.toString(), 'amount is correct')
			event.balance.toString().should.equal(amount.toString(), 'balance is correct')
		})
	})

	describe('deposit tokens', ()=> {
		let result
		let amount

		describe('success', () => {
			// first we need to approve the token transfer
			beforeEach(async () => {
				amount = tokens(10)
				await token.approve(exchange.address, amount, { from: user1 })
				result = await exchange.depositToken(token.address, amount, { from: user1})
			})
			it('tracks the token deposit', async () => {
				// check the exchange token balance
				let balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				// check tokens on exchange
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal(amount.toString())
			})

			// test the Deposit Event
			it('emits a Deposit event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Deposit')
				const event = log.args
				// check each of the Event's parameters
				event.token.should.equal(token.address, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal(amount.toString(), 'balance is correct')
			})
		})

		describe('failure', () => {
			// Don't allow ether deposits
			it('rejects Ether deposits', async () => {
				await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_Revert)
			})

			// Do not approve any tokens before depositing them
			it('fails when no tokens are approved', async () => {
				await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_Revert)
			})
		})
	})

})