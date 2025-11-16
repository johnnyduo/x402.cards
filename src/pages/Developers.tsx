import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Activity, GitBranch, AlertCircle, Zap, Shield, Sparkles, Heart, Check, X } from "lucide-react";
import { useAgentData } from "@/hooks/useAgentData";
import { useAllAgents } from "@/hooks/useAgentRegistry";
import { AGENTS as predefinedAgents } from "@/data/agents";
import { AgentStreamToggle } from "@/components/AgentStreamToggle";
import { useAgentStreamStatus } from "@/hooks/useAgentStreamStatus";

const Agents = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 flex items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
                Agents
              </h1>
              <p className="text-muted-foreground font-body">
                Real-time AI-powered market analysis and trading intelligence
              </p>
            </div>
            <div className="flex-shrink-0 -mr-20 -mt-16 -mb-16 overflow-hidden" style={{ width: '200px', height: '200px' }}>
              <dotlottie-player
                src="/Robot TFU.lottie"
                autoplay
                loop
                style={{ 
                  width: '300px', 
                  height: '300px',
                  transform: 'translate(-50px, -50px)'
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Live Agent Data */}
            <LiveAgentData />

            {/* x402 + EIP-8004 Advantages */}
            <div className="glass p-8 rounded-2xl border-2 border-secondary/30 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-secondary/20 backdrop-blur-sm">
                    <Zap className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-xl font-display font-bold gradient-text">
                    x402 + EIP-8004 Advantages
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Per-Second Streaming */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-emerald-500/20">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">Per-Second Streaming</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Pay only for what you use with precise per-second metering, no overpayment
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gas Efficient */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-blue-500/20">
                        <Zap className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">Gas Efficient</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Batch settlement model reduces costs - only 2 transactions for entire stream
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Instant Settlement */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-purple-500/20">
                        <Activity className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">Instant Settlement</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Agents can claim accumulated funds anytime without waiting for stream end
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* No Lock-in */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">No Lock-in</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Stop anytime and unused time is refunded - full flexibility and control
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transparent Pricing */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-cyan-500/20">
                        <GitBranch className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">Transparent Pricing</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Real-time tracking shows exactly what you've paid and what's accumulated
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Composable Protocol */}
                  <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-md bg-pink-500/20">
                        <Activity className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">Composable Protocol</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          EIP-8004 standard enables integration with DeFi, DAOs, and other protocols
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 text-center font-mono">
                    Powered by <span className="text-secondary">x402 Streaming Protocol</span> + <span className="text-primary">EIP-8004 Standard</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Live Agent Data Component
