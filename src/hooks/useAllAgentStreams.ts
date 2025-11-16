import { useAccount } from 'wagmi';
import { useAgentStreamStatus } from './useAgentStreamStatus';

/**
 * Optimized hook to get stream status for multiple agents
 * Only use on pages that need multiple agents (like Streams page)
 */
export function useAllAgentStreams(agentIds: number[]) {
  const { address } = useAccount();
  
  // Only fetch if wallet is connected
  const enabled = !!address;
  
  // Get stream status for each agent
  const streams = agentIds.map(id => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isStreaming } = useAgentStreamStatus(id);
    return { id, isStreaming: enabled ? isStreaming : false };
  });
  
  // Build a map for easy lookup
  const streamStates: Record<number, boolean> = {};
  streams.forEach(({ id, isStreaming }) => {
    streamStates[id] = isStreaming;
  });
  
  return streamStates;
}
