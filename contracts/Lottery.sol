// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Lottery {
  address public manager;
  address[] public players;

  constructor() {
    manager = msg.sender;
  }

  function getPlayers() public view returns (address[] memory) {
    return players;
  }

  function enter() public payable {
    require(msg.value == 1 ether, "The lottery entry is exactly 1 ETH");
    players.push(msg.sender);
  }

  function pickWinner() public onlyForManagers {
    require(players.length > 0, "No players yet");
    uint index = random() % players.length;
    address payable winner = payable(players[index]);
    console.log("The winner is %s", winner);
    winner.transfer(address(this).balance);
    players = new address[](0);
  }

  function getCurrentReward() public view returns (uint) {
    return address(this).balance / 1 ether;
  }


  modifier onlyForManagers() {
    require(msg.sender == manager); 
    _;
  }

  function random() private view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

}
