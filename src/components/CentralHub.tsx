import { Button } from "@/components/ui/button";
import { Activity, Power } from "lucide-react";

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
        className={`glass-strong p-6 rounded-full w-44 h-44 flex flex-col items-center justify-center transition-all duration-500 ${
          allStreamsActive ? "glow-primary scale-105" : ""
        }`}
        style={{
          boxShadow: allStreamsActive
            ? "0 0 60px hsl(var(--primary) / 0.5)"
            : "0 0 20px hsl(var(--primary) / 0.2)",
        }}
      >
        {/* Stats */}
        <div className="text-center mb-3 space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Activity className="w-3 h-3 text-secondary" />
            <span className="text-xs font-display text-muted-foreground">
              Active: {activeCount}
            </span>
          </div>
          <div className="text-sm font-display font-semibold gradient-text">
            {totalCostPerSec.toFixed(4)} USDC/s
          </div>
        </div>

        {/* Master Button */}
        <Button
          onClick={onToggleAll}
          size="lg"
          className={`rounded-full w-20 h-20 transition-all duration-300 ${
            allStreamsActive
              ? "stream-gradient shadow-lg animate-pulse"
              : "bg-muted/30 hover:bg-muted/50"
          }`}
        >
          <Power
            className={`w-8 h-8 transition-colors ${
              allStreamsActive ? "text-background" : "text-muted-foreground"
            }`}
          />
        </Button>

        <p className="text-[10px] font-display text-muted-foreground mt-2 tracking-wider">
          {allStreamsActive ? "ALL ON" : "ALL OFF"}
        </p>
      </div>
    </div>
  );
};
