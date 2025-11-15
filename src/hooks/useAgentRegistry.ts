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
      });
    } catch (error) {
      console.error('Register agent error:', error);
      throw error;
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
