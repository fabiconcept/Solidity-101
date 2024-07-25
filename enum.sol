// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

import "./enumExport.sol";

contract Enum {
    shipping public shippingStatus;

    function get() public view returns (shipping) {
        return shippingStatus;
    }

    function set(shipping _status) public {
        shippingStatus = _status;
    }

    function cancel() public {
        shippingStatus = shipping.Canceled;
    }

    function deleteEnum() public {
        delete shippingStatus;
    }

}