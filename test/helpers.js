// helper function to handle large numbers
export const tokens = (n) => {
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}

export const EVM_Revert = 'VM Exception while processing transaction: revert';