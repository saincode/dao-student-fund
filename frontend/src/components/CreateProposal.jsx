import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractConfig';
import './CreateProposal.css';

function CreateProposal({ signer, onSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title || !description || !amount) {
            setError('Please fill in all fields');
            return;
        }

        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);

        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const amountInWei = ethers.parseEther(amount);

            const tx = await contract.createProposal(title, description, amountInWei);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Proposal created successfully!');

            // Reset form
            setTitle('');
            setDescription('');
            setAmount('');

            alert('✅ Proposal created successfully!');
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error('Error creating proposal:', err);
            setError(err.message || 'Failed to create proposal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-proposal">
            <div className="card">
                <h2 className="section-title">Create New Proposal</h2>
                <p className="section-description">
                    Submit a spending proposal for the DAO to vote on. Be clear and specific about how funds will be used.
                </p>

                <form onSubmit={handleSubmit} className="proposal-form">
                    <div className="form-group">
                        <label htmlFor="title">Proposal Title</label>
                        <input
                            id="title"
                            type="text"
                            className="input"
                            placeholder="e.g., Purchase event tickets for tech conference"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="input"
                            placeholder="Provide detailed information about the proposal..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows="5"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount (ETH)</label>
                        <input
                            id="amount"
                            type="number"
                            step="0.001"
                            className="input"
                            placeholder="0.5"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading}
                        />
                        <small className="form-hint">Amount in ETH (Sepolia testnet)</small>
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Proposal...
                            </>
                        ) : (
                            '📝 Create Proposal'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProposal;
