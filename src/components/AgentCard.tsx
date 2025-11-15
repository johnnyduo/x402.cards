import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Activity } from "lucide-react";

interface AgentCardProps {
  name: string;
  category: string;
  description: string;
  pricePerSec: string;
  icon: React.ReactNode;
  features: string[];
  isStreaming?: boolean;
  onToggleStream?: (active: boolean) => void;
  isAddon?: boolean;
}

export const AgentCard = ({
  name,
  category,
  description,
  pricePerSec,
  icon,
  features,
  isStreaming = false,
  onToggleStream,
  isAddon = false,
}: AgentCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = (checked: boolean) => {
    onToggleStream?.(checked);
  };

  const handleCardClick = () => {
    if (!isAddon) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="flip-card h-[280px] md:h-[260px]"
      onClick={handleCardClick}
      style={{ cursor: isAddon ? 'default' : 'pointer' }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className="flip-card-front">
          <div 
            className={`card-gradient h-full p-5 flex flex-col justify-between transition-all duration-300 relative ${
              isStreaming ? "animate-pulse-glow" : ""
            }`}
            style={{
              borderRadius: '1.25rem',
              border: isStreaming 
                ? '1px solid rgba(0, 229, 255, 0.5)' 
                : '1px solid rgba(66, 153, 225, 0.3)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {icon}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge
                    variant={isStreaming ? "default" : "secondary"}
                    className={`font-display text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-full ${
                      isStreaming 
                        ? "bg-secondary/90 text-black font-semibold" 
                        : "bg-white/10 text-white/60 border-white/20"
                    }`}
                  >
                    {isStreaming ? "ON" : isAddon ? "OFF" : "OFF"}
                  </Badge>
                  {!isAddon && (
                    <div onClick={(e) => e.stopPropagation()} className="relative z-50">
                      <Switch
                        checked={isStreaming}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-secondary"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <p className="text-[9px] font-display text-white/50 tracking-[0.2em] uppercase mb-1.5">
                  {category}
                </p>
                <h3 className="text-lg font-display font-bold mb-1.5 tracking-tight text-white">
                  {name}
                </h3>
              </div>
              
              <p className="text-xs text-white/70 font-body leading-relaxed mb-3">
                {description}
              </p>
            </div>

            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] text-white/50 font-body font-medium">
                  {pricePerSec}
                </span>
                {!isAddon && (
                  <div className="flex items-center gap-2 relative z-50" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={isStreaming}
                      onCheckedChange={handleToggle}
                      className="data-[state=checked]:bg-secondary scale-90"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-back">
          <div 
            className="card-gradient h-full p-6 flex flex-col justify-between relative"
            style={{
              borderRadius: '1.25rem',
              border: '1px solid rgba(66, 153, 225, 0.3)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold tracking-tight text-white">
                  {name}
                </h3>
                <Badge 
                  variant="outline" 
                  className="font-display text-[10px] bg-white/10 text-white/60 border-white/20"
                >
                  {category}
                </Badge>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="h-20 rounded-lg bg-black/20 mb-4 flex items-center justify-center border border-white/10">
                <span className="text-xs text-white/40 font-body">
                  Live Chart Preview
                </span>
              </div>

              {/* Key Features */}
              <ul className="space-y-2 mb-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="text-xs font-body text-white/70 flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Latest Log Preview */}
              <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <p className="text-xs font-mono text-white/50">
                  Latest: Processing signals...
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4 relative z-10">
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-black font-display tracking-wide font-semibold"
              >
                Start Stream
              </Button>
              <Button
                variant="outline"
                className="w-full font-display tracking-wide border-white/20 text-white hover:bg-white/10"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
