// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Script.sol";
import "../src/MovieDAO.sol";
import "../src/MembershipNFT.sol";

contract Deploy is Script {
    function run() external {
        address deployer = msg.sender;
        vm.startBroadcast();

        MembershipNFT nft = new MembershipNFT(deployer);
        console.log("MembershipNFT deployed at:", address(nft));

        MovieDAO factory = new MovieDAO();
        console.log("MovieDAO deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
