/*
We will use this script to seed the newly created exchange with pre-filled orders. So that once deployed it will have orders pre-loaded into it for us to view.
*/

// import the Contracts
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

// Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'; // Ether token deposit address
const ether = (n) => {
	return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}

const tokens = (n) => ether(n)

// wait for one second
const wait = (seconds) => {
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async function (callback) {
	// try/catch pattern just in case
	try {
		// Fetch accounts from wallet - these are unlocked
		const accounts = await web3.eth.getAccounts()

		// Fetch the deployed token
		const token = await Token.deployed()
		console.log('Token fetched', token.address)

		// Fetch the dep[loyed Contract
		const exchange = await Exchange.deployed()
		console.log('Exchange fetched', exchange.address)

		// Give tokens to account 1
		const sender = accounts[0]
		const receiver = accounts[1]
		var amount = web3.utils.toWei('10000', 'ether') // 10,000 tokens
		await token.transfer(receiver, amount, { from: sender })
		console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)

		// Set up exchange users
		const user1 = accounts[0]
		const user2 = accounts[1]

		// User 1 deposits ether
		amount = 1
		await exchange.depositEther({ from: user1, value: ether(amount) })
		console.log(`Deposited ${amount} Ether from ${user1}`)

		// User 2 approves tokens
		amount = 10000
		await token.approve(exchange.address, tokens(amount), { from: user2 })
		console.log(`Approved ${amount} tokens from ${user2}`)

		// User 2 Deposits tokens
		await exchange.depositToken(token.address, tokens(amount), { from: user2 })
		console.log(`${user2} deposits ${amount} tokens.`)

		////////////////////////////////////////////////////////
		// Seed a Cancelled Order
		//

		// User 1 make an order to get some tokens
		let result
		let orderId

		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
		console.log(`${user1} placed an order`)

		// User 1 cancels order
		orderId = result.logs[0].args.id
		await exchange.cancelOrder(orderId, { from: user1 })
		console.log(`Cancelled order from ${user1}`)

		////////////////////////////////////////////////////////
		// Seed Filled Orders
		//

		// User 1 makes an order
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
		console.log(`${user1} makes and order`)

		// User 2 Fills an order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, { from: user2 })
		console.log(`Filled order from ${user1}`)

		// wait one second
		await wait(1)

		// User 1 makes another order
		result = await exchange.makeOrder(token.address, tokens(33), ETHER_ADDRESS, ether(0.01), { from: user1 })
		console.log(`${user1} makes another order.`)

		// User 2 fills another order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, { from: user1 })
		console.log(`Filled order from ${user1}`)

		// wait one second
		await wait(1)

		// User 1 makes third order
		result = await exchange.makeOrder(token.address, tokens(69), ETHER_ADDRESS, ether(0.01), { from: user1 })
		console.log(`${user1} makes an order.`)

		// User 2 fills the third order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, { from: user2 })
		console.log(`Filled order from ${user1}`)

		// wait one second
		await wait(1)

		////////////////////////////////////////////////////////
		// Seed Open orders
		//

		// User 1 makes 10 orders
		for (let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(token.address, tokens(2*i), ETHER_ADDRESS, ether(0.01), { from: user1 })
			console.log(`Order from ${user1} sent...`)
			// wait one second
			await wait(1)
		}

		// User 2 makes 10 orders
		for (let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(2*i), { from: user2 })
			console.log(`Order from ${user2} sent...`)
			// wait one second
			await wait(1)
		}

	} catch(error) {
		console.log(error)
	}

	callback();
}