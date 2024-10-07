// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract ConcertPlanner {
    address payable public owner;

    struct Artist {
        string name;
        uint256 meetGreetCount;
    }

    struct Visitor {
        string name;
        uint256 sitNumber;
        bool hasMeetGreet;
        string meetGreetArtist;
    }

    struct MeetGreet {
        uint256 sitNumber;
        string artistId;
    }

    uint256 public artistCount;
    uint256 public visitorCount;
    uint256 public meetGreetCount;
    uint256 public ticketPrice;

    uint256 public maxTickets;
    uint256 public maxMeetGreet;
    uint256 public maxMeetGreetPerArtist;

    mapping(string => Artist) public artists;
    mapping(uint256 => Visitor) public visitors;
    mapping(uint256 => MeetGreet) public meetGreets;

    uint256[] public artistIds;
    uint256[] public visitorIds;
    uint256[] public takenSits;

    string[] public artistNames;
    string[] public visitorNames;

    string public concertName;
    uint256 public concertDate;

    constructor(string memory _concertName) {
        owner = payable(msg.sender);
        concertName = _concertName;
        concertDate = block.timestamp + 5 days;
        maxTickets = 500;
        maxMeetGreet = 50;
        maxMeetGreetPerArtist = 5;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner, "Only admin can call this function");
        _;
    }

    modifier onlyBeforeConcertStart() {
        require(block.timestamp < concertDate, "Concert has already started");
        _;
    }

    modifier onlyAfterConcertStart() {
        require(block.timestamp >= concertDate, "Concert has not started yet");
        _;
    }

    modifier onlyValidVistor(uint256 _visitorId) {
        Visitor storage visitor = visitors[_visitorId];
        require(visitor.sitNumber == _visitorId, "Invalid visitor");
        _;
    }

    modifier onlyValidArtist(string calldata _artistId) {
        Artist storage artist = artists[_artistId];
        require(bytes(artist.name).length > 0, "Invalid artist");
        _;
    }

    modifier onlyHasMeetGreet(uint256 _visitorId) {
        Visitor storage visitor = visitors[_visitorId];
        require(
            visitor.hasMeetGreet == true,
            "Visitor does not have meet and greet"
        );
        _;
    }

    modifier onlyAvailableSit(uint256 _sitNumber) {
        bool sitIsAvailable;
        require(_sitNumber <= maxTickets, "Sit number is not available");

        for (uint i = 0; i < takenSits.length; i++) {
            if (takenSits[i] == _sitNumber) {
                sitIsAvailable = false;
                break;
            }
        }
        require(sitIsAvailable, "Sit number is not available");
        _;
    }

    
    function removeItem(uint256[] memory _stack, uint256 _item) public pure returns (uint256[] memory) {
        require(_stack.length > 0, "Array is empty");

        uint256[] memory newStack = new uint256[](_stack.length - 1);
        uint256 newIndex = 0;

        for (uint256 i = 0; i < _stack.length; i++) {
            if (i != _item) {
                newStack[newIndex] = _stack[i];
                newIndex++;
            }
        }

        return newStack;
    }

    function purchaseTicket(
        string calldata _name,
        uint256 _preferredSit
    ) public onlyBeforeConcertStart onlyAvailableSit(_preferredSit) {
        Visitor storage newVisitor = visitors[_preferredSit];
        takenSits.push(_preferredSit);
        visitorCount++;

        newVisitor.name = _name;
        newVisitor.sitNumber = _preferredSit;
    }

    function burnTicket(uint256 _sitNumber) public onlyAdmin onlyBeforeConcertStart onlyValidVistor(_sitNumber) {
        uint256[] memory _takenSits = takenSits;
        takenSits = removeItem(_takenSits, _sitNumber);
        visitorCount--;
        delete visitors[_sitNumber];
    }

    function bookMeetGreet (uint256 _sitNumber, string calldata _artistId) public onlyBeforeConcertStart onlyValidVistor(_sitNumber) onlyValidArtist(_artistId) {
        require(meetGreetCount < maxMeetGreet, "Sorry, no more space for meet and greet reservation.");
        Visitor storage visitor = visitors[_sitNumber];
        MeetGreet storage newMeetGreet = meetGreets[_sitNumber];
        Artist storage artist = artists[_artistId];

        visitor.hasMeetGreet = true;
        visitor.meetGreetArtist = _artistId;

        artist.meetGreetCount++;

        newMeetGreet.artistId = _artistId;
        newMeetGreet.sitNumber = _sitNumber;
        meetGreetCount++;
    }

    function cancelMeetGreet (uint256 _sitNumber) public onlyBeforeConcertStart onlyValidVistor(_sitNumber) onlyAdmin {
        Visitor storage visitor = visitors[_sitNumber];
        string memory _artistId = visitor.meetGreetArtist;

        Artist storage artist = artists[_artistId];

        visitor.hasMeetGreet = false;
        delete meetGreets[_sitNumber];

        artist.meetGreetCount++;
        meetGreetCount--;
    }
}
