// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract DoWhileLoop {
    uint256[] data;
    uint8 i;

    function loop() public returns (uint256[] memory) {
        do {
            i++;
            data.push(i);
        } while (i < 5);

        return data;
    }
}