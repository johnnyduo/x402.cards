import { useState, useEffect } from 'react';
import { STREAMING_PAYMENTS_ADDRESS } from '@/config/streamingContracts';
import { keccak256, toHex } from 'viem';

interface AgentLog {
  agentId: number;
  wallet: string;
  pricePerSecond: bigint;
  blockNumber: number;
  txHash: string;
}

// Calculate event signature hash for AgentRegistered(uint256,address,uint256)
const AGENT_REGISTERED_TOPIC = keccak256(toHex('AgentRegistered(uint256,address,uint256)'));

export function useBlockExplorerAgents() {
  const [agents, setAgents] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch AgentRegistered events from block explorer
      const response = await fetch(
        `https://explorer.evm.testnet.iotaledger.net/api/v2/addresses/${STREAMING_PAYMENTS_ADDRESS}/logs`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse AgentRegistered events
      const registeredAgents: AgentLog[] = [];
      
      if (data.items && Array.isArray(data.items)) {
        for (const log of data.items) {
          // Check if this is an AgentRegistered event
          if (log.decoded?.method_call?.includes('AgentRegistered') || 
              log.decoded?.event_name === 'AgentRegistered') {
            
            const params = log.decoded.parameters;
            if (params) {
              const agentIdParam = params.find((p: any) => p.name === 'agentId');
              const walletParam = params.find((p: any) => p.name === 'wallet');
              const priceParam = params.find((p: any) => p.name === 'pricePerSecond');
              
              if (agentIdParam && walletParam && priceParam) {
                registeredAgents.push({
                  agentId: parseInt(agentIdParam.value),
                  wallet: walletParam.value,
                  pricePerSecond: BigInt(priceParam.value),
                  blockNumber: log.block_number,
                  txHash: log.transaction_hash,
                });
              }
            }
          }
        }
      }

      // Remove duplicates, keep latest registration for each agentId
      const agentMap = new Map<number, AgentLog>();
      registeredAgents.forEach(agent => {
        const existing = agentMap.get(agent.agentId);
        if (!existing || agent.blockNumber > existing.blockNumber) {
          agentMap.set(agent.agentId, agent);
        }
      });

      setAgents(Array.from(agentMap.values()));
      console.log('📡 Fetched agents from block explorer:', Array.from(agentMap.values()));
      
    } catch (err: any) {
      console.error('❌ Error fetching agents from block explorer:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    isLoading,
    error,
    refetch: fetchAgents,
  };
}
