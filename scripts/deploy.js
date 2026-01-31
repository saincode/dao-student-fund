import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  chainId: 16602, // 0G Newton Testnet
  chainName: "0G Newton Testnet",
  rpcUrl: "https://evmrpc-testnet.0g.ai",
  blockExplorer: "https://chainscan-newton.0g.ai"
};
`;

    fs.writeFileSync(configPath, configContent);
    console.log("Contract configuration saved to:", configPath);

    console.log("\n✅ Deployment complete!");
    console.log("📝 Contract Address:", contractAddress);
    console.log("🔗 View on 0G Explorer:", `https://chainscan-newton.0g.ai/address/${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
