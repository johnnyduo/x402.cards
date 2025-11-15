import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from '@/config/streamingContracts';
import { toast } from 'sonner';

export function useRegisterAgent() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const registerAgent = async (
    agentId: bigint,
    wallet: `0x${string}`,
    pricePerSecond: bigint
  ) => {
    try {
      await writeContract({
        address: STREAMING_PAYMENTS_ADDRESS,
        abi: STREAMING_PAYMENTS_ABI,
        functionName: 'registerAgent',
        args: [agentId, wallet, pricePerSecond],
        gas: 500000n, // Set explicit gas limit
      });
    } catch (error: any) {
      console.error('Register agent error:', error);
      
      // Parse specific error messages
      let errorMessage = 'Failed to register agent';
      
      if (error?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees. Please add more IOTA to your wallet.';
      } else if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error?.message?.includes('already registered')) {
        errorMessage = 'This agent ID is already registered';
      } else if (error?.message?.includes('Price too low')) {
        errorMessage = 'Price too low. Contract requires minimum 0.001 USDC per second (1000 in 6 decimals).';
      } else if (error?.message?.includes('0x49a2f91e')) {
        errorMessage = '⚠️ Access Denied: Only the contract owner can register agents. Please contact the protocol admin.';
      } else if (error?.message?.includes('execution reverted')) {
        errorMessage = 'Transaction reverted. Check price requirements (min 0.001 USDC/sec) and permissions.';
      } else if (error?.shortMessage) {
        errorMessage = error.shortMessage;
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    registerAgent,
    isLoading: isPending || isConfirming,
    hash,
  };
}

export function useUpdateAgent() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const updateAgent = async (
    agentId: bigint,
    wallet: `0x${string}`,
    pricePerSecond: bigint
  ) => {
    try {
      await writeContract({
        address: STREAMING_PAYMENTS_ADDRESS,
        abi: STREAMING_PAYMENTS_ABI,
        functionName: 'updateAgent',
        args: [agentId, wallet, pricePerSecond],
      });
      toast.success('Agent updated successfully');
    } catch (error) {
      console.error('Update agent error:', error);
      toast.error('Failed to update agent');
      throw error;
    }
  };

  return {
    updateAgent,
    isLoading: isPending || isConfirming,
    hash,
  };
}

export function useAgentStats(agentId: bigint) {
  const { data, isLoading, refetch } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'getAgentStats',
    args: [agentId],
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

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
  // Get total agents registered
  const { data: totalAgentsData } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'totalStreamsCreated', // Using this as proxy for now
  });

  // For now, we'll manually query agents 1-6
  // In production, add a getAllAgents() function to the contract
  const agentIds = [1n, 2n, 3n, 4n, 5n, 6n];
  
  const agents = agentIds.map((id) => {
    const stats = useAgentStats(id);
    return {
      id: Number(id),
      ...stats,
    };
  });

  const isLoading = agents.some((agent) => agent.isLoading);

  // Filter out agents that don't exist (wallet is 0x0)
  const validAgents = agents.filter(
    (agent) => agent.wallet !== '0x0' && agent.wallet !== '0x0000000000000000000000000000000000000000'
  );

  return {
    agents: validAgents,
    isLoading,
    refetch: () => {
      agents.forEach((agent) => agent.refetch());
    },
  };
}
