// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.3;

contract VotingContact {
    struct Option {
        string name;
        uint count;
    }

    struct Poll {
        string title;
        mapping(uint => Option) options;
        uint duration;
        address admin;
        uint pollOptionsCount;
    }
    
    address public owner;
    mapping(uint16 => Poll) Polls;
    uint256 public total_polls = 0;

    constructor () {
        owner = msg.sender;
    }    

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can call this function!");
        _;
    }
    
    modifier onlyPollAdmin (uint16 _pollId) {
        Poll storage getPoll = Polls[_pollId];
        require(msg.sender == getPoll.admin || msg.sender == owner, "On the admin of this poll can call this function!");
        _;
    }

    modifier pollExist (uint16 _pollId) {
        Poll storage getPoll = Polls[_pollId];
        require(getPoll.admin != address(0), "This poll does not exist!");
        _;
    }
    
    modifier pollNotExist (uint16 _pollId) {
        Poll storage getPoll = Polls[_pollId];
        require(getPoll.admin == address(0), "A Poll with this ID already exist!");
        _;
    }

    function daysToSeconds(uint _days) private pure returns (uint256 _seconds) {
        _seconds = _days * 24 * 60 * 60;
        return _seconds;
    }

    function createNewPoll(uint16 _pollId, string memory _pollTitle, uint _duration) public onlyOwner() pollNotExist(_pollId) returns (bool) {
        Poll storage newPoll = Polls[_pollId];

        newPoll.admin = msg.sender;
        newPoll.title = _pollTitle;
        newPoll.duration = block.timestamp +  daysToSeconds(_duration);

        total_polls++;

        return true;
    }

    function addPollOption (string memory _name, uint16 _pollId) public onlyPollAdmin(_pollId) pollExist(_pollId) {
        Poll storage getPoll = Polls[_pollId];
        uint pollOptionsCount = getPoll.pollOptionsCount;
        Option storage newOption = getPoll.options[pollOptionsCount];

        newOption.count = 0;
        newOption.name = _name;
        getPoll.pollOptionsCount++;
    }

    function deletePoll (uint16 _pollId) public onlyPollAdmin(_pollId) pollExist(_pollId) {
        delete Polls[_pollId];
        total_polls--;
    }

    function removePollOption (uint16 _pollId, uint _pollOptionId) public onlyPollAdmin(_pollId) pollExist(_pollId) {
        Poll storage getPoll = Polls[_pollId];
        Option storage getPollOption = getPoll.options[_pollOptionId];

        require(bytes(getPollOption.name).length != 0, "This option does not exist!");

        delete getPoll.options[_pollOptionId];

        getPoll.pollOptionsCount--;
    }

    function vote(uint16 _pollId, uint _pollOptionId) public pollExist(_pollId) returns (string memory) {
        Poll storage getPoll = Polls[_pollId];
        Option storage getPollOption = getPoll.options[_pollOptionId];

        getPollOption.count++;
        return getPollOption.name;
    }
}