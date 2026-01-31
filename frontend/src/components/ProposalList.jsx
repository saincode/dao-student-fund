import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractConfig';
import './ProposalList.css';

function ProposalList({ signer, account }) {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [votingProposal, setVotingProposal] = useState(null);

    const loadProposals = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const proposalCount = await contract.proposalCount();

            const proposalsData = [];
            for (let i = 0; i < proposalCount; i++) {
                const proposal = await contract.getProposal(i);
                const hasVoted = await contract.hasVoted(i, account);

                proposalsData.push({
                    id: proposal[0].toString(),
                    proposer: proposal[1],
                    title: proposal[2],
                    description: proposal[3],
                    amount: ethers.formatEther(proposal[4]),
                    yesVotes: proposal[5].toString(),
                    noVotes: proposal[6].toString(),
                    status: proposal[7], // 0: Pending, 1: Approved, 2: Rejected
                    createdAt: new Date(Number(proposal[8]) * 1000),
                    hasVoted
                });
            }

            setProposals(proposalsData.reverse()); // Show newest first
            setLoading(false);
        } catch (err) {
            console.error('Error loading proposals:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (signer && account) {
            loadProposals();
        }
    }, [signer, account]);

    const handleVote = async (proposalId, support) => {
        setVotingProposal(proposalId);

        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.vote(proposalId, support);
            console.log('Vote transaction sent:', tx.hash);

            await tx.wait();
            console.log('Vote recorded successfully!');

            alert(`✅ Vote recorded successfully!`);
            await loadProposals(); // Reload proposals

        } catch (err) {
            console.error('Error voting:', err);
            alert(`❌ Failed to vote: ${err.message}`);
        } finally {
            setVotingProposal(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge badge-pending">Pending</span>;
            case 1:
                return <span className="badge badge-approved">Approved</span>;
            case 2:
                return <span className="badge badge-rejected">Rejected</span>;
            default:
                return null;
        }
    };

    const filteredProposals = proposals.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'pending') return p.status === 0;
        if (filter === 'approved') return p.status === 1;
        if (filter === 'rejected') return p.status === 2;
        return true;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Loading proposals...</p>
            </div>
        );
    }

    return (
        <div className="proposal-list">
            <div className="list-header">
                <h2 className="section-title">All Proposals</h2>
                <div className="filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({proposals.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({proposals.filter(p => p.status === 0).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved ({proposals.filter(p => p.status === 1).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected ({proposals.filter(p => p.status === 2).length})
                    </button>
                </div>
            </div>

            {filteredProposals.length === 0 ? (
                <div className="empty-state card">
                    <span className="empty-icon">📭</span>
                    <h3>No proposals found</h3>
                    <p>Be the first to create a proposal!</p>
                </div>
            ) : (
                <div className="proposals-grid">
                    {filteredProposals.map((proposal) => (
                        <div key={proposal.id} className="proposal-card card">
                            <div className="proposal-header">
                                <div className="proposal-meta">
                                    <span className="proposal-id">#{proposal.id}</span>
                                    {getStatusBadge(proposal.status)}
                                </div>
                                <span className="proposal-amount">{proposal.amount} ETH</span>
                            </div>

                            <h3 className="proposal-title">{proposal.title}</h3>
                            <p className="proposal-description">{proposal.description}</p>

                            <div className="proposal-info">
                                <div className="info-item">
                                    <span className="info-label">Proposer:</span>
                                    <span className="info-value">
                                        {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(38)}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Created:</span>
                                    <span className="info-value">{proposal.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="vote-stats">
                                <div className="vote-bar">
                                    <div
                                        className="vote-bar-yes"
                                        style={{
                                            width: `${(parseInt(proposal.yesVotes) / (parseInt(proposal.yesVotes) + parseInt(proposal.noVotes) || 1)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <div className="vote-counts">
                                    <span className="vote-yes">👍 {proposal.yesVotes} Yes</span>
                                    <span className="vote-no">👎 {proposal.noVotes} No</span>
                                </div>
                            </div>

                            {proposal.status === 0 && (
                                <div className="vote-actions">
                                    {proposal.hasVoted ? (
                                        <div className="already-voted">
                                            ✅ You have already voted on this proposal
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleVote(proposal.id, true)}
                                                disabled={votingProposal === proposal.id}
                                            >
                                                {votingProposal === proposal.id ? (
                                                    <span className="spinner"></span>
                                                ) : (
                                                    '👍 Vote Yes'
                                                )}
                                            </button>
                                            <button
                                                className="btn btn-error"
                                                onClick={() => handleVote(proposal.id, false)}
                                                disabled={votingProposal === proposal.id}
                                            >
                                                {votingProposal === proposal.id ? (
                                                    <span className="spinner"></span>
                                                ) : (
                                                    '👎 Vote No'
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProposalList;
