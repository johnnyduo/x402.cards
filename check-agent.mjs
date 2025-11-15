import { createPublicClient, http } from 'viem';
import { iotaTestnet } from 'viem/chains';

const client = createPublicClient({
  chain: iotaTestnet,
  transport: http('https://json-rpc.evm.testnet.iotaledger.net'),
});

const STREAMING_PAYMENTS_ADDRESS = '0x37E141fF46c431D8B8C781f0f1d9b6E1A88d93b9';

const ABI = [
  {
    inputs: [{ name: 'agentId', type: 'uint256' }],
    name: 'agents',
    outputs: [
      { name: 'wallet', type: 'address' },
      { name: 'pricePerSecond', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'totalEarned', type: 'uint256' },
      { name: 'totalStreams', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

async function checkAgent(agentId) {
  try {
    const result = await client.readContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: ABI,
      functionName: 'agents',
      args: [BigInt(agentId)],
    });
    
    console.log(`\nAgent ID ${agentId}:`);
    console.log(`  Wallet: ${result[0]}`);
    console.log(`  Price: ${result[1]}`);
    console.log(`  Active: ${result[2]}`);
    console.log(`  Total Earned: ${result[3]}`);
    console.log(`  Total Streams: ${result[4]}`);
    
    if (result[2]) {
      console.log(`  ⚠️  Agent ${agentId} is ALREADY REGISTERED!`);
    } else {
      console.log(`  ✅ Agent ${agentId} is available for registration`);
    }
  } catch (error) {
    console.error(`Error checking agent ${agentId}:`, error.message);
  }
}

// Check agents 1-4
console.log('Checking agent registration status...\n');
for (let i = 1; i <= 4; i++) {
  await checkAgent(i);
}
