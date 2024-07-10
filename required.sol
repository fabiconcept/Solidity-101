// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract requiredContract {
    function checkInput(uint256 _input) public pure returns (string memory) {
        require(_input >=0, "Invalid Uint8");
        require(_input <=255, "Invalid Uint8");

        return "input is uint8";
    }

    function isOdd(uint256 _input) public pure returns (bool) {
        require(_input % 2 != 0, "Number is not an odd number!");
        return true;
    }
}