// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Script.sol";
import "../src/MovieDAOFactory.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        MovieDAOFactory factory = new MovieDAOFactory();
        console.log("MovieDAO deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
