import './WalletConnect.css';

function WalletConnect({ account, onConnect, onDisconnect }) {
    const truncateAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="wallet-connect">
            {!account ? (
                <button className="btn btn-primary" onClick={onConnect}>
                    🔗 Connect Wallet
                </button>
            ) : (
                <div className="wallet-info">
                    <div className="wallet-address">
                        <span className="wallet-icon">👤</span>
                        <span className="address">{truncateAddress(account)}</span>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={onDisconnect}>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}

export default WalletConnect;
