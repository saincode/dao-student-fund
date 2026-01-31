// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StudentFundDAO
 * @dev A decentralized autonomous organization for transparent student fund management
 */
contract StudentFundDAO {
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 amount; // Amount in wei
        uint256 yesVotes;
        uint256 noVotes;
        ProposalStatus status;
        uint256 createdAt;
        mapping(address => bool) hasVoted;
    }
    
    // Proposal status enum
    enum ProposalStatus {
        Pending,
        Approved,
        Rejected
    }
    
    // State variables
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public members;
    uint256 public memberCount;
    
    // Voting threshold (percentage needed for approval)
    uint256 public constant APPROVAL_THRESHOLD = 50; // 50% approval needed
    
    // Events
    event MemberJoined(address indexed member);
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 amount
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );
    event ProposalStatusChanged(
        uint256 indexed proposalId,
        ProposalStatus status
    );
    
    // Modifiers
    modifier onlyMember() {
        if (!members[msg.sender]) {
            members[msg.sender] = true;
            memberCount++;
            emit MemberJoined(msg.sender);
        }
        _;
    }
    
    /**
     * @dev Create a new spending proposal
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _amount
    ) external onlyMember returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_amount > 0, "Amount must be greater than 0");
        
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
        newProposal.status = ProposalStatus.Pending;
        newProposal.createdAt = block.timestamp;
        
        emit ProposalCreated(proposalId, msg.sender, _title, _amount);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 _proposalId, bool _support) external onlyMember {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal is not pending");
        require(!proposal.hasVoted[msg.sender], "Already voted on this proposal");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support);
        
        // Update proposal status based on votes
        _updateProposalStatus(_proposalId);
    }
    
    /**
     * @dev Internal function to update proposal status
     */
    function _updateProposalStatus(uint256 _proposalId) internal {
        Proposal storage proposal = proposals[_proposalId];
        
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        
        // Need at least 3 votes to finalize (for demo purposes)
        if (totalVotes >= 3) {
            uint256 approvalPercentage = (proposal.yesVotes * 100) / totalVotes;
            
            if (approvalPercentage > APPROVAL_THRESHOLD) {
                proposal.status = ProposalStatus.Approved;
                emit ProposalStatusChanged(_proposalId, ProposalStatus.Approved);
            } else {
                proposal.status = ProposalStatus.Rejected;
                emit ProposalStatusChanged(_proposalId, ProposalStatus.Rejected);
            }
        }
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 amount,
        uint256 yesVotes,
        uint256 noVotes,
        ProposalStatus status,
        uint256 createdAt
    ) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.amount,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.status,
            proposal.createdAt
        );
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     */
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        return proposals[_proposalId].hasVoted[_voter];
    }
    
    /**
     * @dev Get all proposal IDs
     */
    function getAllProposalIds() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](proposalCount);
        for (uint256 i = 0; i < proposalCount; i++) {
            ids[i] = i;
        }
        return ids;
    }
}
