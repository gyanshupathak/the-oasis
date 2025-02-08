// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FounderNFT is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    address public daoAddress;
    bool public founderMinted;

    constructor(address _daoAddress) ERC721("Movie DAO Founder", "MDF") Ownable(_daoAddress) {
        daoAddress = _daoAddress;
    }

    function mint(address to) external onlyOwner {
        require(!founderMinted, "Founder NFT already minted");

        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        founderMinted = true;
    }
}
