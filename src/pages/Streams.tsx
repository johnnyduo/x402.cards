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

  const activeCount = agents
    .filter(agent => agent.id !== 6 && streamStates[agent.id])
    .length;

  const totalCostPerSec = agents
    .filter((agent) => streamStates[agent.id])
    .reduce((sum, agent) => sum + agent.pricePerSec, 0);

  const allStreamsActive = agents
    .filter(agent => agent.id !== 6)
    .every(agent => streamStates[agent.id]);

  const handleToggleAll = () => {
    const newState = !allStreamsActive;
    const newStates: Record<number, boolean> = {};
    agents.forEach((agent) => {
      if (agent.id !== 6) {
        newStates[agent.id] = newState;
      }
    });
    setStreamStates(newStates);
  };

  const handleToggleStream = (agentId: number, active: boolean) => {
    setStreamStates((prev) => ({ ...prev, [agentId]: active }));
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <AppHeader />

      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="rounded-3xl relative min-h-[900px] p-12"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 153, 225, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Connection lines SVG */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="rgba(0, 229, 255, 0.8)" />
                </marker>
              </defs>
              
              {/* Card 1 (top-left) to hub */}
              <path
                d="M 160 280 L 160 450 L 690 450"
                stroke={streamStates[1] ? "rgba(0, 229, 255, 0.8)" : "rgba(66, 153, 225, 0.3)"}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd={streamStates[1] ? "url(#arrow)" : ""}
                className="transition-all duration-300"
              />
              
              {/* Card 2 (top-center) to hub */}
              <path
                d="M 690 280 L 690 450"
                stroke={streamStates[2] ? "rgba(0, 229, 255, 0.8)" : "rgba(66, 153, 225, 0.3)"}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd={streamStates[2] ? "url(#arrow)" : ""}
                className="transition-all duration-300"
              />
              
              {/* Card 3 (top-right) to hub */}
              <path
                d="M 1220 280 L 1220 450 L 690 450"
                stroke={streamStates[3] ? "rgba(0, 229, 255, 0.8)" : "rgba(66, 153, 225, 0.3)"}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd={streamStates[3] ? "url(#arrow)" : ""}
                className="transition-all duration-300"
              />
              
              {/* Card 4 (bottom-left) to hub */}
              <path
                d="M 160 620 L 160 450 L 690 450"
                stroke={streamStates[4] ? "rgba(0, 229, 255, 0.8)" : "rgba(66, 153, 225, 0.3)"}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd={streamStates[4] ? "url(#arrow)" : ""}
                className="transition-all duration-300"
              />
              
              {/* Card 5 (bottom-right) to hub */}
              <path
                d="M 1220 620 L 1220 450 L 690 450"
                stroke={streamStates[5] ? "rgba(0, 229, 255, 0.8)" : "rgba(66, 153, 225, 0.3)"}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd={streamStates[5] ? "url(#arrow)" : ""}
                className="transition-all duration-300"
              />
            </svg>

            {/* Layout grid */}
            <div className="relative" style={{ minHeight: '900px' }}>
              {/* Left column cards */}
              <div className="absolute left-0 top-0 space-y-8" style={{ width: '320px', zIndex: 10 }}>
                <AgentCard
                  name={agents[0].name}
                  category={agents[0].category}
                  description={agents[0].description}
                  pricePerSec={`${agents[0].pricePerSec.toFixed(4)} USDC / SEC`}
                  icon={agents[0].icon}
                  features={agents[0].features}
                  isStreaming={streamStates[1] || false}
                  onToggleStream={(active) => handleToggleStream(1, active)}
                />
                <AgentCard
                  name={agents[3].name}
                  category={agents[3].category}
                  description={agents[3].description}
                  pricePerSec={`${agents[3].pricePerSec.toFixed(4)} USDC / SEC`}
                  icon={agents[3].icon}
                  features={agents[3].features}
                  isStreaming={streamStates[4] || false}
                  onToggleStream={(active) => handleToggleStream(4, active)}
                />
              </div>

              {/* Center column - Hub and cards */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0" style={{ zIndex: 20 }}>
                <div className="space-y-8">
                  <div style={{ width: '320px' }}>
                    <AgentCard
                      name={agents[1].name}
                      category={agents[1].category}
                      description={agents[1].description}
                      pricePerSec={`${agents[1].pricePerSec.toFixed(4)} USDC / SEC`}
                      icon={agents[1].icon}
                      features={agents[1].features}
                      isStreaming={streamStates[2] || false}
                      onToggleStream={(active) => handleToggleStream(2, active)}
                    />
                  </div>
                  
                  {/* Central Hub */}
                  <div className="flex justify-center my-8">
                    <CentralHub
                      activeCount={activeCount}
                      totalCostPerSec={totalCostPerSec}
                      allStreamsActive={allStreamsActive}
                      onToggleAll={handleToggleAll}
                    />
                  </div>
                </div>
              </div>

              {/* Right column cards */}
              <div className="absolute right-0 top-0 space-y-8" style={{ width: '320px', zIndex: 10 }}>
                <AgentCard
                  name={agents[2].name}
                  category={agents[2].category}
                  description={agents[2].description}
                  pricePerSec={`${agents[2].pricePerSec.toFixed(4)} USDC / SEC`}
                  icon={agents[2].icon}
                  features={agents[2].features}
                  isStreaming={streamStates[3] || false}
                  onToggleStream={(active) => handleToggleStream(3, active)}
                />
                <AgentCard
                  name={agents[4].name}
                  category={agents[4].category}
                  description={agents[4].description}
                  pricePerSec={`${agents[4].pricePerSec.toFixed(4)} USDC / SEC`}
                  icon={agents[4].icon}
                  features={agents[4].features}
                  isStreaming={streamStates[5] || false}
                  onToggleStream={(active) => handleToggleStream(5, active)}
                />
              </div>
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
