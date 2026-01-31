import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import CreateProposal from './components/CreateProposal';
import ProposalList from './components/ProposalList';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);

        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
          alert('Please switch to Sepolia testnet');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>🎓 Student Fund DAO</h1>
              <p className="tagline">Transparent. Decentralized. Democratic.</p>
            </div>
            <WalletConnect
              account={account}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {!account ? (
            <div className="welcome-section fade-in">
              <div className="welcome-card card">
                <h2 className="welcome-title">Welcome to Student Fund DAO</h2>
                <p className="welcome-text">
                  A decentralized autonomous organization for transparent student fund management.
                  Connect your wallet to create proposals, vote, and participate in democratic decision-making.
                </p>
                <div className="features">
                  <div className="feature">
                    <span className="feature-icon">🔗</span>
                    <h3>Connect Wallet</h3>
                    <p>Use MetaMask to join the DAO</p>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📝</span>
                    <h3>Create Proposals</h3>
                    <p>Submit spending proposals for community review</p>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🗳️</span>
                    <h3>Vote</h3>
                    <p>Cast your vote on active proposals</p>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">⛓️</span>
                    <h3>Blockchain Verified</h3>
                    <p>All actions recorded on-chain</p>
                  </div>
                </div>
                <button className="btn btn-primary btn-large" onClick={connectWallet}>
                  Connect Wallet to Get Started
                </button>
              </div>
            </div>
          ) : (
            <>
              <nav className="tabs">
                <button
                  className={`tab ${activeTab === 'proposals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('proposals')}
                >
                  📋 View Proposals
                </button>
                <button
                  className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create')}
                >
                  ➕ Create Proposal
                </button>
              </nav>

              <div className="tab-content fade-in">
                {activeTab === 'proposals' ? (
                  <ProposalList signer={signer} account={account} />
                ) : (
                  <CreateProposal signer={signer} onSuccess={() => setActiveTab('proposals')} />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Built with ❤️ for transparent student fund management | Powered by Ethereum</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
