// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.3;

contract VotingContact {
    struct option {
        uint count;
    }

    struct Poll {
        string title;
        option[] options;
        uint duration;
    }

    mapping(bytes => Poll) Polls;

    
}