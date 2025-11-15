import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";
import { AgentCard } from "@/components/AgentCard";
import { CentralHub } from "@/components/CentralHub";
import { StreamFlow } from "@/components/StreamFlow";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, GitBranch, Heart, Shield, Sparkles } from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Signal Forge",
    category: "SIGNALS",
    description: "Sculpts high-frequency trade entries with adaptive quants.",
    pricePerSec: 0.0002,
    icon: <Activity className="w-6 h-6 text-white" />,
    features: [
      "Multi-timeframe pattern detection",
      "ML-powered signal generation",
      "Risk-adjusted entry/exit points",
      "Backtested strategy metrics"
    ],
  },
  {
    id: 2,
    name: "Volatility Pulse",
    category: "VOLATILITY",
    description: "Detects turbulence spikes across majors & synths.",
    pricePerSec: 0.0002,
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    features: [
      "Real-time VIX tracking",
      "Volatility forecasting models",
      "Cross-market correlation analysis",
      "Historical volatility comparisons"
    ],
  },
  {
    id: 3,
    name: "Arb Navigator",
    category: "ARBITRAGE",
    description: "Plots cross-venue price corridors & neutral legs.",
    pricePerSec: 0.0002,
    icon: <GitBranch className="w-6 h-6 text-white" />,
    features: [
      "Multi-DEX price monitoring",
      "Gas-optimized route finding",
      "Flash loan opportunity detection",
      "Slippage impact calculations"
    ],
  },
  {
    id: 4,
    name: "Sentiment Radar",
    category: "SENTIMENT",
    description: "Scrapes macro narratives & crowd mood vectors.",
    pricePerSec: 0.0002,
    icon: <Heart className="w-6 h-6 text-white" />,
    features: [
      "Multi-platform sentiment aggregation",
      "AI-powered emotion detection",
      "Influencer impact tracking",
      "Trending topic alerts"
    ],
  },
  {
    id: 5,
    name: "Risk Sentinel",
    category: "RISK",
    description: "Scores systemic debt & collateral exposures.",
    pricePerSec: 0.0002,
    icon: <Shield className="w-6 h-6 text-white" />,
    features: [
      "Real-time liquidation risk scoring",
      "Portfolio health monitoring",
      "Collateral ratio tracking",
      "Smart contract risk analysis"
    ],
  },
  {
    id: 6,
    name: "+ Add-on Streams",
    category: "EXTEND",
    description: "Plug in bespoke alpha modules & partner feeds.",
    pricePerSec: 0,
    icon: <Sparkles className="w-6 h-6 text-white" />,
    features: [
      "Partner ecosystem integration",
      "Custom data stream creation",
      "Advanced analytics modules",
      "Enterprise-grade SLAs"
    ],
  },
];

