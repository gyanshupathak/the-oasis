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
    string public originalScriptCID;
    string public proposedScriptCID;
    address public scriptProposer;

    //Voting variables
    mapping(address => bool) public isMember;
    address[] public members;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public hasProposed;

    uint256 public yesVotes;
    uint256 public noVotes;
    bool public votingActive;

    event UserJoined(address indexed user);
    event ScriptGenerated(string cid);
    event ScriptProposed(address indexed proposer, string cid);
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

    // Founder generates the first script
    function generateScript(string memory _cid) external onlyOwner {
        require(bytes(originalScriptCID).length == 0, "Script already exists");
        originalScriptCID = _cid;
        emit ScriptGenerated(_cid);
    }

    // Any DAO member can propose an edit(ONE TIME PER USER)
    function proposeEdit(string memory _cid) external {
        require(isMember[msg.sender], "Only DAO members can edit");
        require(!votingActive, "Voting in progress");
        require(!hasProposed[msg.sender], "You have already proposed a script");

        proposedScriptCID = _cid;
        scriptProposer = msg.sender;
        votingActive = true;
        yesVotes = 0;
        noVotes = 0;
        hasProposed[msg.sender] = true;

        emit ScriptProposed(msg.sender, _cid);
        emit VotingStarted();
    }

    // Members vote on the proposed script
    function vote(bool _approve) external {
        require(isMember[msg.sender], "Only DAO members can vote");
        require(votingActive, "No active voting");
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;
        if (_approve) {
            yesVotes++;
        } else {
            noVotes++;
        }
        emit VoteCast(msg.sender, _approve);
    }

    // Finalize voting
    function finalizeVoting() external onlyOwner {
        require(votingActive, "No active voting");

        if (yesVotes > noVotes) {
            originalScriptCID = proposedScriptCID; // Accept edit
            scriptNFT.mint(scriptProposer);
            emit ScriptRewarded(scriptProposer);
            emit VotingEnded(true);
        } else {
            emit VotingEnded(false);
        }

        // Reset voting
        proposedScriptCID = "";
        scriptProposer = address(0);
        votingActive = false;

        // Reset votes for all members
        for (uint256 i = 0; i < members.length; i++) {
            hasVoted[members[i]] = false;
        }
    }

    function getScript() external view returns (string memory) {
        return originalScriptCID;
    }

    function getProposedScript() external view returns (string memory) {
        return proposedScriptCID;
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
