import { createPublicClient, http, parseUnits } from 'viem';
import { iotaTestnet } from 'viem/chains';

const client = createPublicClient({
  chain: iotaTestnet,
  transport: http('https://json-rpc.evm.testnet.iotaledger.net'),
});

const STREAMING_PAYMENTS_ADDRESS = '0x340DeE0a3EA33304C59d15d37D951A5B72A7b563';

const ABI = [
  {
    inputs: [],
    name: 'minAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
];

async function checkContractSettings() {
  try {
    const minAmount = await client.readContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: ABI,
      functionName: 'minAmount',
      args: [],
    });
    
    console.log(`Min Amount: ${minAmount} (${Number(minAmount) / 1e6} USDC)`);
    
    const owner = await client.readContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: ABI,
      functionName: 'owner',
      args: [],
    });
    
    console.log(`Contract Owner: ${owner}`);
    
    const usdc = await client.readContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: ABI,
      functionName: 'usdc',
      args: [],
    });
    
    console.log(`USDC Address: ${usdc}`);
    
    // Check what price 0.0002/sec is in 6 decimals
    const pricePerSec = parseUnits('0.0002', 6);
    console.log(`\n0.0002 USD/sec = ${pricePerSec} (in 6 decimals)`);
    console.log(`Min Amount = ${minAmount}`);
    
    if (pricePerSec < minAmount) {
      console.log(`\n⚠️  ERROR: Price ${pricePerSec} is BELOW minimum ${minAmount}!`);
    } else {
      console.log(`\n✅ Price ${pricePerSec} is above minimum ${minAmount}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkContractSettings();
