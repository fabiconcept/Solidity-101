// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract revertContract {
    function checkOverflow(uint256 _num1, uint256 _num2) public pure returns(string memory) {
        uint256 sum = _num1 + _num2;

        if (sum > 255) {
            revert("Overflown");
        }else {
            return "No Overflow";
        }
    }
}