// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Test.sol";
import "../src/MovieDAOFactory.sol";

contract MovieDAOTest is Test {
    MovieDAOFactory factory;
    address user = address(0x123);
    address voter1 = address(0x456);
    address voter2 = address(0x789);

    function setUp() public {
        factory = new MovieDAOFactory();
    }

    function testCreateMovieDAO() public {
        vm.prank(user);
        factory.createMovieDAO("Test Movie");

        // Verify DAO creation
        assertEq(factory.getDAOs().length, 1);

        (address creator, address daoAddress, string memory movieName, 
         address membershipNFT, address founderNFT, address scriptNFT) = factory.daos(0);

        assertEq(movieName, "Test Movie");
        assertEq(creator, user);
        assertTrue(daoAddress != address(0));
        assertTrue(membershipNFT != address(0));
        assertTrue(founderNFT != address(0));
        assertTrue(scriptNFT != address(0));
    }

    function testJoinMovieDAO() public {
        vm.prank(user);
        factory.createMovieDAO("Test Movie");

        (, address daoAddress,,,,) = factory.daos(0);
        MovieDAO dao = MovieDAO(daoAddress);

        vm.prank(voter1);
        dao.joinMovieDAO();

        address[] memory members = dao.getMembers();
        assertEq(members.length, 2);
        assertEq(members[1], voter1);
    }

    function testVoteFailsIfNotMember() public {
        vm.prank(user);
        factory.createMovieDAO("Test Movie");

        (, address daoAddress,,,,) = factory.daos(0);
        MovieDAO dao = MovieDAO(daoAddress);

        vm.expectRevert("Members");
        vm.prank(voter1);
        dao.vote(true);
    }

    function testFinalizeVotingOnlyOwner() public {
        vm.prank(user); 
        factory.createMovieDAO("Test Movie");

        (, address daoAddress,,,,) = factory.daos(0);
        MovieDAO dao = MovieDAO(daoAddress);

        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, voter1));
        vm.prank(voter1);
        dao.finalizeVoting();
    }
}