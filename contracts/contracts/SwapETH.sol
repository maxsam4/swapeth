//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract SwapETH {
  struct DepositId {
    Testnet testnet;
    uint64 nonce;
  }
  enum Testnet{ ROPSTEN, RINKEBY, KOVAN, GOERLI }
  event Received(uint256, address, uint256, Testnet);

  uint64 nonce;
  address public owner;
  mapping(Testnet => mapping (uint64 => bool)) swapsCompleted;

  modifier onlyOwner {
    require(msg.sender == owner, "Unauthorized");
    _;
  }

  constructor() { owner = msg.sender; }

  function swap(Testnet to) external payable {
    uint64 newNonce = nonce + 1;
    nonce = newNonce;
    emit Received(newNonce, msg.sender, msg.value, to);
  }

  function transfer(address payable to, uint256 amount, Testnet from, uint64 fromNonce) external onlyOwner {
    require(!swapsCompleted[from][fromNonce], "Duplicate");
    swapsCompleted[from][fromNonce] = true;
    to.transfer(amount);
  }

  function passBaton(address newOwner) external onlyOwner {
    owner = newOwner;
  }

  receive() external payable {}
}
