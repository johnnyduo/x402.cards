import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Wallet, Droplet } from "lucide-react";
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from '@/config/contracts';
import { formatUnits, createPublicClient, http, parseUnits } from 'viem';
import { useEffect, useState } from 'react';
import { iotaEVM } from '@/config/wagmi';
import { toast } from 'sonner';

export const Navigation = () => {
  const { open } = useAppKit();
  const { address, isConnected, chain } = useAccount();
  const [directUsdcBalance, setDirectUsdcBalance] = useState<bigint | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<number>(0);
  
  const { writeContract, data: claimHash } = useWriteContract();
  const { isLoading: isClaimPending } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Get IOTA balance
  const { data: iotaBalance } = useBalance({
    address: address,
  });

  // Get USDC balance - using wagmi
  const { data: usdcBalanceData } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: 1076,
  });

  // Direct RPC call - runs in parallel for faster display
  useEffect(() => {
    if (!address) {
      setDirectUsdcBalance(null);
      return;
    }
    
    const fetchDirectBalance = async () => {
      try {
        const client = createPublicClient({
          chain: iotaEVM,
          transport: http('https://json-rpc.evm.testnet.iota.cafe'),
        });
        
        const balance = await client.readContract({
          address: USDC_CONTRACT_ADDRESS,
          abi: USDC_ABI,
          functionName: 'balanceOf',
          args: [address],
        } as any);
        
        console.log('USDC balance fetched:', balance);
        setDirectUsdcBalance(balance as bigint);
      } catch (err) {
        console.error('USDC fetch failed:', err);
      }
    };

    fetchDirectBalance();
  }, [address]);

  // Check localStorage for last claim time and update cooldown timer
  useEffect(() => {
    if (!address) {
      setTimeUntilNextClaim(0);
      return;
    }

    const updateTimer = () => {
      try {
        const lastClaimKey = `usdc_faucet_${address}`;
        const lastClaimTime = localStorage.getItem(lastClaimKey);
        
        if (!lastClaimTime) {
          setTimeUntilNextClaim(0);
          return;
        }

        const cooldownPeriod = 24 * 60 * 60; // 24 hours in seconds
        const lastClaim = parseInt(lastClaimTime);
        const now = Math.floor(Date.now() / 1000);
        const nextClaimTime = lastClaim + cooldownPeriod;
        const remaining = Math.max(0, nextClaimTime - now);
        setTimeUntilNextClaim(remaining);
      } catch (e) {
        console.error('Error checking faucet cooldown:', e);
        setTimeUntilNextClaim(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [address]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance: string | number, decimals: number = 2) => {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (isNaN(num)) return '0.' + '0'.repeat(decimals);
    return num.toFixed(decimals);
  };

  const getUsdcDisplay = () => {
    if (!address) return '0.00';
    
    // Use wagmi data first, fallback to direct fetch
    const balance = usdcBalanceData || directUsdcBalance;
    
    if (!balance) return '...';
    
    try {
      const formatted = formatUnits(balance as bigint, 6);
      return formatBalance(formatted, 2);
    } catch (e) {
      console.error('Error formatting USDC balance:', e);
      return '0.00';
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleClaimUSDC = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (timeUntilNextClaim > 0) {
      toast.error(
        <div>
          <div className="font-semibold">Faucet cooldown active</div>
          <div className="text-xs text-white/70 mt-1">
            Next claim available in {formatTimeRemaining(timeUntilNextClaim)}
          </div>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    setIsClaiming(true);
    const loadingToast = toast.loading('Claiming 100 USDC from faucet...');

    try {
      // Try to mint 100 USDC (most test tokens have a mint function)
      const amount = parseUnits('100', 6); // 100 USDC
      
      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'mint',
        args: [address, amount],
      });

      // Store claim time in localStorage
      const lastClaimKey = `usdc_faucet_${address}`;
      const now = Math.floor(Date.now() / 1000);
      localStorage.setItem(lastClaimKey, now.toString());

      // Wait a bit for transaction
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success(
          <div>
            <div className="font-semibold">100 USDC claimed!</div>
            <div className="text-xs text-white/70 mt-1">Next claim available in 24 hours</div>
          </div>,
          { duration: 5000 }
        );
        setIsClaiming(false);
        
        // Refresh balance after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 3000);
    } catch (error: any) {
      console.error('Faucet claim error:', error);
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <div className="font-semibold">Claim failed</div>
          <div className="text-xs text-white/70 mt-1">
            {error?.message?.includes('mint') 
              ? 'This token may not have a public faucet. Try using the official IOTA testnet faucet.'
              : error?.shortMessage || error?.message || 'Unknown error'}
          </div>
        </div>,
        { duration: 7000 }
      );
      setIsClaiming(false);
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(66, 153, 225, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-display font-bold gradient-text tracking-wider">
            x402.Cards
          </h1>
          
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-sm font-body text-white/50 hover:text-white transition-colors"
              activeClassName="text-white font-semibold"
            >
              Streams
            </NavLink>
            <NavLink
              to="/agents"
              className="text-sm font-body text-white/50 hover:text-white transition-colors"
              activeClassName="text-white font-semibold"
            >
              Agents
            </NavLink>
            <NavLink
              to="/admin"
              className="text-sm font-body text-white/50 hover:text-white transition-colors"
              activeClassName="text-white font-semibold"
            >
              Settings
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && address && (
            <Button
              variant="outline"
              onClick={handleClaimUSDC}
              disabled={isClaiming || isClaimPending || timeUntilNextClaim > 0}
              className={`font-display tracking-wide transition-all ${
                timeUntilNextClaim > 0
                  ? 'border-white/20 text-white/40 cursor-not-allowed'
                  : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10'
              }`}
            >
              <Droplet className="w-4 h-4 mr-2" />
              {isClaiming || isClaimPending 
                ? 'Claiming...' 
                : timeUntilNextClaim > 0 
                ? `Wait ${formatTimeRemaining(timeUntilNextClaim)}`
                : 'Claim 100 USDC'}
            </Button>
          )}
          
          {isConnected && address && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <div className="text-xs">
                  <div className="text-white/50 uppercase tracking-wider">IOTA</div>
                  <div className="text-white font-bold font-mono">
                    {iotaBalance ? formatBalance(formatUnits(iotaBalance.value, iotaBalance.decimals), 4) : '0.0000'}
                  </div>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="text-xs">
                  <div className="text-white/50 uppercase tracking-wider">USDC</div>
                  <div className="text-white font-bold font-mono">
                    {getUsdcDisplay()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={() => open()}
            className="font-display tracking-wide border-white/20 text-white hover:border-secondary hover:bg-secondary/10 hover:text-secondary transition-all"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </nav>
  );
};
