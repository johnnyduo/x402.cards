import { createPublicClient, http } from 'viem';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from './src/config/streamingContracts';

const client = createPublicClient({
  transport: http('https://json-rpc.evm.testnet.iota.cafe')
});

async function testRead() {
  try {
    console.log('Testing getAgentStats(1)...');
    console.log('Contract:', STREAMING_PAYMENTS_ADDRESS);
    
    const result = await client.readContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'getAgentStats',
      args: [1n],
    });

    console.log('✅ Result:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testRead();
