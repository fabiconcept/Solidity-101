// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract Constants {
    address constant MY_ADDRESS = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    function getConstant() public view returns(address) {
        return MY_ADDRESS;
    }
}