// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract functionModifier {
    address public owner;
    uint256 public x = 10;
    bool public locked;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    modifier validateDate(address _addr) {
        require(_addr != address(0), "Zero address");
        _;
    }

    modifier reentrancyGuard() {
        require(!locked, "Reetrancy guard is up lil bro!");
        locked = true;
        _;
        locked = false;
    }
 
    function changeOwner(address _address) public onlyOwner validateDate(_address) {
        owner = _address;
    }

    function decrement(uint256 _i) public reentrancyGuard {
        x--;
        if(_i > 1){
            decrement(_i - 1);
        }
    }
}