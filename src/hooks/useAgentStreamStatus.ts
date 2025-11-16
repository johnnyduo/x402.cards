import { useAccount, useReadContract } from 'wagmi';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from '@/config/streamingContracts';

/**
 * Hook to check if user has an active stream for a specific agent
 * This reads from on-chain data and syncs across all pages
 */
export function useAgentStreamStatus(agentId: number) {
  const { address } = useAccount();

  // Check if user has active stream for this agent
  const { data: streamId, refetch: refetchStream } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'activeStreams',
    args: address ? [address, BigInt(agentId)] : undefined,
    query: {
      enabled: !!address && agentId > 0,
      refetchInterval: 30000, // Refetch every 30 seconds (reduced load)
    },
  });

  const hasActiveStream = streamId && Number(streamId) > 0;

  // Get stream details if active
  const { data: streamDetails, refetch: refetchDetails } = useReadContract({
    address: STREAMING_PAYMENTS_ADDRESS,
    abi: STREAMING_PAYMENTS_ABI,
    functionName: 'getStreamDetails',
    args: hasActiveStream ? [streamId] : undefined,
    query: {
      enabled: hasActiveStream,
      refetchInterval: 10000, // Updates every 10 seconds (reduced load)
    },
  });

  // Extract stream details
  const isActive = streamDetails ? (streamDetails as any)[8] : false;
  const endTime = streamDetails ? (streamDetails as any)[5] : 0n;
  const isStreaming = hasActiveStream && isActive;
  const claimableAmount = streamDetails ? (streamDetails as any)[7] : 0n;
  const totalPaid = streamDetails ? (streamDetails as any)[6] : 0n;
  
  // Check if stream is expired (past endTime)
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const isExpired = hasActiveStream && endTime > 0n && currentTime >= endTime;

  return {
    streamId,
    hasActiveStream,
    isActive,
    isStreaming, // True only if stream exists AND is active (not paused)
    isExpired, // True if stream has passed its endTime
    streamDetails,
    claimableAmount, // Real-time USDC streamed (not yet claimed)
    totalPaid, // Total USDC already paid/claimed
    endTime, // When the stream expires
    refetchStream,
    refetchDetails,
  };
}
