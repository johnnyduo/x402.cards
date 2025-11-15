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
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <div
        className="relative rounded-full w-[280px] h-[280px] flex flex-col items-center justify-center transition-all duration-500"
        style={{
          background: allStreamsActive 
            ? 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(30, 58, 95, 0.8) 70%)'
            : 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, rgba(30, 58, 95, 0.6) 70%)',
          backdropFilter: 'blur(20px)',
          border: allStreamsActive 
            ? '2px solid rgba(0, 229, 255, 0.5)' 
            : '2px solid rgba(66, 153, 225, 0.3)',
          boxShadow: allStreamsActive
            ? "0 0 60px rgba(0, 229, 255, 0.4), 0 0 100px rgba(66, 153, 225, 0.2)"
            : "0 0 30px rgba(66, 153, 225, 0.2)",
        }}
      >
        {/* Outer ring animation */}
        <div 
          className="absolute inset-0 rounded-full"
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

        {/* Master Button */}
        <Button
          onClick={onToggleAll}
          size="lg"
          className={`rounded-full w-[140px] h-[140px] transition-all duration-500 text-sm font-display font-bold tracking-wider relative overflow-hidden group ${
            allStreamsActive
              ? "bg-secondary hover:bg-secondary/90 text-black shadow-2xl"
              : "bg-white/10 hover:bg-white/20 text-white border-2 border-white/30"
          }`}
          style={{
            boxShadow: allStreamsActive 
              ? '0 0 40px rgba(0, 229, 255, 0.6)' 
              : '0 0 20px rgba(66, 153, 225, 0.3)',
          }}
        >
          <span className="relative z-10 uppercase text-xs leading-tight">
            {allStreamsActive ? "Close All\nStreams" : "Open All\nStreams"}
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
