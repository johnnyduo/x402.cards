import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";

const Flow = () => {
  const [activeStreams, setActiveStreams] = useState<Record<string, boolean>>({
    signal: false,
    volatility: false,
    arb: false,
    sentiment: false,
    risk: false,
  });

  const sources = [
    { id: "signal", name: "Signal Forge", desc: "High-frequency signals" },
    { id: "volatility", name: "Volatility Pulse", desc: "Market turbulence" },
    { id: "arb", name: "Arb Navigator", desc: "Cross-venue arbitrage" },
    { id: "sentiment", name: "Sentiment Radar", desc: "Crowd sentiment" },
    { id: "risk", name: "Risk Sentinel", desc: "Portfolio risk" },
  ];

  const routes = [
    { id: 1, name: "ROUTE 1", type: "Pipeline", filter: "Signal Filter" },
    { id: 2, name: "ROUTE 2", type: "Pack", filter: "Volatility Filter" },
    { id: 3, name: "ROUTE 3", type: "Pipeline", filter: "Arb Filter" },
    { id: 4, name: "ROUTE 4", type: "Pack", filter: "Sentiment Filter" },
  ];

  const destinations = [
    { id: 1, name: "Live Dashboard" },
    { id: 2, name: "Alert System" },
    { id: 3, name: "Data Lake" },
    { id: 4, name: "API Gateway" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <AppHeader />

      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold gradient-text mb-2">Stream Flow Architecture</h1>
            <p className="text-white/60 font-display">Data pipeline visualization for x402 streaming intelligence</p>
          </div>

          <div 
            className="rounded-3xl relative min-h-[800px] p-8"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 153, 225, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* SVG for connection lines */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="rgba(0, 229, 255, 0.8)" />
                </marker>
              </defs>

              {/* Source 1 to Route 1 */}
              <path d="M 380 120 L 520 190" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Source 2 to Route 2 */}
              <path d="M 380 240 L 520 310" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Source 3 to Route 3 */}
              <path d="M 380 360 L 520 430" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Source 4 to Route 4 */}
              <path d="M 380 480 L 520 550" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Source 5 to Routes (multiple) */}
              <path d="M 380 600 L 520 430" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Route 1 to Destinations */}
              <path d="M 920 190 L 1060 120" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              <path d="M 920 190 L 1060 210" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Route 2 to Destinations */}
              <path d="M 920 310 L 1060 210" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              <path d="M 920 310 L 1060 300" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Route 3 to Destinations */}
              <path d="M 920 430 L 1060 300" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              <path d="M 920 430 L 1060 390" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
              
              {/* Route 4 to Destinations */}
              <path d="M 920 550 L 1060 390" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" strokeDasharray="8 4" fill="none" markerEnd="url(#arrowBlue)" />
            </svg>

            {/* Main Content Grid */}
            <div className="relative grid grid-cols-3 gap-12" style={{ zIndex: 10 }}>
              {/* SOURCES Column */}
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-display font-bold text-white/80 uppercase tracking-wider">Sources</h2>
                  <p className="text-xs text-white/50 mt-1">Agent Data Streams</p>
                </div>
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 rounded-xl transition-all duration-300 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.3))',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                      onClick={() => setActiveStreams(prev => ({ ...prev, [source.id]: !prev[source.id] }))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-white text-sm">{source.name}</h3>
                          <p className="text-xs text-white/60 mt-0.5">{source.desc}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${activeStreams[source.id] ? 'bg-emerald-400' : 'bg-white/30'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROUTES Column */}
              <div>
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-3">
                    <span className="text-xs font-display font-bold text-secondary uppercase tracking-wider">Processing Center</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white/80 uppercase tracking-wider">Routes</h2>
                  <p className="text-xs text-white/50 mt-1">Input Filters & Processing Pipelines</p>
                </div>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="p-6 rounded-2xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(66, 153, 225, 0.25))',
                        border: '2px solid rgba(0, 229, 255, 0.4)',
                        boxShadow: '0 8px 24px rgba(0, 229, 255, 0.2)'
                      }}
                    >
                      <div className="text-center">
                        <span className="text-xs font-display text-secondary/80 uppercase tracking-wider">{route.name}</span>
                        <h3 className="font-display font-bold text-white text-lg mt-2 mb-3">{route.filter}</h3>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/40">
                          <div className="w-2 h-2 rounded-sm bg-secondary" />
                          <span className="text-xs font-display font-semibold text-white">{route.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 text-center">Routes map events to Pipelines and Destinations</p>
                </div>
              </div>

              {/* DESTINATIONS Column */}
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-display font-bold text-white/80 uppercase tracking-wider">Destinations</h2>
                  <p className="text-xs text-white/50 mt-1">Output Endpoints</p>
                </div>
                <div className="space-y-4">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="p-4 rounded-xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.3))',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-white text-sm">{dest.name}</h3>
                        <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                          <span className="text-xs font-display text-blue-300">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 text-center">Post-processing pipelines normalize events to destinations</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-display font-bold gradient-text">{sources.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Sources</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-display font-bold gradient-text">{routes.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Routes</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-display font-bold gradient-text">{destinations.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Destinations</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-display font-bold text-secondary">0.0010</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">USDC/sec</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Flow;
