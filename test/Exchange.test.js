import { ether, tokens, EVM_Revert, ETHER_ADDRESS } from './helpers'



// grab the Token contract 
const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')


// import additional testing methods
require('chai')
	.use(require('chai-as-promised'))
	.should()

// use the contract methd to include the tests
contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
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
		it('reverts when ether is sent', async () => {
			await exchange.sendTransaction({ value: 1, from: user1 }).should.rejectedWith(EVM_Revert)
		})
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

	describe('withdrawing Ether', async () => {
		let result
		let amount

		beforeEach(async () => {
			// Deposit Ether first
			amount = ether(1)
			await exchange.depositEther({ from: user1, value: amount })
		})

		describe('success', async () => {
			beforeEach(async () => {
				// withdraw Ether
				result = await exchange.withdrawEther(amount, { from: user1 })
			})

			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})

			// test the emit event
			it('emits a Withdraw event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Withdraw')
				const event = log.args

				event.token.should.equal(ETHER_ADDRESS)
				event.user.should.equal(user1)
				event.amount.toString().should.equal(amount.toString())
				event.balance.toString().should.equal('0')
			})
		})

		describe('failure', async () => {
			it('reject withdrawals when the balance is insufficient', async () => {
				await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_Revert)
			})
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

	describe('withdrawing Tokens', async () => {
		let result
		let amount

		describe('success', async () => {
			beforeEach(async () => {
				// Deposit tokens first
				amount = tokens(10)
				await token.approve(exchange.address, amount, { from: user1 })
				await exchange.depositToken(token.address, amount, { from: user1 })

				// Withdraw tokens
				result = await exchange.withdrawToken(token.address, amount, { from: user1 })
			})

			it('withdraws token funds', async () => {
				const balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal('0')
			})

			it('emits a Withdraw event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Withdraw')
				const event = log.args

				event.token.should.equal(token.address)
				event.user.should.equal(user1)
				event.amount.toString().should.equal(amount.toString())
				event.balance.toString().should.equal('0')
			})
		})

		describe('failure', async () => {
			it('rejects Ether withdrawals', async () => {
				await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_Revert)
			})

			it('fails due to insufficient funds in balance', async () => {
				// tries to withdraw without depositing any tokens first
				await exchange.withdrawToken(token.address, tokens(100), { from: user1 }).should.be.rejectedWith(EVM_Revert)
			})
		})
	})

	describe('checking balances', async () => {
		beforeEach(async () => {
			await exchange.depositEther({ from: user1, value: ether(1) })
		})

		it('returns our balance', async () => {
			const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
			result.toString().should.equal(ether(1).toString())
		})
	})

	describe('making orders', async () => {
		let result

		beforeEach(async () => {
			result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
		})

		it('tracks the newly created order', async () => {
			const orderCount = await exchange.orderCount()
			orderCount.toString().should.equal('1')

			const order = await exchange.orders('1')
			order.id.toString().should.equal('1', 'id is correct')
			order.user.should.equal(user1, 'user is correct')
			order.tokenGet.should.equal(token.address, 'tokenGet is correct')
			order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
			order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
			order.amountGive.toString().should.equal(ether(1).toString(), 'amountgive is correct')
			order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
		})

		it('emits and Order event', async () => {
			const log = result.logs[0]
			log.event.should.equal('Order')
			const event = log.args

			event.id.toString().should.equal('1', 'id is correct')
			event.user.should.equal(user1, 'user i correct')
			event.tokenGet.should.equal(token.address, 'tokenGet is correct')
			event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
			event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
			event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
			event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
		})
	})

	describe('order actions', async () => {

		beforeEach(async () => {
			//user1 deposits ether only 
			await exchange.depositEther({ from: user1, value: ether(1) })
			// give tokens to user2
			await token.transfer(user2, tokens(10), { from: deployer })
			// user2 deposits tokens only
			await token.approve(exchange.address, tokens(2), { from: user2 })
			await exchange.depositToken(token.address, tokens(2), { from: user2 })
			// user1 places an order to buy a token with Ether
			await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
		})

		describe('filling orders', async () => {
			let result

			describe('success', async () => {
				beforeEach(async () => {
					//user2 fills order
					result = await exchange.fillOrder('1', { from: user2 })
				})

				it('executes the trade and charges fees', async () => {
					let balance


				})
			})
		})

		describe('canceliing orders', async () => {
			let result

			describe('success', async () => {
				beforeEach(async () => {
					result = await exchange.cancelOrder('1', { from: user1 })
				})

				it('updates canceled orders', async () => {
					const orderCancelled = await exchange.orderCancelled(1)
					orderCancelled.should.equal(true)
				})

				it('emits a Cancel event', async () => {
					const log = result.logs[0]
					log.event.should.equal('Cancel')
					const event = log.args 

					event.id.toString().should.equal('1', 'id is correct')
					event.user.should.equal(user1, 'user is correct')
					event.tokenGet.should.equal(token.address, 'tokenGet is correct')
					event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
					event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
					event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
					event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
				})
			})

			describe('failure', async () => {
				it('rejects the invalid order ids', async () => {
					const invalidOrderId = 99999
					await exchange.cancelOrder(invalidOrderId, { from: user1 }).should.be.rejectedWith(EVM_Revert)
				})

				it('rejects unauthorized cancellation', async () => {
					// try to cancel another user's order
					await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_Revert)
				})
			})
		})
	})

})