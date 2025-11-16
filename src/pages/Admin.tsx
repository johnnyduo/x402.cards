import { useState, useEffect } from 'react';
import { useAccount, useGasPrice } from 'wagmi';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  GitBranch,
  Heart,
  Shield,
  Sparkles,
  Zap,
  Trash2,
  Edit,
  RefreshCw,
} from 'lucide-react';
import { useRegisterAgent, useAllAgents, useUpdateAgent } from '@/hooks/useAgentRegistry';
import { useAPIStatus, useAgentLiveData } from '@/hooks/useAgentAPI';
import { AGENTS as predefinedAgents } from '@/data/agents';
import { formatUnits, parseUnits, formatGwei } from 'viem';

// LocalStorage helpers for agent cache
const AGENTS_CACHE_KEY = 'x402_registered_agents';
const CACHE_DURATION = 300000; // 5 minutes

interface CachedAgent {
  id: number;
  wallet: string;
  pricePerSecond: string;
  timestamp: number;
  txHash?: string;
}

const saveAgentToCache = (agent: CachedAgent) => {
  try {
    const cached = localStorage.getItem(AGENTS_CACHE_KEY);
    const agents: CachedAgent[] = cached ? JSON.parse(cached) : [];
    const filtered = agents.filter(a => a.id !== agent.id);
    filtered.push({ ...agent, timestamp: Date.now() });
    localStorage.setItem(AGENTS_CACHE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to cache agent:', e);
  }
};

const getCachedAgents = (): CachedAgent[] => {
  try {
    const cached = localStorage.getItem(AGENTS_CACHE_KEY);
    if (!cached) return [];
    const agents: CachedAgent[] = JSON.parse(cached);
    const now = Date.now();
    return agents.filter(a => (now - a.timestamp) < CACHE_DURATION);
  } catch (e) {
    console.error('Failed to load cached agents:', e);
    return [];
  }
};

export default function Admin() {
  const { isConnected, address } = useAccount();
  const { data: gasPrice } = useGasPrice();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agentName, setAgentName] = useState('');
  const [walletAddress, setWalletAddress] = useState('0x5ebaddf71482d40044391923be1fc42938129988');
  const [pricePerSecond, setPricePerSecond] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [isRegisteringAll, setIsRegisteringAll] = useState(false);
  const [cachedAgents, setCachedAgents] = useState<CachedAgent[]>(getCachedAgents());
  
  // Edit agent state
  const [editingAgent, setEditingAgent] = useState<{ id: number; wallet: string; price: string } | null>(null);
  const [editWallet, setEditWallet] = useState('');
  const [editPrice, setEditPrice] = useState('');
  
  // Contract deployer/owner address
  const DEPLOYER_ADDRESS = '0x5ebaddf71482d40044391923be1fc42938129988';
  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  const { registerAgent, isLoading: isRegistering } = useRegisterAgent();
  const { updateAgent, isLoading: isUpdating } = useUpdateAgent();
  const { agents, isLoading: isLoadingAgents, refetch } = useAllAgents();
  const { status: apiStatus, isChecking: isCheckingAPI, refetch: refetchAPI } = useAPIStatus();
  const agentLiveData = useAgentLiveData(selectedAgent ? parseInt(selectedAgent) : 0);

  // Manual refresh handler
  const handleRefresh = async () => {
    toast.loading('Refreshing agent data...', { id: 'refresh' });
    await refetch();
    toast.success('Agent data updated', { id: 'refresh' });
  };

  // Log agents data and network info for debugging
  useEffect(() => {
    console.log('🌐 Connected:', isConnected);
    console.log('📍 Wallet Address:', address);
    console.log('📊 Agents loaded:', agents.length, 'agents');
    console.log('🔗 Contract Address:', '0x340DeE0a3EA33304C59d15d37D951A5B72A7b563');
    
    // Check if we're on the right network
    if (window.ethereum) {
      (window.ethereum.request({ method: 'eth_chainId' }) as Promise<string>).then((chainId: string) => {
        const chainIdDecimal = parseInt(chainId, 16);
        console.log('🔢 Current Chain ID:', chainIdDecimal, '(should be 1076 for IOTA EVM Testnet)');
        if (chainIdDecimal !== 1076) {
          console.error('❌ WRONG NETWORK! Please switch to IOTA EVM Testnet (Chain ID 1076)');
        }
      }).catch((err) => {
        console.error('Failed to get chain ID:', err);
      });
    }
  }, [isConnected, address, agents]);

  const handleRegister = async () => {
    if (!selectedAgent || !agentName || !walletAddress || !pricePerSecond) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if agent is already registered (check both on-chain data and cache)
    const checkAgentId = Number(selectedAgent);
    const isAlreadyRegistered = agents.some(a => 
      a.id === checkAgentId && 
      a.isActive &&
      a.wallet !== '0x0' &&
      a.wallet !== '0x0000000000000000000000000000000000000000'
    );
    
    if (isAlreadyRegistered) {
      toast.error(
        <div>
          <div className="font-semibold">Agent Already Registered</div>
          <div className="text-xs text-white/70 mt-1">
            Agent #{checkAgentId} is already active on-chain. Use the Manage Agents tab to update it.
          </div>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    // Validate wallet address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid wallet address format');
      return;
    }

    // Validate price is positive
    const priceNum = parseFloat(pricePerSecond);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    // Validate minimum price (contract requires at least 0.001 USDC per second)
    const MIN_PRICE = 0.001;
    if (priceNum < MIN_PRICE) {
      toast.error(`Price must be at least ${MIN_PRICE} USDC per second (contract minimum)`);
      return;
    }

    const priceInWei = parseUnits(pricePerSecond, 6);
    const agentId = BigInt(selectedAgent);

    const loadingToast = toast.loading('Submitting transaction...');

    const result = await registerAgent(agentId, walletAddress as `0x${string}`, priceInWei);

    toast.dismiss(loadingToast);

    if (!result.success) {
      // Show error with details
      toast.error(
        <div>
          <div className="font-semibold">{result.error}</div>
          {result.errorDetails && (
            <div className="text-xs text-white/70 mt-1">{result.errorDetails}</div>
          )}
          {result.txHash && (
            <a 
              href={`https://explorer.evm.testnet.iota.cafe/tx/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:underline mt-1 block"
            >
              View Failed TX: {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
            </a>
          )}
        </div>,
        { duration: 7000 }
      );
      return;
    }

    // Success - show message and refresh
    toast.success(
      <div>
        <div className="font-semibold">✅ Agent Registered Successfully!</div>
        <div className="text-xs text-white/70 mt-1">Transaction confirmed on-chain</div>
        <a 
          href={`https://explorer.evm.testnet.iota.cafe/tx/${result.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-secondary hover:underline mt-1 block"
        >
          View TX: {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
        </a>
      </div>,
      { duration: 5000 }
    );

    // Reset form
    setSelectedAgent('');
    setAgentName('');
    setWalletAddress('0x5ebaddf71482d40044391923be1fc42938129988');
    setPricePerSecond('');
    setTokenURI('');

    // Refresh to show new agent immediately
    await refetch();
  };

  const handleRegisterAll = async () => {
    if (!walletAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    // Validate wallet address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid wallet address format');
      return;
    }

    setIsRegisteringAll(true);
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    // Filter out already registered agents
    const registeredIds = new Set(agents.filter(a => a.wallet !== '0x0000000000000000000000000000000000000000').map(a => a.id));
    const agentsToRegister = predefinedAgents.filter(a => !registeredIds.has(a.id));

    if (agentsToRegister.length === 0) {
      setIsRegisteringAll(false);
      toast.info('All agents are already registered!');
      return;
    }

    let currentToast = toast.loading(`Registering ${agentsToRegister.length} agents (${predefinedAgents.length - agentsToRegister.length} already registered)...`);

    for (const agent of agentsToRegister) {
      const priceInWei = parseUnits(agent.pricePerSec.toString(), 6);
      const agentId = BigInt(agent.id);

      const result = await registerAgent(agentId, walletAddress as `0x${string}`, priceInWei);
      
      if (result.success && result.txHash) {
        // Cache successful registration
        saveAgentToCache({
          id: agent.id,
          wallet: walletAddress,
          pricePerSecond: agent.pricePerSec.toString(),
          timestamp: Date.now(),
          txHash: result.txHash
        });
        
        successCount++;
        
        toast.dismiss(currentToast);
        currentToast = toast.loading(`✅ ${agent.name} registered (${successCount}/${agentsToRegister.length})...`);
      } else {
        // Registration failed
        failCount++;
        console.error(`❌ Failed to register ${agent.name}:`, result.error, result.errorDetails);
        
        toast.dismiss(currentToast);
        currentToast = toast.loading(`❌ ${agent.name} failed: ${result.error} (${successCount + failCount}/${agentsToRegister.length})`);
      }
      
      // Small delay between registrations
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    toast.dismiss(currentToast);
    setIsRegisteringAll(false);
    setCachedAgents(getCachedAgents());
    
    const skipped = predefinedAgents.length - agentsToRegister.length;
    if (successCount === agentsToRegister.length && skipped > 0) {
      toast.success(`Successfully registered ${successCount} new agents! (${skipped} were already registered)`);
    } else if (successCount === agentsToRegister.length) {
      toast.success(`Successfully registered all ${successCount} agents!`);
    } else if (successCount > 0) {
      toast.success(`Registered ${successCount} agents (${failCount} failed, ${skipped} already registered)`);
    } else {
      toast.error(`Failed to register agents (${skipped} already registered)`);
    }

    // Refetch in background
    setTimeout(() => refetch(), 2000);
  };

  const handleEditAgent = (agent: any) => {
    setEditingAgent({
      id: agent.id,
      wallet: agent.wallet,
      price: formatUnits(agent.pricePerSecond, 6)
    });
    setEditWallet(agent.wallet);
    setEditPrice(formatUnits(agent.pricePerSecond, 6));
  };

  const handleSaveEdit = async () => {
    if (!editingAgent) return;

    // Validation
    if (!editWallet || !editWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid wallet address');
      return;
    }

    if (!editPrice || parseFloat(editPrice) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    const loadingToast = toast.loading('Updating agent...');

    try {
      const priceWei = parseUnits(editPrice, 6); // USDC has 6 decimals
      
      const result = await updateAgent(
        BigInt(editingAgent.id),
        editWallet as `0x${string}`,
        priceWei
      );

      toast.dismiss(loadingToast);

      if (!result.success) {
        toast.error(
          <div>
            <div className="font-semibold">{result.error}</div>
            <div className="text-xs text-white/70 mt-1">{result.errorDetails}</div>
          </div>,
          { duration: 5000 }
        );
        return;
      }

      toast.success(
        <div>
          <div className="font-semibold">Agent updated successfully!</div>
          <div className="text-xs text-white/70 mt-1">Transaction: {result.txHash?.slice(0, 10)}...{result.txHash?.slice(-8)}</div>
        </div>,
        { duration: 5000 }
      );

      // Reset edit state
      setEditingAgent(null);
      setEditWallet('');
      setEditPrice('');

      // Refetch agents
      setTimeout(() => refetch(), 2000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <div className="font-semibold">Update failed</div>
          <div className="text-xs text-white/70 mt-1">{error?.message || 'Unknown error'}</div>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const handleDeactivateAgent = async (agentId: number) => {
    if (!confirm(`Are you sure you want to deactivate Agent #${agentId}? This will set the wallet to 0x0 address.`)) {
      return;
    }

    const loadingToast = toast.loading('Deactivating agent...');
    
    const result = await updateAgent(
      BigInt(agentId),
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
      0n
    );

    toast.dismiss(loadingToast);

    if (!result.success) {
      toast.error(
        <div>
          <div className="font-semibold">{result.error}</div>
          <div className="text-xs text-white/70 mt-1">{result.errorDetails}</div>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    toast.success('Agent deactivated successfully');
    await refetch();
  };

  const selectedAgentData = selectedAgent
    ? predefinedAgents.find((a) => a.id.toString() === selectedAgent)
    : undefined;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top, rgba(30, 58, 138, 0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.9), transparent 50%), linear-gradient(to bottom, #0f172a, #020617)',
      }}
    >
      <Navigation />

      <div className="container mx-auto px-6 pt-32 pb-20">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/70 mb-4">Connect wallet to manage agents</p>
              <w3m-button />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-display font-bold tracking-tight mb-3 text-white">Settings</h1>
                  <p className="text-white/70 font-body">
                    Register and manage AI agents on the x402 payment protocol
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Core Status Indicators */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus.connected ? 'bg-emerald-400' : 'bg-red-400'
                    } animate-pulse`} />
                    <span className="text-xs text-white/70">API Server</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-amber-500/30">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-white/70">Gas:</span>
                    <span className="text-xs text-amber-400 font-mono font-semibold">
                      {gasPrice ? `${formatGwei(gasPrice)} Gwei` : '...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-secondary/30">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus.blockberryConnected ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className="text-xs text-secondary font-semibold">IOTA On-Chain</span>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="register" className="space-y-6">
              <TabsList className="bg-black/30 border border-white/10 backdrop-blur-sm">
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary text-white/70"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Agent
                </TabsTrigger>
                <TabsTrigger
                  value="manage"
                  className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary text-white/70"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Manage Agents
                </TabsTrigger>
              </TabsList>

              {/* Register Agent Tab */}
              <TabsContent value="register" className="mt-6">
                <div className="glass-strong p-6 rounded-2xl">
                  <div className="mb-10">
                    <div className="mb-4">
                      <Label htmlFor="agent-select" className="text-white/70 text-sm font-medium">
                        Select Agent to Register
                      </Label>
                    </div>

                    <Select
                      value={selectedAgent}
                      onValueChange={(value) => {
                        const agent = predefinedAgents.find((a) => a.id.toString() === value);
                        if (agent) {
                          setSelectedAgent(value);
                          setAgentName(agent.name);
                          setPricePerSecond(agent.pricePerSec.toString());
                        }
                      }}
                    >
                      <SelectTrigger
                        id="agent-select"
                        className="w-full bg-black/30 border-white/10 text-white h-14 hover:bg-black/40 transition-colors"
                      >
                        {selectedAgentData ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-secondary">{selectedAgentData.icon}</span>
                              <span className="font-display font-semibold text-sm">
                                {selectedAgentData.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-secondary/50 text-secondary px-2 py-0.5"
                              >
                                {selectedAgentData.category}
                              </Badge>
                            </div>
                            <span className="text-xs text-white/60">
                              ${selectedAgentData.pricePerSec}/sec
                            </span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Choose an agent..." />
                        )}
                      </SelectTrigger>

                      <SelectContent
                        className="bg-[#0f172a] border-white/20 backdrop-blur-xl max-h-80 overflow-y-auto"
                        position="popper"
                        sideOffset={8}
                      >
                        {predefinedAgents.map((agent) => {
                          const isRegistered = agents.some(a => a.id === agent.id && a.wallet !== '0x0000000000000000000000000000000000000000');
                          return (
                          <SelectItem
                            key={agent.id}
                            value={agent.id.toString()}
                            textValue={agent.name}   // 👈 this fixes the "card in trigger" glitch
                            disabled={isRegistered}
                            className={`text-white hover:bg-secondary/10 cursor-pointer focus:bg-secondary/10 py-4 px-4 border-b border-white/5 last:border-0 ${
                              isRegistered ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3 py-1">
                              <div className="mt-0.5 text-secondary shrink-0">{agent.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-display font-semibold text-base text-white">
                                    {agent.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] border-secondary/50 text-secondary px-2 py-0.5"
                                  >
                                    {agent.category}
                                  </Badge>
                                  {isRegistered && (
                                    <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400 px-2 py-0.5">
                                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                      Registered
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed mb-2">
                                  {agent.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs mb-2">
                                  <span className="text-secondary font-bold">
                                    ${agent.pricePerSec}/sec
                                  </span>
                                  <span className="text-white/60">
                                    ≈ ${(agent.pricePerSec * 3600).toFixed(4)}/hr
                                  </span>
                                  <span className="text-white/60">
                                    ≈ ${(agent.pricePerSec * 86400).toFixed(2)}/day
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {agent.features.slice(0, 2).map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[11px] text-white/60 bg-white/5 px-2 py-1 rounded"
                                    >
                                      • {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Agent Detail Card */}
                  {selectedAgentData && (
                    <div className="bg-black/20 border border-secondary/20 rounded-xl p-5 space-y-4 mb-10 mt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                          {selectedAgentData.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-display font-bold text-white">
                              {selectedAgentData.name}
                            </h3>
                            <Badge variant="outline" className="border-secondary/50 text-secondary">
                              {selectedAgentData.category}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed mb-3">
                            {selectedAgentData.description}
                          </p>

                          <div className="bg-secondary/5 rounded-lg p-3 mb-3">
                            <div className="text-xs text-white/60 mb-1">Pricing Structure</div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-secondary font-bold text-lg">
                                ${selectedAgentData.pricePerSec}/sec
                              </span>
                              <span className="text-white/50">•</span>
                              <span className="text-white/80 font-semibold">
                                ${(selectedAgentData.pricePerSec * 3600).toFixed(4)}/hr
                              </span>
                              <span className="text-white/50">•</span>
                              <span className="text-white/80 font-semibold">
                                ${(selectedAgentData.pricePerSec * 86400).toFixed(2)}/day
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                              Features &amp; Capabilities
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedAgentData.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span className="text-white/70">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Data Sources */}
                          {selectedAgentData.dataSources && selectedAgentData.dataSources.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                                📊 Data Sources
                              </div>
                              <div className="space-y-1">
                                {selectedAgentData.dataSources.map((source, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs">
                                    <span className="text-emerald-400 shrink-0">→</span>
                                    <span className="text-white/60 leading-relaxed">{source}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Methodology */}
                          {selectedAgentData.methodology && (
                            <div className="mt-4 space-y-2">
                              <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                                🧠 Methodology
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed">
                                {selectedAgentData.methodology}
                              </p>
                            </div>
                          )}

                          {/* API Endpoint */}
                          {selectedAgentData.apiEndpoint && (
                            <div className="mt-4 p-2 bg-black/30 rounded-lg">
                              <div className="text-xs text-white/50 mb-1">API Endpoint</div>
                              <code className="text-xs text-secondary font-mono">
                                {selectedAgentData.apiEndpoint}
                              </code>
                            </div>
                          )}

                          {/* Live Data Section */}
                          {agentLiveData.data && (
                            <div className="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                                    Live Data from API
                                  </span>
                                </div>
                                {selectedAgentData.id === 1 && agentLiveData.data.symbol && (
                                  <div className="px-2 py-1 bg-black/30 rounded">
                                    <span className="text-xs font-mono text-secondary font-bold">
                                      {agentLiveData.data.symbol}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {selectedAgentData.id === 1 && agentLiveData.data.signal && (
                                  <>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Signal</div>
                                      <div className={`font-bold ${
                                        agentLiveData.data.signal.action === 'BUY' ? 'text-emerald-400' :
                                        agentLiveData.data.signal.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                                      }`}>{agentLiveData.data.signal.action}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">RSI</div>
                                      <div className="text-white font-mono">{agentLiveData.data.indicators?.rsi14?.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Price</div>
                                      <div className="text-secondary font-mono">${agentLiveData.data.currentPrice?.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Volatility</div>
                                      <div className="text-white font-mono">{agentLiveData.data.volatility?.toFixed(2)}%</div>
                                    </div>
                                  </>
                                )}
                                {selectedAgentData.id === 2 && agentLiveData.data.volatility && (
                                  <>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Volatility</div>
                                      <div className="text-secondary font-mono">{agentLiveData.data.volatility?.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Regime</div>
                                      <div className="text-white font-bold">{agentLiveData.data.regime}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Fear Index</div>
                                      <div className="text-white font-mono">{agentLiveData.data.fearIndex}</div>
                                    </div>
                                  </>
                                )}
                                {selectedAgentData.id === 3 && agentLiveData.data.opportunities && (
                                  <div className="col-span-2 bg-black/20 rounded p-2">
                                    <div className="text-white/50 mb-1">Opportunities Found</div>
                                    <div className="text-emerald-400 font-bold text-lg">
                                      {agentLiveData.data.opportunities.length}
                                    </div>
                                  </div>
                                )}
                                {selectedAgentData.id === 4 && agentLiveData.data.sentiment !== undefined && (
                                  <>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Sentiment</div>
                                      <div className={`font-bold ${
                                        agentLiveData.data.sentiment > 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>{agentLiveData.data.sentiment?.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <div className="text-white/50">Mood</div>
                                      <div className="text-white font-bold">{agentLiveData.data.mood}</div>
                                    </div>
                                    <div className="col-span-2 bg-black/20 rounded p-2">
                                      <div className="text-white/50 mb-1">News Items</div>
                                      <div className="text-white font-mono">{agentLiveData.data.news?.length || 0}</div>
                                    </div>
                                  </>
                                )}
                                {selectedAgentData.id === 5 && agentLiveData.data.healthScore && (
                                  <div className="col-span-2 bg-black/20 rounded p-2">
                                    <div className="text-white/50">Health Score</div>
                                    <div className="text-emerald-400 font-bold text-lg">
                                      {agentLiveData.data.healthScore}/100
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 text-[10px] text-white/40">
                                Last updated: {new Date().toLocaleTimeString()}
                              </div>
                            </div>
                          )}
                          {agentLiveData.isLoading && (
                            <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/10">
                              <div className="flex items-center gap-2 text-xs text-white/50">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Fetching live data from API...</span>
                              </div>
                            </div>
                          )}
                          {agentLiveData.error && !apiStatus.connected && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <div className="flex items-center gap-2 text-xs text-red-400">
                                <AlertCircle className="w-3 h-3" />
                                <span>API Server Offline - Start with: cd api && yarn dev</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="text-xs text-white/50">
                              <span className="font-semibold text-white/60">Agent ID:</span>{' '}
                              {selectedAgentData.id} •
                              <span className="font-semibold text-white/60 ml-2">Source:</span>{' '}
                              EIP-8004 Registry •
                              <span className="font-semibold text-white/60 ml-2">Protocol:</span>{' '}
                              x402 Streaming Payments
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-10">
                    <div className="mb-4">
                      <Label htmlFor="wallet-address" className="text-white/70 text-sm font-medium">
                        Recipient Wallet Address
                      </Label>
                    </div>
                    <div className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-4 h-14 flex items-center">
                      <span className="text-white/70 font-mono text-sm">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-3">
                      This address will receive payments for agent usage (connected wallet)
                    </p>
                  </div>

                  {/* Gas Cost Info */}
                  {gasPrice && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-amber-400 mb-1">
                            Estimated Gas Cost
                          </div>
                          <div className="text-xs text-white/70">
                            Network: <span className="text-white font-mono">{formatGwei(gasPrice)} Gwei</span>
                            {' • '}
                            Estimated: <span className="text-white font-mono">~0.005 IOTA</span>
                            {' • '}
                            Make sure you have enough IOTA for gas fees
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering || isRegisteringAll || !selectedAgent || !walletAddress || !pricePerSecond}
                      className="flex-1 bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary h-9"
                      variant="outline"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Register Agent
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleRegisterAll}
                      disabled={isRegistering || isRegisteringAll || !walletAddress}
                      className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 h-9"
                      variant="outline"
                    >
                      {isRegisteringAll ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering All...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Register All {predefinedAgents.length} Agents
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Manage Agents Tab */}
              <TabsContent value="manage" className="space-y-6 mt-6">
                <div className="glass-strong p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Registered Agents</h3>
                      <p className="text-xs text-white/50 mt-1">On-chain agent registry data</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRefresh}
                        disabled={isLoadingAgents}
                        variant="outline"
                        size="sm"
                        className="border-white/10 text-white/70 hover:text-white hover:border-secondary/30"
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingAgents ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      {agents.length === 0 && !isLoadingAgents && (
                        <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">
                          No on-chain data found - Check console
                        </Badge>
                      )}
                    </div>
                  </div>

                  {(() => {
                    // Show only confirmed on-chain agents
                    return isLoadingAgents ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
                          <p className="text-xs text-white/50">Loading agents from blockchain...</p>
                        </div>
                      </div>
                    ) : agents.length > 0 ? (
                      <div className="space-y-4">
                        {agents.map((agent) => {
                        const agentInfo = predefinedAgents.find(a => a.id === agent.id);
                        return (
                          <div
                            key={agent.id}
                            className="bg-black/30 rounded-xl p-5 border border-white/10 hover:border-secondary/20 transition-all"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                {agentInfo && (
                                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                    {agentInfo.icon}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-semibold">
                                      {agentInfo?.name || `Agent #${agent.id}`}
                                    </h4>
                                    {agent.totalStreams > 0n ? (
                                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                                        Streaming
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" />
                                        Registered
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs">
                                    <span className="text-white/50">ID:</span>
                                    <span className="font-mono text-secondary">#{agent.id}</span>
                                    <span className="text-white/30">•</span>
                                    <span className="text-white/50">Wallet:</span>
                                    <span className="font-mono text-white/70">
                                      {agent.wallet.slice(0, 10)}...{agent.wallet.slice(-8)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">Price per Second</div>
                                <div className="text-secondary font-mono font-semibold">
                                  ${formatUnits(agent.pricePerSecond, 6)}
                                </div>
                                <div className="text-xs text-white/40 mt-0.5">
                                  ${(Number(formatUnits(agent.pricePerSecond, 6)) * 3600).toFixed(4)}/hr
                                </div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">Total Earned</div>
                                <div className="text-emerald-400 font-mono font-semibold">
                                  ${formatUnits(agent.totalEarned, 6)}
                                </div>
                                <div className="text-xs text-white/40 mt-0.5">USDC</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">Total Streams</div>
                                <div className="text-white font-mono font-semibold">
                                  {agent.totalStreams.toString()}
                                </div>
                                <div className="text-xs text-white/40 mt-0.5">streams</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">Status</div>
                                <div className="flex items-center gap-1.5">
                                  {agent.totalStreams > 0n ? (
                                    <>
                                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                      <span className="font-semibold text-emerald-400">Streaming</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                                      <span className="font-semibold text-blue-400">Registered</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-white/40 mt-0.5">on-chain</div>
                              </div>
                            </div>

                            {agentInfo && (
                              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-white/50 mb-2">Category</div>
                                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                                    {agentInfo.category}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditAgent(agent)}
                                    disabled={isUpdating}
                                    variant="outline"
                                    size="sm"
                                    className="border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary/50"
                                  >
                                    <Edit className="w-3 h-3 mr-1.5" />
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleDeactivateAgent(agent.id)}
                                    disabled={isUpdating || agent.totalStreams > 0n}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1.5" />
                                    {agent.totalStreams > 0n ? 'Has Active Streams' : 'Deactivate'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                        <AlertCircle className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/70 font-medium mb-1">No Registered Agents</p>
                      <p className="text-xs text-white/40">Register your first agent to get started</p>
                    </div>
                  );
                  })()}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Edit Agent Dialog */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full border border-secondary/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Edit Agent #{editingAgent.id}</h3>
                <p className="text-sm text-white/50 mt-1">
                  {predefinedAgents.find(a => a.id === editingAgent.id)?.name || 'Unknown Agent'}
                </p>
              </div>
              <Button
                onClick={() => setEditingAgent(null)}
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* Wallet Address */}
              <div>
                <Label htmlFor="edit-wallet" className="text-white/70 text-sm mb-2 block">
                  Wallet Address
                </Label>
                <Input
                  id="edit-wallet"
                  value={editWallet}
                  onChange={(e) => setEditWallet(e.target.value)}
                  placeholder="0x..."
                  className="bg-black/30 border-white/10 text-white font-mono"
                />
                <p className="text-xs text-white/40 mt-1">Agent will receive payments to this address</p>
              </div>

              {/* Price per Second */}
              <div>
                <Label htmlFor="edit-price" className="text-white/70 text-sm mb-2 block">
                  Price per Second (USDC)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.0001"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="0.001"
                  className="bg-black/30 border-white/10 text-white font-mono"
                />
                {editPrice && (
                  <div className="mt-2 p-2 bg-black/30 rounded border border-white/5">
                    <div className="text-xs text-white/50 mb-1">Pricing Preview:</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Per minute:</span>
                      <span className="text-secondary font-mono">${(parseFloat(editPrice) * 60).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Per hour:</span>
                      <span className="text-secondary font-mono">${(parseFloat(editPrice) * 3600).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Per day:</span>
                      <span className="text-secondary font-mono">${(parseFloat(editPrice) * 86400).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/90">
                    <strong>Note:</strong> Updating an agent will change its parameters immediately on-chain. Active streams will continue with the old rate until they expire.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setEditingAgent(null)}
                  variant="outline"
                  className="flex-1 border-white/10 text-white/70 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-white"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
