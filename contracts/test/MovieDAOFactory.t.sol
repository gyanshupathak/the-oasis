// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Test.sol";
import "../src/MovieDAO.sol";

contract MovieDAOTest is Test {
    MovieDAO factory;

    function setUp() public {
        factory = new MovieDAO();
    }

    function testCreateMovieDAO() public {
        address user = address(0x123);

        vm.prank(user);

        factory.createMovieDAO("Test Movie");
        (address creator, address daoAddress, string memory movieName) = factory.daos(0);
        assertEq(movieName, "Test Movie");
        assertEq(creator, user);
    }
}