function LiveAgentData() {
  // Signal Forge active symbol tab
  const [signalForgeSymbol, setSignalForgeSymbol] = useState<'BTC/USD' | 'ETH/USD' | 'SOL/USD'>('BTC/USD');
  
  // AI Crawler URL management
  const [crawlUrl, setCrawlUrl] = useState('');
  const [allowedUrls, setAllowedUrls] = useState<string[]>([]);
  const [urlActionLoading, setUrlActionLoading] = useState(false);
  
  // Get on-chain stream status for each agent (synced across pages)
  const { isStreaming: signalForgeStreamActive } = useAgentStreamStatus(1);
  const { isStreaming: volatilityPulseStreamActive } = useAgentStreamStatus(2);
  const { isStreaming: arbNavigatorStreamActive } = useAgentStreamStatus(3);
  const { isStreaming: sentimentRadarStreamActive } = useAgentStreamStatus(4);
  const { isStreaming: riskSentinelStreamActive } = useAgentStreamStatus(5);
  const { isStreaming: aiCrawlerStreamActive } = useAgentStreamStatus(6);
  
  // Only fetch API data when stream is active for each agent
  const { data: signalData, loading: signalLoading } = useAgentData(
    'signal-forge', 
    { symbol: signalForgeSymbol, interval: '5min' },
    signalForgeStreamActive
  );
  const { data: volData, loading: volLoading } = useAgentData(
    'volatility-pulse', 
    { symbol: 'BTC/USD' },
    volatilityPulseStreamActive
  );
  const { data: arbData, loading: arbLoading } = useAgentData(
    'arb-navigator', 
    { symbols: 'BTC/USD,ETH/USD,BNB/USD' },
    arbNavigatorStreamActive
  );
  const { data: sentimentData, loading: sentimentLoading } = useAgentData(
    'sentiment-radar', 
    { symbol: 'BTC' },
    sentimentRadarStreamActive
  );
  const { data: riskData, loading: riskLoading } = useAgentData(
    'risk-sentinel',
    { protocols: 'aave,compound,makerdao' },
    riskSentinelStreamActive
  );
  const { data: crawlerData, loading: crawlerLoading } = useAgentData(
    'ai-crawler',
    { targets: 'twitter,reddit,discord' },
    aiCrawlerStreamActive
  );
  const { agents, isLoading: isLoadingAgents } = useAllAgents();

  // AI Crawler URL handlers
  const handleAllowUrl = async () => {
    if (!crawlUrl || !crawlUrl.startsWith('http')) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    setUrlActionLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!allowedUrls.includes(crawlUrl)) {
      setAllowedUrls(prev => [...prev, crawlUrl]);
    }
    setCrawlUrl('');
    setUrlActionLoading(false);
  };

  const handleBlockUrl = async () => {
    if (!crawlUrl || !crawlUrl.startsWith('http')) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    setUrlActionLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAllowedUrls(prev => prev.filter(url => url !== crawlUrl));
    setCrawlUrl('');
    setUrlActionLoading(false);
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setAllowedUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  // Map agent IDs to their on-chain data and real-time stream status
  const getAgentStatus = (agentId: number) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.wallet === '0x0') return { registered: false, streaming: false, awaitingStream: false };
    
    // Get real-time streaming status based on agent ID
    let isCurrentlyStreaming = false;
    switch(agentId) {
      case 1: isCurrentlyStreaming = signalForgeStreamActive; break;
      case 2: isCurrentlyStreaming = volatilityPulseStreamActive; break;
      case 3: isCurrentlyStreaming = arbNavigatorStreamActive; break;
      case 4: isCurrentlyStreaming = sentimentRadarStreamActive; break;
      case 5: isCurrentlyStreaming = riskSentinelStreamActive; break;
      case 6: isCurrentlyStreaming = aiCrawlerStreamActive; break;
    }
    
    // Registered = agent exists on-chain
    // Awaiting Stream = registered but no active stream currently
    // Streaming = has active stream right now
    const registered = true;
    
    return {
      registered,
      awaitingStream: registered && !isCurrentlyStreaming,
      streaming: isCurrentlyStreaming,
      totalStreams: Number(agent.totalStreams),
    };
  };

  return (
    <div className="glass-strong p-6 rounded-2xl">
      <h2 className="text-xl font-display font-semibold mb-6">Live Agent Data</h2>
      
      {/* Agent Lifecycle & Stream Activation */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-transparent border border-secondary/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold text-white">Agent Lifecycle & Stream Activation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Status 1: Not Registered */}
          <div className="glass p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all">
            <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0 mb-2">
              NOT REGISTERED
            </Badge>
            <p className="text-xs text-white/70 leading-relaxed">Agent not deployed on-chain</p>
            <p className="text-[10px] text-white/40 mt-1">→ Register in Setting</p>
          </div>
          
          {/* Status 2: Registered */}
          <div className="glass p-3 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all">
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0 mb-2">
              REGISTERED
            </Badge>
            <p className="text-xs text-white/70 leading-relaxed">Contract deployed & ready</p>
            <p className="text-[10px] text-white/40 mt-1">→ Activate stream</p>
          </div>
          
          {/* Status 3: Awaiting Stream */}
          <div className="glass p-3 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 mb-2 animate-pulse">
              AWAITING STREAM
            </Badge>
            <p className="text-xs text-white/70 leading-relaxed">No active payment yet</p>
            <p className="text-[10px] text-white/40 mt-1">→ Start streaming</p>
          </div>
          
          {/* Status 4: Streaming */}
          <div className="glass p-3 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all bg-emerald-500/5">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0 mb-2">
              <Zap className="w-2.5 h-2.5 mr-1" />
              STREAMING
            </Badge>
            <p className="text-xs text-white/70 leading-relaxed">Live data feed active</p>
            <p className="text-[10px] text-emerald-400 mt-1">✓ Real-time analytics</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Signal Forge */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(1).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(1).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(1).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(1).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-semibold">Signal Forge</h3>
                {getAgentStatus(1).streaming ? (
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                    <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                    STREAMING
                  </Badge>
                ) : getAgentStatus(1).awaitingStream ? (
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                    AWAITING STREAM
                  </Badge>
                ) : getAgentStatus(1).registered ? (
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                    REGISTERED
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                    NOT REGISTERED
                  </Badge>
                )}
              </div>
            </div>
            <Activity className={`w-4 h-4 ${
              getAgentStatus(1).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(1).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={1}
                agentName="Signal Forge"
                pricePerSecond={0.001}
              />
            </div>
          )}

          {/* Data Display - Only when streaming */}
          {signalForgeStreamActive ? (
            <Tabs value={signalForgeSymbol} onValueChange={(v) => setSignalForgeSymbol(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 mb-3">
                <TabsTrigger value="BTC/USD" className="text-xs data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  BTC
                </TabsTrigger>
                <TabsTrigger value="ETH/USD" className="text-xs data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  ETH
                </TabsTrigger>
                <TabsTrigger value="SOL/USD" className="text-xs data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  SOL
                </TabsTrigger>
              </TabsList>

              {signalLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                </div>
              ) : signalData ? (
                <div className="space-y-2">
                  <div className="mb-2">
                    <span className="text-xs font-mono text-secondary font-bold">{signalData.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">${signalData.currentPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">RSI</span>
                    <span className="font-semibold">{signalData.indicators?.rsi14?.toFixed(1)}</span>
                  </div>
                  <div className="bg-black/20 rounded p-2 mt-2">
                    <Badge variant="outline" className={
                      signalData.signal?.action === 'BUY' ? 'border-green-500 text-green-500' :
                      signalData.signal?.action === 'SELL' ? 'border-red-500 text-red-500' :
                      'border-white/30'
                    }>
                      {signalData.signal?.action}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{signalData.signal?.reason}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-white/40 text-sm">
                  Waiting for data...
                </div>
              )}
            </Tabs>
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              {getAgentStatus(1).registered 
                ? 'Activate stream to view real-time data'
                : 'Register agent in Admin first'}
            </div>
          )}
        </Card>

        {/* Volatility Pulse */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(2).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(2).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(2).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(2).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">Volatility Pulse</h3>
              {getAgentStatus(2).streaming ? (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                  STREAMING
                </Badge>
              ) : getAgentStatus(2).awaitingStream ? (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                  AWAITING STREAM
                </Badge>
              ) : getAgentStatus(2).registered ? (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                  REGISTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                  NOT REGISTERED
                </Badge>
              )}
            </div>
            <TrendingUp className={`w-4 h-4 ${
              getAgentStatus(2).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(2).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={2}
                agentName="Volatility Pulse"
                pricePerSecond={0.001}
              />
            </div>
          )}

          {/* Data Display - Only when streaming */}
          {volatilityPulseStreamActive ? (
            volLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              </div>
            ) : volData ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Regime</span>
                  <Badge variant="outline" className={
                    volData.regime === 'LOW' ? 'border-green-500 text-green-500' :
                    volData.regime === 'NORMAL' ? 'border-blue-500 text-blue-500' :
                    volData.regime === 'ELEVATED' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }>
                    {volData.regime}
                  </Badge>
                </div>

                {/* Fear Index Chart */}
                <div className="bg-black/20 rounded p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Fear & Greed Index</span>
                    <span className="font-bold text-2xl gradient-text">
                      {volData.fearIndex?.toFixed(0) || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Visual Scale Bar */}
                  <div className="relative h-8 rounded-full overflow-hidden" style={{
                    background: 'linear-gradient(90deg, hsl(210, 100%, 56%), hsl(180, 100%, 50%))'
                  }}>
                    {/* Indicator */}
                    {volData.fearIndex != null && (
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-500"
                        style={{ 
                          left: `${volData.fearIndex}%`,
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Scale Labels */}
                  <div className="flex justify-between text-[9px] text-white/60 font-medium">
                    <span>0<br/>Extreme Fear</span>
                    <span className="text-center">25<br/>Fear</span>
                    <span className="text-center">50<br/>Neutral</span>
                    <span className="text-center">75<br/>Greed</span>
                    <span className="text-right">100<br/>Extreme Greed</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annualized Vol</span>
                  <span className="font-semibold">{(volData.realizedVolAnnualized * 100)?.toFixed(2)}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-white/40 text-sm">
                Waiting for data...
              </div>
            )
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              {getAgentStatus(2).registered 
                ? 'Activate stream to view real-time data'
                : 'Register agent in Setting first'}
            </div>
          )}
        </Card>

        {/* Arb Navigator */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(3).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(3).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(3).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(3).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">Arb Navigator</h3>
              {getAgentStatus(3).streaming ? (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                  STREAMING
                </Badge>
              ) : getAgentStatus(3).awaitingStream ? (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                  AWAITING STREAM
                </Badge>
              ) : getAgentStatus(3).registered ? (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                  REGISTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                  NOT REGISTERED
                </Badge>
              )}
            </div>
            <GitBranch className={`w-4 h-4 ${
              getAgentStatus(3).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(3).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={3}
                agentName="Arb Navigator"
                pricePerSecond={0.0005}
              />
            </div>
          )}

          {!getAgentStatus(3).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Setting first
            </div>
          ) : arbNavigatorStreamActive ? (
            arbLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              </div>
            ) : arbData ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opportunities</span>
                  <span className="text-secondary font-bold">{arbData.summary?.totalOpportunities || 0}</span>
                </div>
                {arbData.whaleTracking && (
                  <div className="bg-black/20 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Whale Activity</span>
                      <Badge variant="outline" className={
                        arbData.whaleTracking.whaleActivity === 'HIGH' ? 'border-red-500 text-red-500 text-xs' :
                        arbData.whaleTracking.whaleActivity === 'MEDIUM' ? 'border-yellow-500 text-yellow-500 text-xs' :
                        'border-green-500 text-green-500 text-xs'
                      }>
                        {arbData.whaleTracking.whaleActivity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      IOTA Mainnet: {arbData.whaleTracking.totalTransactions} txs • {arbData.whaleTracking.recentBlocks} blocks
                    </div>
                  </div>
                )}
                {arbData.opportunities?.slice(0, 1).map((opp: any, idx: number) => (
                  <div key={idx} className="bg-black/20 rounded p-2 text-xs">
                    <div className="font-semibold mb-1">{opp.pair.join(' ↔ ')}</div>
                    <div className="text-muted-foreground">
                      Spread: <span className="text-secondary">{opp.spreadPct?.toFixed(3)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-white/40 text-sm">
                Waiting for data...
              </div>
            )
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Activate stream to view real-time data
            </div>
          )}
        </Card>

        {/* Sentiment Radar */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(4).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(4).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(4).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(4).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">Sentiment Radar</h3>
              {getAgentStatus(4).streaming ? (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                  STREAMING
                </Badge>
              ) : getAgentStatus(4).awaitingStream ? (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                  AWAITING STREAM
                </Badge>
              ) : getAgentStatus(4).registered ? (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                  REGISTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                  NOT REGISTERED
                </Badge>
              )}
            </div>
            <Heart className={`w-4 h-4 ${
              getAgentStatus(4).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(4).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={4}
                agentName="Sentiment Radar"
                pricePerSecond={0.0008}
              />
            </div>
          )}

          {!getAgentStatus(4).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Setting first
            </div>
          ) : sentimentRadarStreamActive ? (
            sentimentLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              </div>
            ) : sentimentData ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mood</span>
                  <Badge variant="outline" className={
                    sentimentData.mood?.includes('GREED') ? 'border-green-500 text-green-500' :
                    sentimentData.mood?.includes('FEAR') ? 'border-red-500 text-red-500' :
                    'border-white/30'
                  }>
                    {sentimentData.mood}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <div className="text-green-500 font-bold">{sentimentData.metrics?.bullishPercent?.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Bull</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{sentimentData.metrics?.neutralPercent?.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold">{sentimentData.metrics?.bearishPercent?.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Bear</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-white/40 text-sm">
                Waiting for data...
              </div>
            )
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Activate stream to view real-time data
            </div>
          )}
        </Card>

        {/* Risk Sentinel */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(5).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(5).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(5).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(5).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">Risk Sentinel</h3>
              {getAgentStatus(5).streaming ? (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                  STREAMING
                </Badge>
              ) : getAgentStatus(5).awaitingStream ? (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                  AWAITING STREAM
                </Badge>
              ) : getAgentStatus(5).registered ? (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                  REGISTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                  NOT REGISTERED
                </Badge>
              )}
            </div>
            <Shield className={`w-4 h-4 ${
              getAgentStatus(5).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(5).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={5}
                agentName="Risk Sentinel"
                pricePerSecond={0.001}
              />
            </div>
          )}

          {!getAgentStatus(5).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Setting first
            </div>
          ) : riskSentinelStreamActive ? (
            riskLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              </div>
            ) : riskData ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <Badge variant="outline" className={
                    (riskData.riskScore || 0) > 70 ? 'border-red-500 text-red-500' :
                    (riskData.riskScore || 0) > 40 ? 'border-yellow-500 text-yellow-500' :
                    'border-green-500 text-green-500'
                  }>
                    {riskData.riskScore || 0}/100
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-center">
                    <div className="font-bold">{riskData.liquidationRisk || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Liq Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{riskData.healthFactor || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Health</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-white/40 text-sm">
                Waiting for data...
              </div>
            )
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Activate stream to view real-time data
            </div>
          )}
        </Card>

        {/* AI Crawler Service */}
        <Card className={`glass p-4 relative overflow-hidden ${
          getAgentStatus(6).streaming ? 'ring-2 ring-emerald-500/30' : 
          getAgentStatus(6).awaitingStream ? 'ring-2 ring-yellow-500/30' :
          getAgentStatus(6).registered ? 'ring-1 ring-blue-500/30' : 'opacity-60'
        }`}>
          {getAgentStatus(6).streaming && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">AI Crawler Service</h3>
              {getAgentStatus(6).streaming ? (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-1 animate-pulse" />
                  STREAMING
                </Badge>
              ) : getAgentStatus(6).awaitingStream ? (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0 animate-pulse">
                  AWAITING STREAM
                </Badge>
              ) : getAgentStatus(6).registered ? (
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                  REGISTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                  NOT REGISTERED
                </Badge>
              )}
            </div>
            <Sparkles className={`w-4 h-4 ${
              getAgentStatus(6).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {/* Stream Activation Toggle */}
          {getAgentStatus(6).registered && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <AgentStreamToggle
                agentId={6}
                agentName="AI Crawler Service"
                pricePerSecond={0.003}
              />
            </div>
          )}

          {!getAgentStatus(6).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Setting first
            </div>
          ) : aiCrawlerStreamActive ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                  ACTIVE - Earning Per Second
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crawl-url" className="text-xs text-white/80">
                  Manage Crawl URLs
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="crawl-url"
                    type="url"
                    placeholder="https://example.com"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAllowUrl()}
                    disabled={urlActionLoading}
                    className="flex-1 bg-black/20 border-white/10 focus:border-secondary text-sm"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAllowUrl}
                    disabled={urlActionLoading || !crawlUrl}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 gap-1.5"
                  >
                    {urlActionLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Allow
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleBlockUrl}
                    disabled={urlActionLoading || !crawlUrl}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold px-3 gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Block
                  </Button>
                </div>
                <p className="text-[10px] text-white/40 italic">
                  Allow or block URLs from being crawled. Earn 0.003 USDC/sec while streaming
                </p>

                {/* Allowed URLs List */}
                {allowedUrls.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[10px] text-emerald-400/60 uppercase font-semibold">
                      Allowed URLs ({allowedUrls.length})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {allowedUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1.5 group">
                          <span className="text-xs text-emerald-400/80 truncate flex-1 mr-2">{url}</span>
                          <button
                            onClick={() => handleRemoveUrl(url)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-red-400 hover:text-red-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {crawlerLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                </div>
              ) : crawlerData ? (
                <div className="bg-black/20 rounded-lg p-3 mt-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="font-bold">{crawlerData.pagesIndexed || 0}</div>
                      <div className="text-xs text-muted-foreground">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-500 font-bold">{crawlerData.earnings || '0.00'}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{crawlerData.uptime || '100'}%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Activate stream to view real-time data
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Agents;
