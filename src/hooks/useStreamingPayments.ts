import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from '@/config/streamingContracts';
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from '@/config/contracts';
import { useState, useEffect } from 'react';

/**
 * Hook to create a new streaming payment to an agent
 */
export function useCreateStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createStream = async (agentId: number, durationInSeconds: number) => {
    return writeContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'createStream',
      args: [BigInt(agentId), BigInt(durationInSeconds)],
    });
  };

  return {
    createStream,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to approve USDC spending for streaming payments
 */
export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = async (amount: bigint) => {
    return writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [STREAMING_PAYMENTS_ADDRESS, amount],
    });
  };

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to check USDC allowance
 */
export function useUSDCAllowance() {
  const { address } = useAccount();

  const { data: allowance, refetch } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, STREAMING_PAYMENTS_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    allowance: allowance as bigint | undefined,
    refetch,
  };
}

/**
 * Hook to get active stream ID for user and agent
 */
export function useActiveStream(agentId: number) {
  const { address } = useAccount();

  const { data: streamId, refetch } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'activeStreams',
    args: address && agentId ? [address, BigInt(agentId)] : undefined,
    query: {
      enabled: !!address && agentId > 0,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  return {
    streamId: streamId as bigint | undefined,
    hasActiveStream: streamId ? Number(streamId) > 0 : false,
    refetch,
  };
}

/**
 * Hook to get stream details and claimable amount
 */
export function useStreamDetails(streamId: number | bigint | undefined) {
  const { data: details, refetch } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'getStreamDetails',
    args: streamId ? [BigInt(streamId)] : undefined,
    query: {
      enabled: !!streamId && Number(streamId) > 0,
      refetchInterval: 1000, // Refetch every second for real-time updates
    },
  });

  if (!details) {
    return {
      details: null,
      claimableAmount: 0n,
      claimableFormatted: '0',
      totalPaidFormatted: '0',
      isActive: false,
      refetch,
    };
  }

  const [payer, agentId, agentWallet, amountPerSecond, startTime, endTime, totalPaid, claimable, active] = details as [
    string,
    bigint,
    string,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    boolean
  ];

  return {
    details: {
      payer,
      agentId: Number(agentId),
      agentWallet,
      amountPerSecond,
      startTime: Number(startTime),
      endTime: Number(endTime),
      totalPaid,
      claimable,
      active,
    },
    claimableAmount: claimable,
    claimableFormatted: formatUnits(claimable, 6),
    totalPaidFormatted: formatUnits(totalPaid, 6),
    isActive: active,
    refetch,
  };
}

/**
 * Hook to claim from a stream
 */
export function useClaimStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = async (streamId: number | bigint) => {
    return writeContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'claimStream',
      args: [BigInt(streamId)],
    });
  };

  return {
    claim,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to pause a stream
 */
export function usePauseStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const pause = async (streamId: number | bigint) => {
    return writeContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'pauseStream',
      args: [BigInt(streamId)],
    });
  };

  return {
    pause,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to cancel a stream
 */
export function useCancelStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancel = async (streamId: number | bigint) => {
    return writeContract({
      address: STREAMING_PAYMENTS_ADDRESS,
      abi: STREAMING_PAYMENTS_ABI,
      functionName: 'cancelStream',
      args: [BigInt(streamId)],
    });
  };

  return {
    cancel,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to get agent statistics
 */
export function useAgentStats(agentId: number) {
  const { data: stats, refetch } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'getAgentStats',
    args: agentId ? [BigInt(agentId)] : undefined,
    query: {
      enabled: agentId > 0,
      refetchInterval: 5000,
    },
  });

  if (!stats) {
    return {
      stats: null,
      totalEarnedFormatted: '0',
      pricePerSecondFormatted: '0',
      refetch,
    };
  }

  const [wallet, pricePerSecond, isActive, totalEarned, totalStreams] = stats as [
    string,
    bigint,
    boolean,
    bigint,
    bigint
  ];

  return {
    stats: {
      wallet,
      pricePerSecond,
      isActive,
      totalEarned,
      totalStreams: Number(totalStreams),
    },
    totalEarnedFormatted: formatUnits(totalEarned, 6),
    pricePerSecondFormatted: formatUnits(pricePerSecond, 6),
    refetch,
  };
}

/**
 * Combined hook for complete stream management
 */
export function useStreamingPayment(agentId: number) {
  const { address } = useAccount();
  const { streamId, hasActiveStream, refetch: refetchActive } = useActiveStream(agentId);
  const { details, claimableAmount, claimableFormatted, isActive, refetch: refetchDetails } = useStreamDetails(streamId);
  const { createStream, isPending: isCreating } = useCreateStream();
  const { claim, isPending: isClaiming } = useClaimStream();
  const { pause, isPending: isPausing } = usePauseStream();
  const { cancel, isPending: isCancelling } = useCancelStream();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving } = useApproveUSDC();

  // Auto-refetch when transactions complete
  useEffect(() => {
    if (!isCreating && !isClaiming && !isPausing && !isCancelling) {
      refetchActive();
      refetchDetails();
    }
  }, [isCreating, isClaiming, isPausing, isCancelling, refetchActive, refetchDetails]);

  return {
    // State
    address,
    streamId,
    hasActiveStream,
    isActive,
    details,
    claimableAmount,
    claimableFormatted,
    allowance,
    
    // Actions
    createStream,
    claim,
    pause,
    cancel,
    approve,
    
    // Loading states
    isCreating,
    isClaiming,
    isPausing,
    isCancelling,
    isApproving,
    
    // Refresh
    refetch: () => {
      refetchActive();
      refetchDetails();
      refetchAllowance();
    },
  };
}
