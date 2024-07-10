// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.13;

contract NFTCount {
    uint256 public nftCount;

    function incrementCOunt() public  {
        nftCount++;
    }
    
    function decrementCOunt() public  {
        nftCount--;
    }

    function checkTotalNFTCount() public view returns (uint256) {
        return nftCount;
    }

    function addToNFTCount(uint256 _a, uint256 _b) public returns (uint256){
        uint256 calc = _a + _b;
        nftCount += calc;

        return nftCount;
    }
}