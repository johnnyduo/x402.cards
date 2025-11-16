import { useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from 'wagmi';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from '@/config/streamingContracts';
import { toast } from 'sonner';

export function useRegisterAgent() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const publicClient = usePublicClient();
  
  const registerAgent = async (
    agentId: bigint,
    wallet: `0x${string}`,
    pricePerSecond: bigint
  ) => {
    let txHash: `0x${string}` | undefined;
    
    try {
      // Submit transaction
      txHash = await writeContractAsync({
        address: STREAMING_PAYMENTS_ADDRESS,
        abi: STREAMING_PAYMENTS_ABI,
        functionName: 'registerAgent',
        args: [agentId, wallet, pricePerSecond],
        gas: 500000n,
      } as any);

      // Wait for transaction receipt
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ 
          hash: txHash,
          confirmations: 1
        });

        // Check if transaction was successful
        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted on-chain');
        }
      }

      return { success: true, txHash };
      
    } catch (error: any) {
      console.error('❌ Register agent error:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        shortMessage: error?.shortMessage,
        cause: error?.cause,
        data: error?.data,
        details: error?.details,
      });
      
      // Parse specific error messages
      let errorMessage = 'Transaction failed';
      let errorDetails = '';
      
      // Extract error information from multiple sources
      const errorStr = JSON.stringify(error).toLowerCase();
      const errorMsg = (error?.message || '').toLowerCase();
      const shortMsg = error?.shortMessage || '';
      const causeReason = error?.cause?.reason || '';
      const metaMessages = error?.metaMessages || [];
      const details = error?.details || '';
      
      // Check all possible error sources
      const allErrorText = [errorMsg, errorStr, causeReason, shortMsg, details, ...metaMessages]
        .join(' ')
        .toLowerCase();
      
      if (allErrorText.includes('agent already registered')) {
        errorMessage = 'Agent Already Registered';
        errorDetails = 'This agent ID is already registered on-chain. Use the Manage Agents tab to update it, or choose a different agent.';
      } else if (allErrorText.includes('price too low')) {
        errorMessage = 'Price Too Low';
        errorDetails = 'Minimum price is 0.001 USDC per second (1000 wei). Please increase the price.';
      } else if (allErrorText.includes('invalid wallet')) {
        errorMessage = 'Invalid Wallet Address';
        errorDetails = 'The wallet address cannot be 0x0. Please provide a valid address.';
      } else if (allErrorText.includes('insufficient funds') || allErrorText.includes('insufficient balance')) {
        errorMessage = 'Insufficient Funds';
        errorDetails = 'Not enough IOTA for gas fees. Please add funds to your wallet.';
      } else if (allErrorText.includes('user rejected') || allErrorText.includes('user denied')) {
        errorMessage = 'Transaction Rejected';
        errorDetails = 'You cancelled the transaction in your wallet.';
      } else if (allErrorText.includes('execution reverted') || allErrorText.includes('reverted')) {
        // Try to extract the specific revert reason
        const revertMatch = error?.message?.match(/reverted with reason string '([^']+)'/) ||
                           error?.message?.match(/reverted: ([^\n]+)/);
        if (revertMatch) {
          errorMessage = 'Contract Rejected Transaction';
          errorDetails = revertMatch[1];
        } else {
          errorMessage = 'Transaction Reverted';
          errorDetails = shortMsg || causeReason || details || 'The contract rejected this transaction. This usually means the agent is already registered or requirements are not met.';
        }
      } else if (shortMsg) {
        errorMessage = 'Transaction Failed';
        errorDetails = shortMsg;
      } else if (error?.message) {
        errorMessage = 'Transaction Failed';
        errorDetails = error.message.slice(0, 200);
      }
      
      return { 
        success: false, 
        txHash, 
        error: errorMessage,
        errorDetails 
      };
    }
  };

  return {
    registerAgent,
    isLoading: isPending,
    hash,
  };
}

export function useUpdateAgent() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const publicClient = usePublicClient();

  const updateAgent = async (
    agentId: bigint,
    wallet: `0x${string}`,
    pricePerSecond: bigint
  ) => {
    let txHash: `0x${string}` | undefined;
    
    try {
      txHash = await writeContractAsync({
        address: STREAMING_PAYMENTS_ADDRESS,
        abi: STREAMING_PAYMENTS_ABI,
        functionName: 'updateAgent',
        args: [agentId, wallet, pricePerSecond],
        gas: 500000n,
      } as any);

      // Wait for confirmation
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ 
          hash: txHash,
          confirmations: 1
        });

        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted on-chain');
        }
      }

      return { success: true, txHash };
      
    } catch (error: any) {
      console.error('❌ Update agent error:', error);
      
      let errorMessage = 'Update failed';
      let errorDetails = error?.shortMessage || error?.message?.slice(0, 100) || 'Unknown error';
      
      return { 
        success: false, 
        txHash, 
        error: errorMessage,
        errorDetails 
      };
    }
  };

  return {
    updateAgent,
    isLoading: isPending,
    hash,
  };
}

export function useAgentStats(agentId: bigint) {
  const { data, isLoading, refetch, error } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'getAgentStats',
    args: [agentId],
    blockTag: 'latest', // Explicitly query latest block
    query: {
      gcTime: 0, // Don't cache
      staleTime: 0, // Always refetch
    },
  });

  // Debug logging
  if (agentId === 1n) {
    console.log(`🔍 Agent #${agentId} read result:`, { 
      data, 
      isLoading, 
      error: error?.message,
      hasError: !!error 
    });
  }

  if (!data) {
    return {
      wallet: '0x0',
      pricePerSecond: BigInt(0),
      isActive: false,
      totalEarned: BigInt(0),
      totalStreams: BigInt(0),
      isLoading,
      refetch,
    };
  }

  const [wallet, pricePerSecond, isActive, totalEarned, totalStreams] = data as [
    string,
    bigint,
    boolean,
    bigint,
    bigint
  ];

  return {
    wallet: wallet as `0x${string}`,
    pricePerSecond,
    isActive,
    totalEarned,
    totalStreams,
    isLoading,
    refetch,
  };
}

export function useAllAgents() {
  // Query all predefined agent IDs (1-6)
  // Note: Contract doesn't have a function to get total agent count
  const agentIds = [1n, 2n, 3n, 4n, 5n, 6n];
  
  const agents = agentIds.map((id) => {
    const stats = useAgentStats(id);
    return {
      id: Number(id),
      ...stats,
    };
  });

  const isLoading = agents.some((agent) => agent.isLoading);

  // Filter out agents that don't exist (wallet is 0x0 or not active)
  const validAgents = agents.filter((agent) => {
    return agent.isActive && 
           agent.wallet !== '0x0' && 
           agent.wallet !== '0x0000000000000000000000000000000000000000';
  });

  return {
    agents: validAgents,
    isLoading,
    refetch: () => {
      agents.forEach((agent) => agent.refetch());
    },
  };
}
