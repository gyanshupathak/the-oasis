// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipNFT is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;

    constructor(address initialOwner) ERC721("Movie DAO Membership", "MDM") Ownable(initialOwner) {}

    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
