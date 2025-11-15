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
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <AppHeader />

      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-secondary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <section className="px-4 md:px-6 pb-20 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-4 px-6 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <span className="text-xs font-display font-bold text-secondary uppercase tracking-wider">Live Intelligence Dashboard</span>
            </div>
            <h1 className="text-5xl font-display font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #4299E1 50%, #00E5FF 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite'
            }}>
              Streaming Agent Matrix
            </h1>
            <p className="text-white/60 font-display text-lg max-w-2xl mx-auto">
              Real-time data streams flowing through autonomous intelligence agents
            </p>
          </div>

          {/* Main Container with 3D perspective */}
          <div 
            className="rounded-3xl relative min-h-[900px] p-8 lg:p-16"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, rgba(30, 58, 95, 0.3) 40%, rgba(17, 24, 39, 0.9) 100%)',
              backdropFilter: 'blur(24px)',
              border: '2px solid rgba(0, 229, 255, 0.2)',
              boxShadow: '0 30px 80px rgba(0, 229, 255, 0.15), inset 0 0 60px rgba(0, 229, 255, 0.05)',
              transformStyle: 'preserve-3d',
              perspective: '2000px'
            }}
          >
            {/* Animated connection lines with glow effect */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 229, 255, 0)" />
                  <stop offset="50%" stopColor="rgba(0, 229, 255, 0.8)" />
                  <stop offset="100%" stopColor="rgba(66, 153, 225, 0.6)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                  <path d="M0,0 L0,12 L12,6 z" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)" />
                </marker>
              </defs>
              
              {/* Card 1 to hub */}
              {streamStates[1] && (
                <>
                  <path d="M 160 280 L 160 450 L 690 450" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none" filter="url(#glow)" markerEnd="url(#arrow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 160 280 L 160 450 L 690 450" />
                  </circle>
                </>
              )}
              
              {/* Card 2 to hub */}
              {streamStates[2] && (
                <>
                  <path d="M 690 280 L 690 450" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none" filter="url(#glow)" markerEnd="url(#arrow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 690 280 L 690 450" />
                  </circle>
                </>
              )}
              
              {/* Card 3 to hub */}
              {streamStates[3] && (
                <>
                  <path d="M 1220 280 L 1220 450 L 690 450" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none" filter="url(#glow)" markerEnd="url(#arrow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 1220 280 L 1220 450 L 690 450" />
                  </circle>
                </>
              )}
              
              {/* Card 4 to hub */}
              {streamStates[4] && (
                <>
                  <path d="M 160 620 L 160 450 L 690 450" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none" filter="url(#glow)" markerEnd="url(#arrow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 160 620 L 160 450 L 690 450" />
                  </circle>
                </>
              )}
              
              {/* Card 5 to hub */}
              {streamStates[5] && (
                <>
                  <path d="M 1220 620 L 1220 450 L 690 450" stroke="url(#lineGradient)" strokeWidth="3" strokeDasharray="8 4" fill="none" filter="url(#glow)" markerEnd="url(#arrow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="rgba(0, 229, 255, 0.9)" filter="url(#glow)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 1220 620 L 1220 450 L 690 450" />
                  </circle>
                </>
              )}
            </svg>

            {/* 3D Layout grid with perspective */}
            <div className="relative" style={{ minHeight: '900px' }}>
              {/* Left column cards with 3D effect */}
              <div 
                className="absolute left-0 top-0 space-y-8 transition-all duration-700 hover:scale-105" 
                style={{ 
                  width: '320px', 
                  zIndex: 10,
                  transform: 'translateZ(50px) rotateY(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="transition-all duration-500 hover:translateZ-20">
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
                </div>
                <div className="transition-all duration-500 hover:translateZ-20">
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
              </div>

              {/* Center column with enhanced hub */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-0" 
                style={{ 
                  zIndex: 30,
                  transform: 'translateZ(100px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="space-y-8">
                  <div style={{ width: '320px' }} className="transition-all duration-500 hover:scale-105">
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
                  
                  {/* Enhanced Central Hub */}
                  <div className="flex justify-center my-8 relative">
                    {/* Pulsing glow rings */}
                    {allStreamsActive && (
                      <>
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.4) 0%, transparent 70%)',
                            width: '500px',
                            height: '500px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            animationDuration: '3s'
                          }}
                        />
                        <div 
                          className="absolute inset-0 rounded-full animate-pulse"
                          style={{
                            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, transparent 80%)',
                            width: '600px',
                            height: '600px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            animationDuration: '2s'
                          }}
                        />
                      </>
                    )}
                    <div className="relative z-10">
                      <CentralHub
                        activeCount={activeCount}
                        totalCostPerSec={totalCostPerSec}
                        allStreamsActive={allStreamsActive}
                        onToggleAll={handleToggleAll}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column cards with 3D effect */}
              <div 
                className="absolute right-0 top-0 space-y-8 transition-all duration-700 hover:scale-105" 
                style={{ 
                  width: '320px', 
                  zIndex: 10,
                  transform: 'translateZ(50px) rotateY(-5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="transition-all duration-500 hover:translateZ-20">
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
                </div>
                <div className="transition-all duration-500 hover:translateZ-20">
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
