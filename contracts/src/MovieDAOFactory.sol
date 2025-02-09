// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MembershipNFT.sol";
import "./FounderNFT.sol";
import "./ScriptNFT.sol";

contract MovieDAOFactory is Ownable {
    struct DAO {
        address creator;
        address daoAddress;
        string movieName;
        address membershipNFT;
        address founderNFT;
        address scriptNFT;
    }

    DAO[] public daos;

    event DAOCreated(address indexed creator, address daoAddress, string movieName, address membershipNFT, address founderNFT, address scriptNFT);

    constructor() Ownable(msg.sender) {}
    function createMovieDAO(string memory movieName) external {
        // Deploy a new DAO contract
        MovieDAO newDAO = new MovieDAO(msg.sender, movieName);

        daos.push(DAO({
            creator: msg.sender,
            daoAddress: address(newDAO),
            movieName: movieName,
            membershipNFT: address(newDAO.membershipNFT()),
            founderNFT: address(newDAO.founderNFT()),
            scriptNFT: address(newDAO.scriptNFT())
        }));
        emit DAOCreated(msg.sender, address(newDAO), movieName, address(newDAO.membershipNFT()), address(newDAO.founderNFT()), address(newDAO.scriptNFT()));
    }

    function getDAOs() external view returns (DAO[] memory) {
        return daos;
    }
}

contract MovieDAO is Ownable {
    string public movieName;
    MembershipNFT public membershipNFT;
    FounderNFT public founderNFT;
    ScriptNFT public scriptNFT;

    //Script Storage
    address public scriptProposer;

    //Voting variables
    mapping(address => bool) public isMember;
    address[] public members;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public hasProposed;
    mapping(address => uint256) public earnings;

    uint8 public yesVotes;
    uint8 public noVotes;
    bool public votingActive;

    event UserJoined(address indexed user);
    event VotingStarted();
    event VoteCast(address indexed voter, bool approved);
    event VotingEnded(bool accepted);
    event ScriptRewarded(address indexed proposer);

    constructor(address creator, string memory _movieName) Ownable(creator) {
        movieName = _movieName;

        // Deploy NFTs
        membershipNFT = new MembershipNFT(address(this));
        founderNFT = new FounderNFT(address(this));
        scriptNFT = new ScriptNFT(address(this));

        // Mint Founder NFT to creator
        founderNFT.mint(creator);
        isMember[creator] = true;
        members.push(creator);
    }

    // Members vote on the proposed script
    function vote(bool _approve) external {
        require(isMember[msg.sender], "Members");
        require(!votingActive, "Going");
        require(!hasProposed[msg.sender], "Done");

        hasVoted[msg.sender] = true;
        if (_approve) {
            yesVotes++;
        } else {
            noVotes++;
        }
        emit VoteCast(msg.sender, _approve);
    }

    // Finalize voting
    function finalizeVoting(address _scriptProposer) external onlyOwner { 

        if (yesVotes > noVotes) {
            scriptNFT.mint(_scriptProposer);
            emit ScriptRewarded(_scriptProposer);
            emit VotingEnded(true);
        } else {
            emit VotingEnded(false);
        }

        // Reset voting
        votingActive = false;
        yesVotes = 0;
        noVotes = 0;

        // Reset votes for all members
        for (uint256 i = 0; i < members.length; i++) {
            hasVoted[members[i]] = false;
        }
    }

    function joinMovieDAO() external {
        require(!isMember[msg.sender], "Already a member");
        isMember[msg.sender] = true;
        members.push(msg.sender);
        membershipNFT.mint(msg.sender);
        emit UserJoined(msg.sender);
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }
}