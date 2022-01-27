export const EVM_Revert = 'VM Exception while processing transaction: revert';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

// helper function to handle large numbers
export const ether = (n) => {
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}

// For other ERC-20 tokens - same as Ether
export const tokens = (n) => ether(n)
