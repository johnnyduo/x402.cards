import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Activity, GitBranch, AlertCircle, Zap } from "lucide-react";
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
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
              Agents
            </h1>
            <p className="text-muted-foreground font-body">
              Real-time AI-powered market analysis and trading intelligence
            </p>
          </div>

          <div className="space-y-6">
            {/* Status Info Banner */}
            <div className="glass-strong p-4 rounded-xl border border-secondary/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-2">Agent Status Flow</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] px-1.5 py-0">
                        NOT REGISTERED
                      </Badge>
                      <span>→</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px] px-1.5 py-0">
                        REGISTERED
                      </Badge>
                      <span>→</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px] px-1.5 py-0">
                        AWAITING STREAM
                      </Badge>
                      <span>→</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        STREAMING
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Agent Data */}
            <LiveAgentData />

            {/* Coming Soon */}
            <div className="glass p-6 rounded-2xl border-2 border-secondary/20">
              <h3 className="text-lg font-display font-semibold mb-2 gradient-text">
                Coming Soon
              </h3>
              <ul className="space-y-2">
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Advanced analytics modules
                </li>
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Partner data card marketplace
                </li>
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Custom agent creation tools
                </li>
              </ul>
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
  
  // Get on-chain stream status for each agent (synced across pages)
  const { isStreaming: signalForgeStreamActive } = useAgentStreamStatus(1);
  const { isStreaming: volatilityPulseStreamActive } = useAgentStreamStatus(2);
  const { isStreaming: arbNavigatorStreamActive } = useAgentStreamStatus(3);
  const { isStreaming: sentimentRadarStreamActive } = useAgentStreamStatus(4);
  
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
  const { agents, isLoading: isLoadingAgents } = useAllAgents();

  // Map agent IDs to their on-chain data
  const getAgentStatus = (agentId: number) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.wallet === '0x0') return { registered: false, streaming: false, awaitingStream: false };
    
    // Registered = agent exists on-chain
    // Awaiting Stream = registered but no active streams yet
    // Streaming = has active streams
    const registered = true;
    const hasStreams = agent.totalStreams > 0n;
    const isActive = agent.isActive;
    
    return {
      registered,
      awaitingStream: registered && !hasStreams && isActive,
      streaming: hasStreams && isActive,
      totalStreams: Number(agent.totalStreams),
    };
  };

  return (
    <div className="glass-strong p-6 rounded-2xl">
      <h2 className="text-xl font-display font-semibold mb-6">Live Agent Data</h2>
      
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
                : 'Register agent in Admin first'}
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

          {!getAgentStatus(3).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Admin first
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
            <Activity className={`w-4 h-4 ${
              getAgentStatus(4).streaming ? 'text-emerald-400 animate-pulse' : 'text-secondary'
            }`} />
          </div>

          {!getAgentStatus(4).registered ? (
            <div className="text-center py-6 text-white/40 text-sm italic">
              Register agent in Admin first
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
      </div>
    </div>
  );
}

export default Agents;
