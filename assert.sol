// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract assertCOntract {
    bool result;
    uint256[] data;

    function checkOverFlow(uint256 _num1, uint256 _num2) public {
        uint256 sum = _num1 + _num2;
        assert(sum <= 255);
        result = true;
    }

    function testRequire(uint256 _testParam) public pure returns (bool) {
        require(_testParam > 200, "Testb  param is lower than 200");
        return true;
    }

    function simpleWhileLoop(uint256 _base) public pure returns (uint256) {
        while (_base > 5) {
            _base--;
        }

        return _base;
    }

    function simpleForLoop(uint256 _base) public returns (uint256[] memory) {
        for (_base; _base < 5; _base++){
            data.push(_base);   
            _base++;
        }

        return data;
    }

    function simpleDoWhileLoop(uint _base) public pure returns (uint) {
        do {
            _base--;
        } 
        while (_base > 5);

        return _base;
    }

    function getResult() public view returns (string memory) {
        if (result == true) {
            return "No Overflow";
        }else{
            return "Has an Overflow";
        }
    }

}