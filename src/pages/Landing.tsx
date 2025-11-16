import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Activity } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1535] to-[#0a0e27]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-center lg:text-left space-y-6 pt-8 md:pt-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-[1.2]">
                <span className="gradient-text block">Tokenized AI Agents</span>
                <span className="text-white block">Real-Time Streaming Payments</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed">
                Deploy autonomous <span className="text-primary font-semibold">tokenized agents</span> for real-time DeFi intelligence and automated web crawling. Powered by <span className="text-secondary font-semibold">X402 streaming payments</span>—pay only per second for active automation flows, on-chain.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider">
                  X402 Protocol
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                  EIP-8004
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  IOTA EVM
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  ReactFlow
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button
                  onClick={() => navigate('/agents')}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-black font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-secondary/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Launch App
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                
                <Button
                  onClick={() => navigate('/streams')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 text-secondary font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl transition-all duration-300"
                >
                  View Streams
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 md:gap-8 justify-center lg:justify-start pt-6">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-display font-bold text-secondary">6</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">AI Agents</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-display font-bold text-primary">$0.0008</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">Avg Cost/Sec</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-display font-bold gradient-text">On-Chain</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">IOTA EVM</div>
                </div>
              </div>
            </div>

            {/* Right - Robot Mascot */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end w-full lg:w-auto">
              <div className="relative w-fit">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-3xl scale-150 animate-pulse" />
                
                {/* Robot Container */}
                <div className="relative overflow-hidden max-w-[300px] max-h-[300px] md:max-w-[380px] md:max-h-[380px] lg:max-w-[450px] lg:max-h-[450px] transition-all duration-500 hover:scale-105">
                  <dotlottie-player 
                    src="/Robot TFU.lottie" 
                    autoplay 
                    loop 
                    style={{ width: '500px', height: '500px', margin: '-100px' }}
                    className="md:!w-[633px] md:!h-[633px] md:!-m-[126px] lg:!w-[750px] lg:!h-[750px] lg:!-m-[150px]"
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-gradient-to-r from-emerald-500 to-secondary px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-xl animate-bounce border border-white/20">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-black" />
                    <span className="font-bold text-black text-sm">Live Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Why <span className="gradient-text">x402.Cards</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Built on <span className="text-secondary font-semibold">X402 Protocol</span> and <span className="text-primary font-semibold">EIP-8004</span> standards with <span className="text-purple-400 font-semibold">ReactFlow</span> visualization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-6 border border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">X402 Streaming</h3>
              <p className="text-white/60">
                Revolutionary per-second payment protocol. Pay only for what you use with X402 streaming technology. No subscriptions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">EIP-8004 Agents</h3>
              <p className="text-white/60">
                Standardized AI agent registry with EIP-8004. Access live market data, signals, and analytics from verified agents 24/7.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ReactFlow Visualization</h3>
              <p className="text-white/60">
                Interactive stream visualization with ReactFlow. Monitor all agent payments and data flows in real-time with beautiful graphs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-2xl p-6 border border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IOTA EVM Powered</h3>
              <p className="text-white/60">
                Built on IOTA EVM for near-zero fees. Gas-optimized smart contracts make micro-payments practical and scalable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="glass rounded-2xl md:rounded-3xl p-8 md:p-12 border-2 border-secondary/30 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 animate-pulse" />
            
            <div className="relative z-10 text-center space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
                Ready to <span className="gradient-text">Stream Intelligence</span>?
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Join the future of DeFi data access with <span className="text-secondary font-semibold">X402</span> + <span className="text-primary font-semibold">EIP-8004</span>. Deploy your first agent in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 md:pt-4">
                <Button
                  onClick={() => navigate('/agents')}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-black font-bold text-base md:text-lg px-8 md:px-10 py-4 md:py-6 rounded-xl transition-all duration-300 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => window.open('https://github.com/johnnyduo/x402.cards', '_blank')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-base md:text-lg px-8 md:px-10 py-4 md:py-6 rounded-xl transition-all duration-300"
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60">
              © 2025 x402.Cards. Built on IOTA EVM.
            </div>
              <div className="flex gap-6">
              <a href="https://x402.cards" className="text-white/60 hover:text-secondary transition-colors">
                Website
              </a>
              <a href="https://github.com/johnnyduo/x402.cards" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors">
                GitHub
              </a>
              <a href="https://docs.x402.cards" className="text-white/60 hover:text-secondary transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
