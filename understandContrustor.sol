// SPDX-License-Identifier: MIT
pragma solidity > 0.8.3;

contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

contract Y {
    string public cashAppTag;

    constructor(string memory _cashAppTag) {
        cashAppTag = _cashAppTag;
    }
}

contract B is X, Y {
    string public test;
    constructor(string memory _X, string memory _Y) X(_X) Y(_Y) {
        test = X.name;
    }
}