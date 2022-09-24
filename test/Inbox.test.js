const assert = require('assert'); // native from node
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let inbox;

const INITIAL_MESSAGE = 'Hi there!';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // Deploying contract requires a TX so it consumes gas
  inbox = await new web3.eth.Contract(abi)
    .deploy({data: evm.bytecode.object, arguments: [INITIAL_MESSAGE]})
    .send({ from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
  it('Verifing deploy', () => { 
    assert.ok(inbox.options.address)
  });

  it('Verifing initial message', async () => {
    const messageCall = await inbox.methods.message().call();
    assert.equal(messageCall, INITIAL_MESSAGE);
  });

  it('Verifing message set', async () => {
    const newMessage = "This is a new message!";
    await inbox.methods.setMessage(newMessage).send({from : accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });

});
