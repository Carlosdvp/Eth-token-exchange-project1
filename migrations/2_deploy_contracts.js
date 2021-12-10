const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
  // get the account details
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(Token);

  // set the values for the parameter variables
  let feeAccount = accounts[0];
  let feePercent = 10;

  // deploy the Exchange contract
  await deployer.deploy(Exchange, feeAccount, feePercent);
};
