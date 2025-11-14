import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";
import { AgentCard } from "@/components/AgentCard";
import { CentralHub } from "@/components/CentralHub";
import { StreamFlow } from "@/components/StreamFlow";
import { Activity, TrendingUp, GitBranch, Heart, Shield, Sparkles } from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Signal Forge",
    category: "SIGNALS",
    description: "Real-time trading signals with ML-powered pattern recognition across multiple timeframes.",
    pricePerSec: 0.0002,
    icon: <Activity className="w-6 h-6 text-primary" />,
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
    description: "Track market volatility indices and predict turbulence zones before they happen.",
    pricePerSec: 0.0001,
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
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
    category: "ARBITRAGE PATHS",
    description: "Discover profitable arbitrage opportunities across DEXs with gas cost optimization.",
    pricePerSec: 0.0003,
    icon: <GitBranch className="w-6 h-6 text-primary" />,
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
    description: "Aggregate social sentiment from Twitter, Reddit, and Discord with AI sentiment scoring.",
    pricePerSec: 0.0001,
    icon: <Heart className="w-6 h-6 text-primary" />,
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
    category: "RISK INDICES",
    description: "Monitor portfolio risk metrics and get alerts before potential liquidations.",
    pricePerSec: 0.0002,
    icon: <Shield className="w-6 h-6 text-primary" />,
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
    category: "ADD-ONS",
    description: "Premium partner data streams. More agents coming soon from vetted providers.",
    pricePerSec: 0,
    icon: <Sparkles className="w-6 h-6 text-secondary" />,
    features: [
      "Partner ecosystem integration",
      "Custom data stream creation",
      "OPAL-secure compute (coming soon)",
      "Enterprise-grade SLAs"
    ],
  },
];

const Streams = () => {
  const [streamStates, setStreamStates] = useState<Record<number, boolean>>({});

  const activeCount = Object.values(streamStates).filter(Boolean).length;
  const totalCostPerSec = agents
    .filter((agent) => streamStates[agent.id])
    .reduce((sum, agent) => sum + agent.pricePerSec, 0);
  const allStreamsActive = activeCount === agents.length - 1; // Exclude add-ons

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

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Laptop Screen Container */}
          <div className="glass-strong rounded-3xl p-8 relative overflow-visible min-h-[800px]">
            {/* SVG for flow lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--stream-start))" />
                  <stop offset="100%" stopColor="hsl(var(--stream-end))" />
                </linearGradient>
              </defs>

              {agents.slice(0, 5).map((agent, idx) => {
                const pos = gridPositions[idx];
                const cardWidth = 320;
                const cardHeight = 320;
                const gap = 24;
                
                // Calculate card center positions
                const fromX = (pos.col * (cardWidth + gap)) + cardWidth / 2 + 32;
                const fromY = (pos.row * (cardHeight + gap)) + cardHeight / 2 + 32;
                
                // Center hub position
                const toX = 960 / 2; // Half of container width
                const toY = 800 / 2; // Half of container height

                return (
                  <StreamFlow
                    key={agent.id}
                    fromX={fromX}
                    fromY={fromY}
                    toX={toX}
                    toY={toY}
                    isActive={streamStates[agent.id] || false}
                    index={idx}
                  />
                );
              })}
            </svg>

            {/* Central Hub */}
            <CentralHub
              activeCount={activeCount}
              totalCostPerSec={totalCostPerSec}
              allStreamsActive={allStreamsActive}
              onToggleAll={handleToggleAll}
            />

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-3 gap-6 relative z-0">
              {agents.map((agent, idx) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  category={agent.category}
                  description={agent.description}
                  pricePerSec={`${agent.pricePerSec.toFixed(4)} USDC/sec`}
                  icon={agent.icon}
                  features={agent.features}
                  isStreaming={streamStates[agent.id] || false}
                  onToggleStream={(active) => handleToggleStream(agent.id, active)}
                />
              ))}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `drift ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
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
