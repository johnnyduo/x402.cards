import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AgentCard } from "@/components/AgentCard";
import { Activity, TrendingUp, GitBranch, Heart, Shield, Sparkles } from "lucide-react";

const agents = [
  {
    name: "Signal Forge",
    category: "SIGNALS",
    description: "Real-time trading signals with ML-powered pattern recognition across multiple timeframes.",
    pricePerSec: "0.0002 USDC/sec",
    icon: <Activity className="w-6 h-6 text-primary" />,
    features: [
      "Multi-timeframe pattern detection",
      "ML-powered signal generation",
      "Risk-adjusted entry/exit points",
      "Backtested strategy metrics"
    ],
  },
  {
    name: "Volatility Pulse",
    category: "VOLATILITY",
    description: "Track market volatility indices and predict turbulence zones before they happen.",
    pricePerSec: "0.0001 USDC/sec",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    features: [
      "Real-time VIX tracking",
      "Volatility forecasting models",
      "Cross-market correlation analysis",
      "Historical volatility comparisons"
    ],
  },
  {
    name: "Arb Navigator",
    category: "ARBITRAGE PATHS",
    description: "Discover profitable arbitrage opportunities across DEXs with gas cost optimization.",
    pricePerSec: "0.0003 USDC/sec",
    icon: <GitBranch className="w-6 h-6 text-primary" />,
    features: [
      "Multi-DEX price monitoring",
      "Gas-optimized route finding",
      "Flash loan opportunity detection",
      "Slippage impact calculations"
    ],
  },
  {
    name: "Sentiment Radar",
    category: "SENTIMENT",
    description: "Aggregate social sentiment from Twitter, Reddit, and Discord with AI sentiment scoring.",
    pricePerSec: "0.0001 USDC/sec",
    icon: <Heart className="w-6 h-6 text-primary" />,
    features: [
      "Multi-platform sentiment aggregation",
      "AI-powered emotion detection",
      "Influencer impact tracking",
      "Trending topic alerts"
    ],
  },
  {
    name: "Risk Sentinel",
    category: "RISK INDICES",
    description: "Monitor portfolio risk metrics and get alerts before potential liquidations.",
    pricePerSec: "0.0002 USDC/sec",
    icon: <Shield className="w-6 h-6 text-primary" />,
    features: [
      "Real-time liquidation risk scoring",
      "Portfolio health monitoring",
      "Collateral ratio tracking",
      "Smart contract risk analysis"
    ],
  },
  {
    name: "+ Add-on Streams",
    category: "ADD-ONS",
    description: "Premium partner data streams. More agents coming soon from vetted providers.",
    pricePerSec: "Varies",
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
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-3">
              Data Agent Cards
            </h2>
            <p className="text-muted-foreground font-body">
              Flip a card to preview → Start stream → Watch real-time intelligence flow in
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, idx) => (
              <AgentCard key={idx} {...agent} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Streams;
