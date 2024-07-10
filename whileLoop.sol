// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.3;

contract whileLoop {
    uint256[] data;
    uint8 i;
    
    function loopExmaple() public returns (uint256[] memory) {
        while (i < 5) {
            i++;
            data.push(i);
        }
        return data;
    }
}