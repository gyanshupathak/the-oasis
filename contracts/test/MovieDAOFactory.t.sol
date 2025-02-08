// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Test.sol";
import "../src/MovieDAOFactory.sol";

contract MovieDAOTest is Test {
    MovieDAOFactory factory;

    function setUp() public {
        factory = new MovieDAOFactory();
    }

    function testCreateMovieDAO() public {
        address user = address(0x123);

        vm.prank(user);

        factory.createMovieDAO("Test Movie");
        (address creator, address daoAddress, string memory movieName, address membershipNFT, address founderNFT, address scriptNFT) = factory.daos(0);
        assertEq(movieName, "Test Movie");
        assertEq(creator, user);
    }
}
