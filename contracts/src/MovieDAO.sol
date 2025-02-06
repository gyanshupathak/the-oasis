// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MovieDAO {
    struct DAO {
        address creator;
        address daoAddress;
        string movieName;
    }

    DAO[] public daos;

    event DAOCreated(address indexed creator, address daoAddress, string movieName);

    function createMovieDAO(string memory movieName) external {
        MovieDAO newDAO = new MovieDAO(msg.sender, movieName);
        daos.push(DAO({
            creator: msg.sender,
            daoAddress: address(newDAO),
            movieName: movieName
        }));
        emit DAOCreated(msg.sender, address(newDAO), movieName);
    }

    function getDAOs() external view returns (DAO[] memory) {
        return daos;
    }
}

contract MovieDAO is Ownable {
    string public movieName;

    constructor(address creator, string memory _movieName) Ownable(creator) {
        movieName = _movieName;
    }
}
