import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navigation } from '@/components/Navigation';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
      // Convert price to USDC wei (6 decimals)
      const priceInWei = parseUnits(pricePerSecond, 6);
      
      await registerAgent(
        BigInt(0), // Agent ID will be auto-assigned
        walletAddress as `0x${string}`,
        priceInWei
      );

      toast.success('Agent registered successfully!');
      
      // Clear form
      setAgentName('');
      setWalletAddress('');
      setPricePerSecond('');
      setTokenURI('');
      
      // Refresh agent list
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
      <AppHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-[400px] bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Authentication Required
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Please connect your wallet to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <w3m-button />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings2 className="w-8 h-8 text-cyan-400" />
                <h1 className="text-4xl font-bold text-white">Agent Registry Admin</h1>
              </div>
              <p className="text-gray-400">
                Manage AI agents on the x402 payment protocol
              </p>
              <div className="mt-4 flex gap-4">
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/5">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </Badge>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 bg-cyan-400/5">
                  IOTA EVM Testnet
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="register" className="space-y-6">
              <TabsList className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm">
                <TabsTrigger value="register" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Agent
                </TabsTrigger>
                <TabsTrigger value="manage" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Manage Agents
                </TabsTrigger>
              </TabsList>

              {/* Register Agent Tab */}
              <TabsContent value="register" className="space-y-6">
                <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Register New Agent</CardTitle>
                    <CardDescription className="text-gray-400">
                      Deploy a new AI agent to the x402 streaming payment protocol
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-blue-500/10 border-blue-500/30">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <AlertDescription className="text-blue-300">
                        Agents will be registered on-chain with EIP-8004 identity and payment capabilities
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="agentName" className="text-gray-300">
                          Agent Name *
                        </Label>
                        <Input
                          id="agentName"
                          placeholder="e.g., Signal Forge"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="bg-gray-950/50 border-gray-700 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="walletAddress" className="text-gray-300">
                          Payment Wallet Address *
                        </Label>
                        <Input
                          id="walletAddress"
                          placeholder="0x..."
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="bg-gray-950/50 border-gray-700 text-white font-mono"
                        />
                        <p className="text-xs text-gray-500">
                          Where streaming payments will be sent
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pricePerSecond" className="text-gray-300">
                          Price Per Second (USDC) *
                        </Label>
                        <div className="relative">
                          <Input
                            id="pricePerSecond"
                            type="number"
                            step="0.000001"
                            placeholder="0.0001"
                            value={pricePerSecond}
                            onChange={(e) => setPricePerSecond(e.target.value)}
                            className="bg-gray-950/50 border-gray-700 text-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            USDC/sec
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPricePerSecond('0.0001')}
                            className="text-xs bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                          >
                            $0.36/hr
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPricePerSecond('0.0002')}
                            className="text-xs bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                          >
                            $0.72/hr
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPricePerSecond('0.0003')}
                            className="text-xs bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                          >
                            $1.08/hr
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tokenURI" className="text-gray-300">
                          Token URI (Optional)
                        </Label>
                        <Input
                          id="tokenURI"
                          placeholder="ipfs://... or https://..."
                          value={tokenURI}
                          onChange={(e) => setTokenURI(e.target.value)}
                          className="bg-gray-950/50 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500">
                          IPFS or HTTP link to agent metadata JSON
                        </p>
                      </div>

                      <Separator className="bg-gray-800" />

                      <div className="bg-gray-950/50 rounded-lg p-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Preview</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Agent Name:</span>
                            <span className="text-white">{agentName || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Wallet:</span>
                            <span className="text-white font-mono text-xs">
                              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hourly Rate:</span>
                            <span className="text-cyan-400">
                              {pricePerSecond ? `$${(parseFloat(pricePerSecond) * 3600).toFixed(2)}` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Daily Rate:</span>
                            <span className="text-cyan-400">
                              {pricePerSecond ? `$${(parseFloat(pricePerSecond) * 86400).toFixed(2)}` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleRegister}
                        disabled={isRegistering || !agentName || !walletAddress || !pricePerSecond}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        {isRegistering ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Registering On-Chain...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Register Agent
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manage Agents Tab */}
              <TabsContent value="manage" className="space-y-6">
                <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Registered Agents</CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage all agents in the registry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAgents ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      </div>
                    ) : agents && agents.length > 0 ? (
                      <div className="space-y-4">
                        {agents.map((agent) => (
                          <div
                            key={agent.id}
                            className="bg-gray-950/50 rounded-lg p-4 border border-gray-800 hover:border-cyan-500/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    ID: {agent.id}
                                  </Badge>
                                  <h3 className="text-lg font-medium text-white">
                                    Agent #{agent.id}
                                  </h3>
                                  {agent.isActive ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Wallet:</span>
                                    <span className="text-white font-mono">
                                      {agent.wallet.slice(0, 6)}...{agent.wallet.slice(-4)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Price:</span>
                                    <span className="text-cyan-400">
                                      {formatUnits(agent.pricePerSecond, 6)} USDC/sec
                                    </span>
                                    <span className="text-gray-600">
                                      (${(parseFloat(formatUnits(agent.pricePerSecond, 6)) * 3600).toFixed(2)}/hr)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Total Earned:</span>
                                    <span className="text-emerald-400">
                                      {formatUnits(agent.totalEarned, 6)} USDC
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Total Streams:</span>
                                    <span className="text-white">{agent.totalStreams.toString()}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                              >
                                <Settings2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No agents registered yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Register your first agent to get started
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
