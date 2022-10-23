const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const TEST_ACCOUNT_MNEMONIC = 'curtain dynamic lounge lemon total bar upgrade dust room dose banana carry';
const INFURA_URL = 'https://goerli.infura.io/v3/f5c511154c414e8091fd16a884965076';

const provider = new HDWalletProvider(TEST_ACCOUNT_MNEMONIC, INFURA_URL);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attemping to deploy from account " + accounts[0])

  const deployedContract = await new web3.eth.Contract(abi)
    .deploy({data: evm.bytecode.object})
    .send({ from: accounts[0], gas: '1000000'});

  console.log("Contract deployed to " + deployedContract.options.address);
  provider.engine.stop();
}

deploy();