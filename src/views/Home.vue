<template>
  <div class="home">
    <Metamask/>
    <Exchange></Exchange>
    <FooterComponent/>
  </div>
</template>

<script>
// import components
import Exchange from '../components/Exchange.vue'
import FooterComponent from '../components/FooterComponent.vue'
import Metamask from '../components/Metamask.vue'

// import the web3 library
import web3 from '../../helpers/web3';
// import Token Contract
import Token from '../abis/Token.json'

// Module exports and methods
export default {
  name: 'Home',
  components: {
    Exchange,
    FooterComponent,
    Metamask
  },
  mounted() {
    this.loadBlockchainData()
  },
  methods: {
    async loadBlockchainData() {
      // Check the network we are connected to
      const network = await web3.eth.net.getNetworkType()
      // get the accounts
      const accounts = await web3.eth.getAccounts()
      // grab the network ID
      const networkId = await web3.eth.net.getId()
      // get the Token abi in here
      const abi = Token.abi;
      const tokenAddress = Token.networks[networkId].address;
      // instantiate a new Contract object for our token
      const token = new web3.eth.Contract(abi, tokenAddress)
      // get the total supply by calling one of our contract methods
      const totalSupply = await token.methods.totalSupply().call()
      console.log("Total Supply: ", totalSupply)
    }
  }
}
</script>
