# DAO-Based Student Fund Management

A Web3-based Decentralized Autonomous Organization (DAO) for transparent student fund management. Built with Solidity smart contracts and React frontend.

## 🚀 Live Demo

**🌐 Live App:** [https://dao-student-fund.vercel.app](https://dao-student-fund.vercel.app)

**📝 Smart Contract:** `0xc854a5efC0998bb8b03a207705f0b6ae017B7EC8`

**🔗 Block Explorer:** [View on 0G Explorer](https://chainscan-newton.0g.ai/address/0xc854a5efC0998bb8b03a207705f0b6ae017B7EC8)

**⛓️ Network:** 0G Newton Testnet (Chain ID: 16602)

## 💸 Problem & Solution

### The Problem
Traditional student fund management suffers from:
*   **Lack of Transparency:** Funds are often managed in "black boxes" (private accounts/spreadsheets), making it impossible for students to see real-time status.
*   **Risk of Mismanagement:** Centralized control by a few individuals leads to potential fraud or unauthorized spending.
*   **Bureaucratic Delays:** Paper-based approvals can take weeks to process.
*   **Centralized Decision Making:** A small committee makes decisions for the entire student body without direct input from the students they represent.

### The Solution: Student Fund DAO
Our platform leverages blockchain technology to provide:
*   **Verifiable Transparency:** Every transaction and vote is recorded on the **0G Newton Testnet**, visible to all members.
*   **Smart Contract Security:** Funds are governed by code, ensuring they can only be moved through community-approved votes.
*   **Decentralized Democracy:** Every student has an equal voice. Proposals for spending must be voted on and approved by the majority of the members.
*   **Instant Efficiency:** Voting and proposal finalization happen in seconds, eliminating traditional administrative overhead.

## 🌟 Features

- **Wallet Connection**: Connect via MetaMask to join the DAO
- **Create Proposals**: Submit spending proposals with title, description, and amount
- **Democratic Voting**: Vote Yes/No on proposals
- **Transparent Results**: All votes and proposals stored on blockchain
- **Status Tracking**: View approved, rejected, and pending proposals
- **Real-time Updates**: Live vote counts and proposal status

## 🛠️ Tech Stack

**Blockchain:**
- Solidity ^0.8.20
- Hardhat (Development Framework)
- ethers.js v6
- 0G Newton Testnet (Chain ID: 16602)

**Frontend:**
- React 18
- Vite
- Modern CSS with Glassmorphism
- Responsive Design

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MetaMask browser extension
- Sepolia testnet ETH (from faucets)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/saincode/dao-student-fund.git
cd dao-student-fund
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your credentials:
# - SEPOLIA_RPC_URL (from Alchemy or Infura)
# - PRIVATE_KEY (for deployment)
```

## 🚀 Deployment

### Deploy Smart Contract to Sepolia

1. Get Sepolia testnet ETH from a faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. Deploy the contract:
```bash
npm run deploy:sepolia
```

3. The deployment script will automatically:
   - Deploy the StudentFundDAO contract
   - Save the contract address and ABI to `frontend/src/contractConfig.js`
   - Display the contract address and Etherscan link

### Run Frontend

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:5173`

## 📖 Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure you're on Sepolia testnet

### 2. Create a Proposal
- Click "Create Proposal" tab
- Fill in:
  - **Title**: Brief description (e.g., "Buy event tickets")
  - **Description**: Detailed explanation
  - **Amount**: ETH amount needed
- Click "Create Proposal"
- Confirm transaction in MetaMask

### 3. Vote on Proposals
- View all proposals in "View Proposals" tab
- Filter by status (All/Pending/Approved/Rejected)
- Click "Vote Yes" or "Vote No" on pending proposals
- Confirm transaction in MetaMask
- Each address can vote once per proposal

### 4. Proposal Status
- **Pending**: Awaiting votes (needs 3+ votes)
- **Approved**: >50% yes votes
- **Rejected**: ≤50% yes votes

## 🔗 Testnet Resources

- **Sepolia Faucets**:
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia
  
- **Sepolia Explorer**:
  - https://sepolia.etherscan.io/

- **Add Sepolia to MetaMask**:
  - Network Name: Sepolia
  - RPC URL: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
  - Chain ID: 11155111
  - Currency Symbol: ETH

## 🏗️ Project Structure

```
dao-student-fund/
├── contracts/
│   └── StudentFundDAO.sol      # Main DAO smart contract
├── scripts/
│   └── deploy.js               # Deployment script
├── test/
│   └── StudentFundDAO.test.js  # Contract tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.jsx
│   │   │   ├── CreateProposal.jsx
│   │   │   └── ProposalList.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── contractConfig.js   # Auto-generated after deployment
│   ├── index.html
│   └── vite.config.js
├── hardhat.config.js
└── package.json
```

## 🧪 Testing

Run smart contract tests:
```bash
npm test
```

## 🤝 Contributing

This is a hackathon MVP project. Contributions are welcome!

## 📄 License

MIT License

## ⚠️ Disclaimer

This project uses Sepolia testnet and does not involve real money. It's designed for educational and demonstration purposes.

---

Built with ❤️ for transparent student fund management
