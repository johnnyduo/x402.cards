import { Button } from "@/components/ui/button";
import { Play, Wallet } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight leading-tight">
              Stream real-time{" "}
              <span className="gradient-text">market intelligence.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-xl">
              Activate autonomous data cards and pay only for the seconds you stream.
              Powered by IOTA EVM with x402 streaming payments.
            </p>

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wide"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-display tracking-wide border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right: Network Visualization */}
          <div className="glass-strong p-8 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden">
            {/* Central Wallet Node */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center glow-primary">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Agent Nodes (arranged in circle) */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * 72 * Math.PI) / 180;
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={i}
                  className="absolute w-12 h-12 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${x}px - 24px)`,
                    top: `calc(50% + ${y}px - 24px)`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                </div>
              );
            })}

            {/* Streaming Lines (will be animated) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 72 * Math.PI) / 180;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${x}px)`}
                    y2={`calc(50% + ${y}px)`}
                    stroke="url(#streamGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="opacity-0"
                  />
                );
              })}
              <defs>
                <linearGradient id="streamGradient">
                  <stop offset="0%" stopColor="hsl(var(--stream-start))" />
                  <stop offset="100%" stopColor="hsl(var(--stream-end))" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/40"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `drift ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
