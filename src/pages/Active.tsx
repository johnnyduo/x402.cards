import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Square, Activity } from "lucide-react";

const activeStreams = [
  {
    name: "Signal Forge",
    category: "SIGNALS",
    rate: "0.0002 USDC/sec",
    elapsed: "00:05:23",
    spent: "0.032 USDC",
    icon: <Activity className="w-5 h-5 text-primary" />,
  },
  {
    name: "Volatility Pulse",
    category: "VOLATILITY",
    rate: "0.0001 USDC/sec",
    elapsed: "00:12:45",
    spent: "0.077 USDC",
    icon: <Activity className="w-5 h-5 text-primary" />,
  },
];

const Active = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
              Active Streams Console
            </h1>
            <p className="text-muted-foreground font-body">
              Monitor your running data streams and track real-time spending
            </p>
          </div>

          {activeStreams.length > 0 ? (
            <div className="space-y-6">
              {activeStreams.map((stream, idx) => (
                <div key={idx} className="glass-strong p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl glass">
                        {stream.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold mb-1">
                          {stream.name}
                        </h3>
                        <Badge variant="outline" className="font-display text-xs">
                          {stream.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <Badge className="bg-secondary text-background animate-pulse">
                      STREAMING
                    </Badge>
                  </div>

                  {/* Stream Flow Visualization */}
                  <div className="mb-6">
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div className="h-full stream-flow w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground font-body mb-1">
                        Rate
                      </p>
                      <p className="text-sm font-display font-semibold">
                        {stream.rate}
                      </p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground font-body mb-1">
                        Elapsed
                      </p>
                      <p className="text-sm font-display font-semibold font-mono">
                        {stream.elapsed}
                      </p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground font-body mb-1">
                        Spent
                      </p>
                      <p className="text-sm font-display font-semibold gradient-text">
                        {stream.spent}
                      </p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground font-body mb-1">
                        Status
                      </p>
                      <p className="text-sm font-display font-semibold text-secondary">
                        Flowing
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="font-display tracking-wide"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button
                      variant="outline"
                      className="font-display tracking-wide border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-strong p-12 rounded-2xl text-center">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-display font-semibold mb-2">
                No Active Streams
              </h3>
              <p className="text-muted-foreground font-body mb-6">
                Start streaming data by activating agent cards
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wide"
              >
                Browse Agents
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Active;
