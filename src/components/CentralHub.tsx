import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface CentralHubProps {
  activeCount: number;
  totalCostPerSec: number;
  allStreamsActive: boolean;
  onToggleAll: () => void;
}

export const CentralHub = ({
  activeCount,
  totalCostPerSec,
  allStreamsActive,
  onToggleAll,
}: CentralHubProps) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
      <div
        className="relative rounded-3xl w-[360px] h-[300px] flex flex-col items-center justify-center transition-all duration-500"
        style={{
          background: allStreamsActive 
            ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(66, 153, 225, 0.3) 50%, rgba(30, 58, 95, 0.85) 100%)'
            : 'linear-gradient(135deg, rgba(66, 153, 225, 0.18) 0%, rgba(30, 58, 95, 0.5) 50%, rgba(30, 58, 95, 0.65) 100%)',
          backdropFilter: 'blur(24px)',
          border: allStreamsActive 
            ? '3px solid rgba(0, 229, 255, 0.6)' 
            : '2px solid rgba(66, 153, 225, 0.35)',
          boxShadow: allStreamsActive
            ? "0 0 80px rgba(0, 229, 255, 0.5), 0 0 120px rgba(66, 153, 225, 0.3)"
            : "0 0 40px rgba(66, 153, 225, 0.25)",
        }}
      >
        {/* Outer glow animation */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            border: '1px solid rgba(0, 229, 255, 0.3)',
            animation: allStreamsActive ? 'pulse-ring 2s ease-in-out infinite' : 'none',
          }}
        />

        {/* Stats */}
        <div className="text-center mb-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-secondary" />
            <span className="text-xs font-display text-white/60 tracking-wider uppercase">
              Active Agents
            </span>
          </div>
          <div className="text-4xl font-display font-bold text-white">
            {activeCount} <span className="text-white/40">/ 6</span>
          </div>
          <div className="text-xs font-display text-white/50 uppercase tracking-wider">
            Cost / Sec
          </div>
          <div className="text-lg font-display font-bold gradient-text">
            {totalCostPerSec.toFixed(4)} USDC
          </div>
          
          {allStreamsActive && (
            <div className="mt-2">
              <span className="text-xs font-display text-secondary uppercase tracking-wider px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30">
                Balanced
              </span>
            </div>
          )}
        </div>

        {/* Master Button - Rectangular design matching cards */}
        <Button
          onClick={onToggleAll}
          size="lg"
          className={`rounded-2xl w-[240px] h-[140px] transition-all duration-500 text-sm font-display font-bold tracking-wider relative overflow-hidden group z-50 ${
            allStreamsActive
              ? "bg-secondary hover:bg-secondary/90 text-black shadow-2xl"
              : "bg-white/10 hover:bg-white/20 text-white border-2 border-white/30"
          }`}
          style={{
            boxShadow: allStreamsActive 
              ? '0 0 50px rgba(0, 229, 255, 0.7), 0 0 80px rgba(0, 229, 255, 0.4)' 
              : '0 0 25px rgba(66, 153, 225, 0.35)',
          }}
        >
          <span className="relative z-10 uppercase leading-tight text-center whitespace-pre-line px-6">
            {allStreamsActive ? "CLOSE ALL\nSTREAMS" : "OPEN ALL\nSTREAMS"}
          </span>
          {allStreamsActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                 style={{
                   animation: 'shimmer 2s infinite',
                   backgroundSize: '200% 100%'
                 }}
            />
          )}
        </Button>

        <p className="text-[10px] font-display text-white/40 mt-4 tracking-widest uppercase">
          Risk Posture: <span className={allStreamsActive ? "text-secondary" : "text-white/60"}>
            {allStreamsActive ? "Balanced" : "Inactive"}
          </span>
        </p>
      </div>
    </div>
  );
};
