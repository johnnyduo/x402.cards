import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from '@/config/contracts';
import { formatUnits, createPublicClient, http } from 'viem';
import { useEffect, useState } from 'react';
import { iotaEVM } from '@/config/wagmi';

export const Navigation = () => {
  const { open } = useAppKit();
  const { address, isConnected, chain } = useAccount();
  const [directUsdcBalance, setDirectUsdcBalance] = useState<bigint | null>(null);

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
        });
        
        console.log('USDC balance fetched:', balance);
        setDirectUsdcBalance(balance as bigint);
      } catch (err) {
        console.error('USDC fetch failed:', err);
      }
    };

    fetchDirectBalance();
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