const Streams = () => {
  const [streamStates, setStreamStates] = useState<Record<number, boolean>>({});

  // Count only non-addon active streams
  const activeCount = agents
    .filter(agent => agent.id !== 6 && streamStates[agent.id])
    .length;

  const totalCostPerSec = agents
    .filter((agent) => streamStates[agent.id])
    .reduce((sum, agent) => sum + agent.pricePerSec, 0);

  // Check if all non-addon streams (5 agents) are active
  const allStreamsActive = agents
    .filter(agent => agent.id !== 6)
    .every(agent => streamStates[agent.id]);

  const handleToggleAll = () => {
    const newState = !allStreamsActive;
    const newStates: Record<number, boolean> = {};
    agents.forEach((agent) => {
      if (agent.id !== 6) { // Exclude add-ons from master toggle
        newStates[agent.id] = newState;
      }
    });
    setStreamStates(newStates);
  };

  const handleToggleStream = (agentId: number, active: boolean) => {
    setStreamStates((prev) => ({ ...prev, [agentId]: active }));
  };

  // Grid positions for 6 cards (2x3 layout)
  const gridPositions = [
    { row: 0, col: 0 }, // top-left
    { row: 0, col: 1 }, // top-center
    { row: 0, col: 2 }, // top-right
    { row: 1, col: 0 }, // bottom-left
    { row: 1, col: 1 }, // bottom-center
    { row: 1, col: 2 }, // bottom-right
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <AppHeader />

      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-[1850px] mx-auto">
          {/* Laptop Screen Container - Balanced card layout */}
          <div 
            className="rounded-3xl relative overflow-visible min-h-[800px] p-4 md:p-12 lg:p-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 153, 225, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(66, 153, 225, 0.1)'
            }}
          >
            {/* Connecting lines from cards to central hub */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
              {agents.slice(0, 5).map((agent, idx) => {
                const isActive = streamStates[agent.id] || false;
                const pos = gridPositions[idx];
                
                // Card dimensions and spacing
                const cardWidth = 260;
                const cardHeight = 260;
                const gapX = 170;
                const gapY = 160;
                const paddingX = 80;
                const paddingY = 80;
                
                // Calculate card center
                const cardCenterX = paddingX + (pos.col * (cardWidth + gapX)) + cardWidth / 2;
                const cardCenterY = paddingY + (pos.row * (cardHeight + gapY)) + cardHeight / 2;
                
                // Hub center (same calculation as before)
                const totalWidth = (cardWidth * 3) + (gapX * 2) + (paddingX * 2);
                const totalHeight = (cardHeight * 2) + gapY + (paddingY * 2);
                const hubCenterX = totalWidth / 2;
                const hubCenterY = totalHeight / 2;
                
                // Calculate line dimensions
                const lineWidth = Math.abs(hubCenterX - cardCenterX);
                const lineHeight = Math.abs(hubCenterY - cardCenterY);
                
                // Determine line position and direction
                const isLeft = cardCenterX < hubCenterX;
                const isTop = cardCenterY < hubCenterY;
                
                return (
                  <div key={agent.id}>
                    {/* Vertical line */}
                    <div
                      className={`absolute transition-all duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{
                        left: `${cardCenterX}px`,
                        top: isTop ? `${cardCenterY}px` : `${hubCenterY}px`,
                        width: '2px',
                        height: `${lineHeight}px`,
                        background: isActive 
                          ? 'linear-gradient(180deg, rgba(0, 229, 255, 0.8), rgba(66, 153, 225, 0.6))'
                          : 'rgba(66, 153, 225, 0.4)',
                        boxShadow: isActive ? '0 0 8px rgba(0, 229, 255, 0.5)' : 'none',
                      }}
                    >
                      {isActive && (
                        <div 
                          className="absolute w-2 h-2 rounded-full bg-secondary"
                          style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            animation: 'flowVertical 2s ease-in-out infinite',
                            boxShadow: '0 0 8px rgba(0, 229, 255, 0.8)',
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Horizontal line */}
                    <div
                      className={`absolute transition-all duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{
                        left: isLeft ? `${cardCenterX}px` : `${hubCenterX}px`,
                        top: isTop ? `${hubCenterY}px` : `${cardCenterY}px`,
                        width: `${lineWidth}px`,
                        height: '2px',
                        background: isActive 
                          ? 'linear-gradient(90deg, rgba(66, 153, 225, 0.6), rgba(0, 229, 255, 0.8))'
                          : 'rgba(66, 153, 225, 0.4)',
                        boxShadow: isActive ? '0 0 8px rgba(0, 229, 255, 0.5)' : 'none',
                      }}
                    >
                      {isActive && (
                        <div 
                          className="absolute w-2 h-2 rounded-full bg-secondary"
                          style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            animation: 'flowHorizontal 2s ease-in-out infinite',
                            boxShadow: '0 0 8px rgba(0, 229, 255, 0.8)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Hub - Perfect centered positioning with expanded spacing */}
            <div className="hidden lg:block">
              <CentralHub
                activeCount={activeCount}
                totalCostPerSec={totalCostPerSec}
                allStreamsActive={allStreamsActive}
                onToggleAll={handleToggleAll}
              />
            </div>
            
            {/* Mobile/Tablet Master Control */}
            <div className="lg:hidden sticky top-20 z-50 mb-6">
              <div className="glass-strong p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-display text-white/60">Active: {activeCount} / 6</div>
                  <div className="text-lg font-display font-bold gradient-text">{totalCostPerSec.toFixed(4)} USDC/s</div>
                </div>
                <Button
                  onClick={handleToggleAll}
                  className={`rounded-xl px-6 py-3 font-display font-bold text-xs ${
                    allStreamsActive
                      ? "bg-secondary hover:bg-secondary/90 text-black"
                      : "bg-white/10 hover:bg-white/20 text-white border-2 border-white/30"
                  }`}
                >
                  {allStreamsActive ? "CLOSE ALL" : "OPEN ALL"}
                </Button>
              </div>
            </div>

            {/* Agent Cards Grid - Responsive balanced layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 lg:gap-x-[170px] lg:gap-y-[160px] relative">
              {agents.map((agent, idx) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  category={agent.category}
                  description={agent.description}
                  pricePerSec={agent.id === 6 ? "COMING SOON" : `${agent.pricePerSec.toFixed(4)} USDC / SEC`}
                  icon={agent.icon}
                  features={agent.features}
                  isStreaming={streamStates[agent.id] || false}
                  onToggleStream={(active) => handleToggleStream(agent.id, active)}
                  isAddon={agent.id === 6}
                />
              ))}
            </div>

            {/* Floating Particles - Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                    background: Math.random() > 0.5 
                      ? 'rgba(66, 153, 225, 0.4)' 
                      : 'rgba(0, 229, 255, 0.3)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `drift ${5 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                    boxShadow: '0 0 15px rgba(66, 153, 225, 0.4)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Streams;
