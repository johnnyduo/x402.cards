import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Switch } from '@/components/ui/switch';
import { Loader2, Zap, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { STREAMING_PAYMENTS_ADDRESS, STREAMING_PAYMENTS_ABI } from '@/config/streamingContracts';
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from '@/config/contracts';
import { useAgentStreamStatus } from '@/hooks/useAgentStreamStatus';

interface AgentStreamToggleProps {
  agentId: number;
  agentName: string;
  pricePerSecond: number; // in USDC (e.g., 0.001)
}

export function AgentStreamToggle({ 
  agentId, 
  agentName, 
  pricePerSecond,
}: AgentStreamToggleProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Default duration: 1 hour (3600 seconds)
  const defaultDuration = 3600;
  const priceWei = parseUnits(pricePerSecond.toString(), 6); // USDC has 6 decimals
  const totalCost = priceWei * BigInt(defaultDuration);

  // Use shared hook for stream status (synced across pages)
  const { 
    streamId, 
    hasActiveStream, 
    isActive, 
    isStreaming,
    streamDetails,
    refetchStream, 
    refetchDetails 
  } = useAgentStreamStatus(agentId);

  // Check USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, STREAMING_PAYMENTS_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Check USDC balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Debug logging
  useEffect(() => {
    if (address) {
      console.log('📊 USDC Status:', {
        address,
        balance: balance?.toString() || 'loading...',
        allowance: allowance?.toString() || 'loading...',
        totalCost: totalCost.toString(),
        pricePerSecond
      });
    }
  }, [address, balance, allowance, totalCost, pricePerSecond]);

  const { writeContractAsync } = useWriteContract();

  // Calculate claimable amount and time remaining in real-time
  const claimableAmount = streamDetails ? (streamDetails as any)[7] : 0n;
  const endTime = streamDetails ? Number((streamDetails as any)[5]) : 0;
  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = Math.max(0, endTime - now);

  // Check if stream has expired and refetch status
  useEffect(() => {
    if (hasActiveStream && isActive && timeRemaining === 0) {
      // Stream has expired, refetch to update UI
      console.log('⏱️ Stream expired for agent', agentId);
      setTimeout(() => {
        refetchStream();
        refetchDetails();
      }, 1000); // Small delay to let contract state update
    }
  }, [timeRemaining, hasActiveStream, isActive, agentId, refetchStream, refetchDetails]);

  const handleToggle = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    console.log('🔄 Stream toggle clicked', {
      agentId,
      agentName,
      hasActiveStream,
      isActive,
      address,
      balance: balance?.toString(),
      allowance: allowance?.toString(),
      totalCost: totalCost.toString()
    });

    setIsProcessing(true);

    try {
      if (hasActiveStream && isActive) {
        // Pause stream
        console.log('⏸️ Pausing stream...');
        const hash = await writeContractAsync({
          address: STREAMING_PAYMENTS_ADDRESS,
          abi: STREAMING_PAYMENTS_ABI,
          functionName: 'pauseStream',
          args: [streamId],
        } as any);

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
        }

        toast.success(`${agentName} stream paused`);
        await refetchStream();
        await refetchDetails();
      } else {
        // Check balance first
        const userBalance = (balance as bigint) || 0n;
        console.log('💰 Balance check:', {
          userBalance: userBalance.toString(),
          totalCost: totalCost.toString(),
          hasEnough: userBalance >= totalCost
        });
        
        if (userBalance < totalCost) {
          toast.error(`Insufficient USDC balance. Need ${formatUnits(totalCost, 6)} USDC`);
          setIsProcessing(false);
          return;
        }

        // Step 1: Check/Approve USDC if needed
        const currentAllowance = (allowance as bigint) || 0n;
        console.log('✅ Allowance check:', {
          currentAllowance: currentAllowance.toString(),
          totalCost: totalCost.toString(),
          needsApproval: currentAllowance < totalCost
        });
        
        if (currentAllowance < totalCost) {
          console.log('🔐 Requesting USDC approval...');
          toast.info('Approving USDC for streaming...');
          
          const approveHash = await writeContractAsync({
            address: USDC_CONTRACT_ADDRESS,
            abi: USDC_ABI,
            functionName: 'approve',
            args: [STREAMING_PAYMENTS_ADDRESS, totalCost],
          } as any);

          if (publicClient) {
            await publicClient.waitForTransactionReceipt({ 
              hash: approveHash, 
              confirmations: 1 
            });
          }

          await refetchAllowance();
          console.log('✅ USDC approved!');
          toast.success('USDC approved!');
        }

        // Step 2: Create stream
        console.log('🚀 Creating stream...');
        toast.info(`Creating stream to ${agentName}...`);
        
        const createHash = await writeContractAsync({
          address: STREAMING_PAYMENTS_ADDRESS,
          abi: STREAMING_PAYMENTS_ABI,
          functionName: 'createStream',
          args: [BigInt(agentId), BigInt(defaultDuration)],
        } as any);

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ 
            hash: createHash, 
            confirmations: 1 
          });
        }

        toast.success(
          `🎉 Stream activated! ${agentName} is now live for 1 hour`,
          {
            description: `Cost: ${formatUnits(totalCost, 6)} USDC`,
            duration: 5000,
          }
        );

        await refetchStream();
        await refetchDetails();
      }
    } catch (error: any) {
      console.error('Stream toggle error:', error);
      
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled');
      } else if (error.message?.includes('insufficient')) {
        toast.error('Insufficient USDC balance');
      } else {
        toast.error(error.message || 'Failed to toggle stream');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!address) {
    return (
      <div className="text-xs text-white/40 italic">
        Connect wallet to activate
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stream Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch 
            checked={isStreaming} 
            onCheckedChange={() => {
              console.log('🎚️ Switch toggled');
              handleToggle();
            }}
            disabled={isProcessing}
          />
          <span className="text-sm font-medium">
            {isStreaming ? (
              <span className="text-emerald-400">Streaming</span>
            ) : (
              <span className="text-white/60">Inactive</span>
            )}
          </span>
        </div>
        
        {isProcessing && (
          <Loader2 className="w-4 h-4 animate-spin text-secondary" />
        )}
      </div>

      {/* Stream Info - Only show when active */}
      {isStreaming && (
        <div className={`bg-black/20 rounded-lg p-3 space-y-2 border ${
          timeRemaining === 0 
            ? 'border-red-500/50 bg-red-500/5' 
            : timeRemaining < 300 
              ? 'border-yellow-500/50' 
              : 'border-emerald-500/20'
        }`}>
          <div className="flex justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time Left
            </span>
            <span className={`font-mono ${
              timeRemaining === 0 
                ? 'text-red-400 font-bold' 
                : timeRemaining < 300 
                  ? 'text-yellow-400' 
                  : 'text-white'
            }`}>
              {timeRemaining === 0 ? 'EXPIRED' : `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Streamed
            </span>
            <span className="font-mono text-emerald-400">
              {formatUnits(claimableAmount, 6)} USDC
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Rate
            </span>
            <span className="font-mono text-white/80">
              {pricePerSecond} USDC/sec
            </span>
          </div>
        </div>
      )}

      {/* Activation Info - Only show when inactive */}
      {!hasActiveStream && !isProcessing && (
        <div className="text-xs text-white/50 space-y-1">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-mono">1 hour</span>
          </div>
          <div className="flex justify-between">
            <span>Cost:</span>
            <span className="font-mono text-secondary">
              {formatUnits(totalCost, 6)} USDC
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
