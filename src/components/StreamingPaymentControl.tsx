import { Button } from '@/components/ui/button';
import { useStreamingPayment, useAgentStats } from '@/hooks/useStreamingPayments';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Loader2, Play, Pause, X, Coins, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface StreamingPaymentControlProps {
  agentId: number;
  agentName: string;
  pricePerSecond: number; // In USDC (e.g., 0.0002)
  isRevenue?: boolean;
}

export function StreamingPaymentControl({
  agentId,
  agentName,
  pricePerSecond,
  isRevenue = false,
}: StreamingPaymentControlProps) {
  const { isConnected } = useAccount();
  const [duration, setDuration] = useState(3600); // Default 1 hour
  const [localAccumulated, setLocalAccumulated] = useState(0);

  const {
    hasActiveStream,
    isActive,
    details,
    claimableAmount,
    claimableFormatted,
    allowance,
    createStream,
    claim,
    pause,
    cancel,
    approve,
    isCreating,
    isClaiming,
    isPausing,
    isCancelling,
    isApproving,
    refetch,
  } = useStreamingPayment(agentId);

  const { stats } = useAgentStats(agentId);

  // Calculate required amount
  const pricePerSecondBigInt = parseUnits(pricePerSecond.toString(), 6);
  const totalCost = pricePerSecondBigInt * BigInt(duration);
  const needsApproval = !allowance || allowance < totalCost;

  // Real-time accumulated amount simulation
  useEffect(() => {
    if (!isActive || !details) {
      setLocalAccumulated(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = Math.min(now - details.startTime, details.endTime - details.startTime);
      const accumulated = Number(details.amountPerSecond) * elapsed;
      setLocalAccumulated(accumulated);
    }, 100); // Update 10 times per second for smooth animation

    return () => clearInterval(interval);
  }, [isActive, details]);

  const handleApprove = async () => {
    try {
      await approve(totalCost);
      toast.success('USDC approved for streaming!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve USDC');
    }
  };

  const handleCreateStream = async () => {
    try {
      await createStream(agentId, duration);
      toast.success(`Started streaming to ${agentName}!`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create stream');
    }
  };

  const handleClaim = async () => {
    try {
      if (details?.claimable && details.claimable > 0n) {
        await claim(details.claimable);
        toast.success(`Claimed ${claimableFormatted} USDC from ${agentName}!`);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim');
    }
  };

  const handlePause = async () => {
    try {
      if (details) {
        await pause(Number(details.agentId));
        toast.success(`Paused stream to ${agentName}`);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to pause');
    }
  };

  const handleCancel = async () => {
    try {
      if (details) {
        await cancel(Number(details.agentId));
        toast.success(`Cancelled stream to ${agentName}`);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel');
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg border border-secondary/20 bg-secondary/5">
        <p className="text-xs text-white/60 text-center">
          Connect wallet to stream payments
        </p>
      </div>
    );
  }

  // Active stream view
  if (hasActiveStream && details) {
    const formattedAccumulated = formatUnits(BigInt(Math.floor(localAccumulated)), 6);
    const progressPercent = details.endTime > details.startTime
      ? ((Date.now() / 1000 - details.startTime) / (details.endTime - details.startTime)) * 100
      : 0;

    return (
      <div className="space-y-3">
        {/* Stream Status */}
        <div className="p-4 rounded-lg border-2 border-secondary/30 bg-secondary/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-secondary/60 font-medium uppercase">Streaming Active</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-secondary font-mono">LIVE</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-white/40 mb-0.5">Accumulated</div>
              <div className="text-secondary font-mono font-bold">
                {formattedAccumulated} USDC
              </div>
            </div>
            <div>
              <div className="text-white/40 mb-0.5">Claimable</div>
              <div className="text-emerald-400 font-mono font-bold">
                {claimableFormatted} USDC
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleClaim}
            disabled={isClaiming || !claimableAmount || claimableAmount === 0n}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isClaiming ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Coins className="w-3 h-3 mr-1" />
                Claim
              </>
            )}
          </Button>

          <Button
            onClick={handlePause}
            disabled={isPausing}
            size="sm"
            variant="outline"
            className="border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            {isPausing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            )}
          </Button>

          <Button
            onClick={handleCancel}
            disabled={isCancelling}
            size="sm"
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            {isCancelling ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                Stop
              </>
            )}
          </Button>
        </div>

        {/* Agent Stats (if revenue) */}
        {stats && isRevenue && (
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Revenue Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-white/40 mb-0.5">Total Earned</div>
                <div className="text-emerald-400 font-mono font-bold">
                  {formatUnits(stats.totalEarned, 6)} USDC
                </div>
              </div>
              <div>
                <div className="text-white/40 mb-0.5">Total Streams</div>
                <div className="text-emerald-400 font-mono font-bold">
                  {stats.totalStreams}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Create stream view
  return (
    <div className="space-y-3">
      {/* Duration Selector */}
      <div className="p-4 rounded-lg border border-secondary/20 bg-secondary/5">
        <label className="text-xs text-secondary/60 font-medium uppercase mb-2 block">
          Stream Duration
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: '1 Hour', value: 3600 },
            { label: '6 Hours', value: 21600 },
            { label: '24 Hours', value: 86400 },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDuration(option.value)}
              className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                duration === option.value
                  ? 'bg-secondary text-white'
                  : 'bg-black/40 text-white/60 hover:bg-black/60'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Cost Preview */}
        <div className="pt-3 border-t border-secondary/20">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-white/40">Cost per second</span>
            <span className="text-white/80 font-mono">{pricePerSecond} USDC</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-white/40">Duration</span>
            <span className="text-white/80">{duration / 3600}h</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-secondary/20">
            <span className="text-secondary font-medium">Total Cost</span>
            <span className="text-secondary font-mono font-bold">
              {formatUnits(totalCost, 6)} USDC
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {needsApproval ? (
        <Button
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
        >
          {isApproving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <Coins className="w-4 h-4 mr-2" />
              Approve {formatUnits(totalCost, 6)} USDC
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleCreateStream}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Stream...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Streaming
            </>
          )}
        </Button>
      )}
    </div>
  );
}
