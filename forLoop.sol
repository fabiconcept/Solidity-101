// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract forLoop {
    uint256[] data;

    function performLoop() public returns (uint256[] memory) {
        for (uint256 i=0; i < 5; i++) {
            data.push(i);
        }

        return data;
    }
}