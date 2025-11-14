import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Activity } from "lucide-react";

interface AgentCardProps {
  name: string;
  category: string;
  description: string;
  pricePerSec: string;
  icon: React.ReactNode;
  features: string[];
  isStreaming?: boolean;
}

export const AgentCard = ({
  name,
  category,
  description,
  pricePerSec,
  icon,
  features,
  isStreaming = false,
}: AgentCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flip-card h-80"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ cursor: 'pointer' }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className="flip-card-front">
          <div className="glass h-full p-6 flex flex-col justify-between hover:glow-primary transition-all duration-300">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl glass-strong">
                  {icon}
                </div>
                <Badge
                  variant={isStreaming ? "default" : "secondary"}
                  className={`font-display text-xs tracking-wider ${
                    isStreaming ? "bg-secondary text-background animate-pulse" : ""
                  }`}
                >
                  {isStreaming ? "STREAMING" : "IDLE"}
                </Badge>
              </div>

              <h3 className="text-xl font-display font-semibold mb-2 tracking-wide">
                {name}
              </h3>
              <Badge variant="outline" className="mb-3 font-display text-xs tracking-widest">
                {category}
              </Badge>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3">
              {/* Mini Sparkline Placeholder */}
              <div className="h-12 rounded-lg glass-strong flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-body">
                  {pricePerSec}
                </span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-back">
          <div className="glass-strong h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold tracking-wide">
                  {name}
                </h3>
                <Badge variant="outline" className="font-display text-xs">
                  {category}
                </Badge>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="h-20 rounded-lg glass mb-4 flex items-center justify-center border border-primary/20">
                <span className="text-xs text-muted-foreground font-body">
                  Live Chart Preview
                </span>
              </div>

              {/* Key Features */}
              <ul className="space-y-2 mb-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="text-xs font-body text-muted-foreground flex items-start">
                    <span className="text-secondary mr-2">→</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Latest Log Preview */}
              <div className="glass p-3 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground">
                  Latest: Processing signals...
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wide"
              >
                Start Stream
              </Button>
              <Button
                variant="outline"
                className="w-full font-display tracking-wide"
              >
                More Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
