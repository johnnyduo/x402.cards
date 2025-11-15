import { ethers } from "hardhat";

async function main() {
  console.log("Deploying x402 StreamFlow contracts to IOTA EVM Testnet...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "IOTA\n");

  // Contract addresses
  const USDC_ADDRESS = "0x1ce14fD9dd6678fC3d192f02207d6ff999B04037";
  const FEE_RECIPIENT = deployer.address; // Change to your fee recipient

  // 1. Deploy Agent Registry (EIP-8004)
  console.log("Deploying EIP8004AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("EIP8004AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("✅ AgentRegistry deployed to:", agentRegistryAddress);
  console.log();

  // 2. Deploy Streaming Payments Contract (x402)
  console.log("Deploying X402StreamingPayments...");
  const StreamingPayments = await ethers.getContractFactory("X402StreamingPayments");
  const streamingPayments = await StreamingPayments.deploy(
    USDC_ADDRESS,
    agentRegistryAddress,
    FEE_RECIPIENT
  );
  await streamingPayments.waitForDeployment();
  const streamingPaymentsAddress = await streamingPayments.getAddress();
  console.log("✅ StreamingPayments deployed to:", streamingPaymentsAddress);
  console.log();

  // Display deployment summary
  console.log("=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network: IOTA EVM Testnet (Chain ID: 1076)");
  console.log("Deployer:", deployer.address);
  console.log();
  console.log("Contract Addresses:");
  console.log("  EIP8004AgentRegistry:", agentRegistryAddress);
  console.log("  X402StreamingPayments:", streamingPaymentsAddress);
  console.log();
  console.log("Configuration:");
  console.log("  USDC Token:", USDC_ADDRESS);
  console.log("  Fee Recipient:", FEE_RECIPIENT);
  console.log("  Platform Fee: 1% (100 basis points)");
  console.log("  Min Payment: 0.001 USDC");
  console.log("  Max Stream Duration: 24 hours");
  console.log("=".repeat(60));
  console.log();

  // Optional: Register example agents
  console.log("Registering example agents...");
  
  const agents = [
    {
      id: 1,
      name: "Signal Forge",
      uri: "ipfs://QmSignalForge123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0001", 6) // 0.0001 USDC/sec
    },
    {
      id: 2,
      name: "Volatility Pulse",
      uri: "ipfs://QmVolatilityPulse123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0002", 6)
    },
    {
      id: 3,
      name: "Arb Navigator",
      uri: "ipfs://QmArbNavigator123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0002", 6)
    },
    {
      id: 4,
      name: "Sentiment Radar",
      uri: "ipfs://QmSentimentRadar123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0002", 6)
    },
    {
      id: 5,
      name: "Risk Sentinel",
      uri: "ipfs://QmRiskSentinel123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0002", 6)
    },
    {
      id: 6,
      name: "AI Crawler",
      uri: "ipfs://QmAICrawler123",
      wallet: deployer.address,
      price: ethers.parseUnits("0.0003", 6)
    }
  ];

  for (const agent of agents) {
    console.log(`\nRegistering ${agent.name}...`);
    
    // Register in EIP-8004 registry
    const metadata = [
      {
        key: "agentName",
        value: ethers.toUtf8Bytes(agent.name)
      },
      {
        key: "agentWallet",
        value: ethers.toUtf8Bytes(agent.wallet)
      }
    ];
    
    const registerTx = await agentRegistry.register(agent.uri, metadata);
    await registerTx.wait();
    console.log(`  ✅ Registered in AgentRegistry`);
    
    // Register in streaming payments
    const agentTx = await streamingPayments.registerAgent(
      agent.id,
      agent.wallet,
      agent.price
    );
    await agentTx.wait();
    console.log(`  ✅ Registered in StreamingPayments (${ethers.formatUnits(agent.price, 6)} USDC/sec)`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE! 🎉");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("1. Update frontend config with contract addresses");
  console.log("2. Verify contracts on block explorer:");
  console.log(`   npx hardhat verify --network iotaTestnet ${agentRegistryAddress}`);
  console.log(`   npx hardhat verify --network iotaTestnet ${streamingPaymentsAddress} "${USDC_ADDRESS}" "${agentRegistryAddress}" "${FEE_RECIPIENT}"`);
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
