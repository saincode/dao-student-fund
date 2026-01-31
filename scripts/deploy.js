const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying StudentFundDAO contract...");

    // Deploy the contract
    const StudentFundDAO = await hre.ethers.getContractFactory("StudentFundDAO");
    const dao = await StudentFundDAO.deploy();

    await dao.waitForDeployment();

    const contractAddress = await dao.getAddress();
    console.log("StudentFundDAO deployed to:", contractAddress);

    // Save contract address and ABI for frontend
    const contractData = {
        address: contractAddress,
        abi: JSON.parse(dao.interface.formatJson())
    };

    // Create frontend src directory if it doesn't exist
    const frontendSrcDir = path.join(__dirname, "..", "frontend", "src");
    if (!fs.existsSync(frontendSrcDir)) {
        fs.mkdirSync(frontendSrcDir, { recursive: true });
    }

    // Write contract config file
    const configPath = path.join(frontendSrcDir, "contractConfig.js");
    const configContent = `// Auto-generated contract configuration
export const CONTRACT_ADDRESS = "${contractAddress}";

export const CONTRACT_ABI = ${JSON.stringify(contractData.abi, null, 2)};

export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  chainName: "Sepolia Testnet",
  rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
};
`;

    fs.writeFileSync(configPath, configContent);
    console.log("Contract configuration saved to:", configPath);

    console.log("\n✅ Deployment complete!");
    console.log("📝 Contract Address:", contractAddress);
    console.log("🔗 View on Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
