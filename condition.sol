// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.3;

contract Condition {
    uint256 public myNum = 5;
    string public myString;

    // function get(uint256 _num) public returns (string memory) {
    //     if (_num == 5) {
    //         myString = "Number is 5";
    //     }else if (_num >=6 ) {
    //         myString = "Number is larger than 5";
    //     }else{
    //         myString = "Number is not 5";
    //     }

    //     return myString;
    // }

    function shortHand(uint256 _num) public returns (string memory) {
        _num ==5 ? myString = "it's 5" : myString = "it's not 5";
        return myString;
    }
}