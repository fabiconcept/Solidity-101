// SPDX-License-Identifier: MIT
pragma solidity >=0.8;

contract GlobalStateVaribles {
    address public myBlockHash;
    uint256 public difficulty;
    uint public gasLimit;
    uint public number;
    uint public timestamp;
    uint public gasPrice;
    address public origin;
    bytes public callData;
    bytes4 public firstFour;
    uint public value;
    uint public nowOn;
    address public owner;

    constructor() {
        myBlockHash = block.coinbase;
        difficulty = block.difficulty;
        gasLimit = block.gaslimit;
        number = block.number;
        timestamp = block.timestamp;
        gasPrice = tx.gasprice;
        origin = tx.origin;
        callData = msg.data;
        firstFour = msg.sig;
        // value = msg.value;
        nowOn = timestamp;
        owner = msg.sender;
    }
}