import { useState } from 'react';
import { useAccount } from 'wagmi';
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
} from 'lucide-react';
import { useRegisterAgent, useAllAgents } from '@/hooks/useAgentRegistry';
import { formatUnits, parseUnits } from 'viem';

const predefinedAgents = [
  {
    id: 1,
    name: 'Signal Forge',
    category: 'SIGNALS',
    description: 'Sculpts high-frequency trade entries with adaptive quants.',
    pricePerSec: 0.0002,
    icon: <Activity className="w-5 h-5" />,
    features: [
      'Multi-timeframe pattern detection',
      'ML-powered signal generation',
      'Risk-adjusted entry/exit points',
      'Backtested strategy metrics',
    ],
  },
  {
    id: 2,
    name: 'Volatility Pulse',
    category: 'VOLATILITY',
    description: 'Detects turbulence spikes across majors & synths.',
    pricePerSec: 0.0002,
    icon: <TrendingUp className="w-5 h-5" />,
    features: [
      'Real-time VIX tracking',
      'Volatility forecasting models',
      'Cross-market correlation analysis',
      'Historical volatility comparisons',
    ],
  },
  {
    id: 3,
    name: 'Arb Navigator',
    category: 'ARBITRAGE',
    description: 'Plots cross-venue price corridors & neutral legs.',
    pricePerSec: 0.0002,
    icon: <GitBranch className="w-5 h-5" />,
    features: [
      'Multi-DEX price monitoring',
      'Gas-optimized route finding',
      'Flash loan opportunity detection',
      'Slippage impact calculations',
    ],
  },
  {
    id: 4,
    name: 'Sentiment Radar',
    category: 'SENTIMENT',
    description: 'Scrapes macro narratives & crowd mood vectors.',
    pricePerSec: 0.0002,
    icon: <Heart className="w-5 h-5" />,
    features: [
      'Multi-platform sentiment aggregation',
      'AI-powered emotion detection',
      'Influencer impact tracking',
      'Trending topic alerts',
    ],
  },
  {
    id: 5,
    name: 'Risk Sentinel',
    category: 'RISK',
    description: 'Scores systemic debt & collateral exposures.',
    pricePerSec: 0.0002,
    icon: <Shield className="w-5 h-5" />,
    features: [
      'Real-time liquidation risk scoring',
      'Portfolio health monitoring',
      'Collateral ratio tracking',
      'Smart contract risk analysis',
    ],
  },
  {
    id: 6,
    name: 'AI Crawler Service',
    category: 'REVENUE',
    description: 'Deploy AI crawlers to earn passive income from data collection.',
    pricePerSec: 0.0003,
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    features: [
      'Automated web data collection',
      'Real-time content indexing',
      'API monetization streams',
      'Earn 0.0003 USDC/sec per crawler',
    ],
  },
];

export default function Admin() {
  const { isConnected } = useAccount();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agentName, setAgentName] = useState('');
  const [walletAddress, setWalletAddress] = useState('0xa95dbdc9b74e08de421d03728988026fd2adbf5f');
  const [pricePerSecond, setPricePerSecond] = useState('');
  const [tokenURI, setTokenURI] = useState('');

  const { registerAgent, isLoading: isRegistering } = useRegisterAgent();
  const { agents, isLoading: isLoadingAgents, refetch } = useAllAgents();

  const handleRegister = async () => {
    if (!agentName || !walletAddress || !pricePerSecond) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const priceInWei = parseUnits(pricePerSecond, 6);

      await registerAgent(BigInt(0), walletAddress as `0x${string}`, priceInWei);

      toast.success('Agent registered successfully!');

      setSelectedAgent('');
      setAgentName('');
      setWalletAddress('0xa95dbdc9b74e08de421d03728988026fd2adbf5f');
      setPricePerSecond('');
      setTokenURI('');

      await refetch();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register agent');
    }
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
              <p className="text-white/70 mb-4">Connect wallet to access admin</p>
              <w3m-button />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold tracking-tight mb-3 text-white">Admin</h1>
              <p className="text-white/70 font-body">
                Register and manage AI agents on the x402 payment protocol
              </p>
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
                        {predefinedAgents.map((agent) => (
                          <SelectItem
                            key={agent.id}
                            value={agent.id.toString()}
                            textValue={agent.name}   // 👈 this fixes the “card in trigger” glitch
                            className="text-white hover:bg-secondary/10 cursor-pointer focus:bg-secondary/10 py-4 px-4 border-b border-white/5 last:border-0"
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
                        ))}
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
                    <Input
                      id="wallet-address"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full bg-black/30 border-white/10 text-white font-mono h-14 text-sm hover:bg-black/40 transition-colors"
                    />
                    <p className="text-xs text-white/50 mt-3">
                      This address will receive payments for agent usage
                    </p>
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || !selectedAgent || !walletAddress || !pricePerSecond}
                    className="w-full bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary h-9"
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
                </div>
              </TabsContent>

              {/* Manage Agents Tab */}
              <TabsContent value="manage" className="space-y-6 mt-6">
                <div className="glass-strong p-6 rounded-2xl">
                  {isLoadingAgents ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                    </div>
                  ) : agents && agents.length > 0 ? (
                    <div className="space-y-3">
                      {agents.map((agent) => (
                        <div
                          key={agent.id}
                          className="bg-black/20 rounded-lg p-3 border border-white/10 hover:border-secondary/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-secondary">#{agent.id}</span>
                              {agent.isActive ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              )}
                            </div>
                            <span className="text-xs text-white/40 font-mono">
                              {agent.wallet.slice(0, 6)}...{agent.wallet.slice(-4)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-white/50">Price/sec</div>
                              <div className="text-secondary font-mono">
                                {formatUnits(agent.pricePerSecond, 6)}
                              </div>
                            </div>
                            <div>
                              <div className="text-white/50">Earned</div>
                              <div className="text-emerald-400 font-mono">
                                {formatUnits(agent.totalEarned, 6)}
                              </div>
                            </div>
                            <div>
                              <div className="text-white/50">Streams</div>
                              <div className="text-white">{agent.totalStreams.toString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-white/50">No agents yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
