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

      <section className="px-6 pb-20">
        <div className="max-w-[1800px] mx-auto">
          {/* Laptop Screen Container - Full-screen card spread */}
          <div 
            className="rounded-3xl p-20 relative overflow-visible min-h-[1000px]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 153, 225, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(66, 153, 225, 0.1)'
            }}
          >
            {/* SVG for flow lines - No z-index conflicts with expanded layout */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="streamGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(66, 153, 225, 1)" />
                  <stop offset="50%" stopColor="rgba(0, 229, 255, 1)" />
                  <stop offset="100%" stopColor="rgba(66, 153, 225, 1)" />
                </linearGradient>
                <linearGradient id="streamGradientInactive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(66, 153, 225, 0.3)" />
                  <stop offset="100%" stopColor="rgba(66, 153, 225, 0.3)" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {agents.slice(0, 5).map((agent, idx) => {
                const pos = gridPositions[idx];
                // Smaller cards but wider spread for full-screen distribution
                const cardWidth = 300;
                const cardHeight = 300;
                const gap = 120; // Much larger gap for full-screen spread
                
                // Calculate card center positions spread across full container
                const fromX = (pos.col * (cardWidth + gap)) + cardWidth / 2 + 80;
                const fromY = (pos.row * (cardHeight + gap)) + cardHeight / 2 + 80;
                
                // Center hub position - perfectly centered with wide spacing
                const containerWidth = (cardWidth * 3) + (gap * 2) + 160;
                const containerHeight = (cardHeight * 2) + gap + 160;
                const toX = containerWidth / 2;
                const toY = containerHeight / 2;

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

            {/* Central Hub - Perfect centered positioning with expanded spacing */}
            <CentralHub
              activeCount={activeCount}
              totalCostPerSec={totalCostPerSec}
              allStreamsActive={allStreamsActive}
              onToggleAll={handleToggleAll}
            />

            {/* Agent Cards Grid - Full-screen spread with smaller cards */}
            <div className="grid grid-cols-3 gap-[120px] relative">
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
