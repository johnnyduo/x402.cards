import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Plus, CheckCircle2, AlertCircle, Settings2, TrendingUp } from 'lucide-react';
import { useRegisterAgent, useAllAgents } from '@/hooks/useAgentRegistry';
import { formatUnits, parseUnits } from 'viem';

export default function Admin() {
  const { address, isConnected } = useAccount();
  const [agentName, setAgentName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
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
      
      await registerAgent(
        BigInt(0),
        walletAddress as `0x${string}`,
        priceInWei
      );

      toast.success('Agent registered successfully!');
      
      setAgentName('');
      setWalletAddress('');
      setPricePerSecond('');
      setTokenURI('');
      
      await refetch();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register agent');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{
      background: 'radial-gradient(ellipse at top, rgba(30, 58, 138, 0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.9), transparent 50%), linear-gradient(to bottom, #0f172a, #020617)'
    }}>
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
              <h1 className="text-4xl font-display font-bold tracking-tight mb-3 text-white">
                Admin
              </h1>
              <p className="text-white/70 font-body">
                Register and manage AI agents on the x402 payment protocol
              </p>
            </div>

            <Tabs defaultValue="register" className="space-y-6">
              <TabsList className="glass-strong">
                <TabsTrigger value="register" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Agent
                </TabsTrigger>
                <TabsTrigger value="manage" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Manage Agents
                </TabsTrigger>
              </TabsList>

              {/* Register Agent Tab */}
              <TabsContent value="register" className="space-y-6">
                <div className="glass-strong p-6 rounded-2xl space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Agent Name *</Label>
                        <Input
                          placeholder="Signal Forge"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Price/sec (USDC) *</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0.0002"
                          value={pricePerSecond}
                          onChange={(e) => setPricePerSecond(e.target.value)}
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Wallet Address *</Label>
                      <Input
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-black/20 border-white/10 text-white font-mono h-9"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/50">
                      {pricePerSecond && (
                        <span className="text-secondary">
                          ${(parseFloat(pricePerSecond) * 3600).toFixed(2)}/hr · ${(parseFloat(pricePerSecond) * 86400).toFixed(2)}/day
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering || !agentName || !walletAddress || !pricePerSecond}
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
              <TabsContent value="manage" className="space-y-6">
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
                                <div className="text-white">
                                  {agent.totalStreams.toString()}
                                </div>
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
