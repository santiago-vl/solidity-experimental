const assert = require('assert'); // native from node
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let manager;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];

  lottery = await new web3.eth.Contract(abi)
    .deploy({data: evm.bytecode.object})
    .send({ from: manager, gas: '1000000'});
});

describe('Lottery', () => {
  it('Verifing deploy', () => { 
    assert.ok(lottery.options.address);
  });

  it('Enter players', async () => {
    await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether')});

    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  // Con este test me sobre el primero
  it('Enter multiple players', async () => {
    await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether')});

    await lottery.methods.enter()
      .send({ from: accounts[1], value: web3.utils.toWei('1', 'ether')});

      await lottery.methods.enter()
      .send({ from: accounts[2], value: web3.utils.toWei('1', 'ether')});

    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('Enter only paying 1 ETH', async () => {
    try {
    await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1.01', 'ether')});
    assert(false);
    } catch (error) {
      assert(error);
    }
    const players = await lottery.methods.getPlayers().call();
    assert.equal(0, players.length);
  });


  it('Only manager can pick winner', async () => {
    const notManagerPlayer = accounts[1];
    await lottery.methods.enter()
      .send({ from: notManagerPlayer, value: web3.utils.toWei('1', 'ether')});
    try {
      lottery.methods.pickWinner().send({ from: player });
    assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('Sends money to winner', async () => {
    await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether')});

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    
    // 0.9 cause the tx gas
    assert(difference > 0.9);
  });

  it('Clean player list before picking winner', async () => {
    await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether')});

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    assert(await lottery.methods.getPlayers().call() == 0);
  });

}); 
