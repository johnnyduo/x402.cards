import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";
import { Activity, TrendingUp, GitBranch, Heart, Shield, Database, Bell, Globe, Layers } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Source Node
const SourceNode = ({ data }: { data: any }) => {
  const Icon = data.icon;
  return (
    <div className="pointer-events-auto" style={{
      width: '220px',
      background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(16, 185, 129, 0.2))',
      border: '3px solid rgba(52, 211, 153, 0.6)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(52, 211, 153, 0.3)',
      transition: 'all 0.3s ease',
    }}>
      <Handle type="source" position={Position.Right} style={{ background: '#00E5FF', width: '12px', height: '12px', border: '2px solid #00E5FF', zIndex: 1000 }} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center border border-green-400/30">
            {data.icon}
          </div>
          <div>
            <div className="text-[9px] text-green-300/70 uppercase tracking-wider font-semibold">SOURCE</div>
            <div className="text-xs text-green-400 font-bold">ACTIVE</div>
          </div>
        </div>
        <h3 className="text-base font-bold text-white mb-2">{data.name}</h3>
        <p className="text-xs text-white/60">{data.description}</p>
      </div>
    </div>
  );
};

// Custom Route Node
const RouteNode = ({ data }: { data: any }) => {
  return (
    <div className="pointer-events-auto" style={{
      width: '240px',
      background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(66, 153, 225, 0.2))',
      border: '3px solid rgba(0, 229, 255, 0.7)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 40px rgba(0, 229, 255, 0.4)',
      transition: 'all 0.3s ease',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#00E5FF', width: '12px', height: '12px', border: '2px solid #00E5FF', zIndex: 1000 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#00E5FF', width: '12px', height: '12px', border: '2px solid #00E5FF', zIndex: 1000 }} />
      <div className="p-6 text-center">
        <div className="text-[10px] text-secondary/80 uppercase tracking-wider font-bold mb-2">{data.label}</div>
        <h3 className="text-lg font-bold text-white mb-2">{data.name}</h3>
        <div className="inline-block px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40">
          <span className="text-xs font-bold text-secondary">{data.type}</span>
        </div>
        <div className="mt-3 text-xs text-white/50">{data.description}</div>
      </div>
    </div>
  );
};

// Custom Destination Node
const DestNode = ({ data }: { data: any }) => {
  const Icon = data.icon;
  return (
    <div className="pointer-events-auto" style={{
      width: '220px',
      background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(59, 130, 246, 0.2))',
      border: '3px solid rgba(96, 165, 250, 0.6)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(96, 165, 250, 0.3)',
      transition: 'all 0.3s ease',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#00E5FF', width: '12px', height: '12px', border: '2px solid #00E5FF', zIndex: 1000 }} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-400/30">
            {data.icon}
          </div>
          <div>
            <div className="text-[9px] text-blue-300/70 uppercase tracking-wider font-semibold">DESTINATION</div>
            <div className="text-xs text-blue-400 font-bold">READY</div>
          </div>
        </div>
        <h3 className="text-base font-bold text-white mb-2">{data.name}</h3>
        <p className="text-xs text-white/60">{data.description}</p>
      </div>
    </div>
  );
};

const nodeTypes = {
  source: SourceNode,
  route: RouteNode,
  destination: DestNode,
};

const initialNodes: Node[] = [
  // Sources
  { 
    id: 'source-1', 
    type: 'source', 
    position: { x: 50, y: 50 }, 
    data: { 
      name: 'Signal Forge',
      description: 'Market signals & opportunities',
      icon: <Activity className="w-5 h-5 text-green-400" />
    },
    draggable: false
  },
  { 
    id: 'source-2', 
    type: 'source', 
    position: { x: 50, y: 180 }, 
    data: { 
      name: 'Volatility Pulse',
      description: 'Real-time volatility tracking',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />
    },
    draggable: false
  },
  { 
    id: 'source-3', 
    type: 'source', 
    position: { x: 50, y: 310 }, 
    data: { 
      name: 'Arb Navigator',
      description: 'Cross-exchange arbitrage',
      icon: <GitBranch className="w-5 h-5 text-green-400" />
    },
    draggable: false
  },
  { 
    id: 'source-4', 
    type: 'source', 
    position: { x: 50, y: 440 }, 
    data: { 
      name: 'Sentiment Radar',
      description: 'Social sentiment analysis',
      icon: <Heart className="w-5 h-5 text-green-400" />
    },
    draggable: false
  },
  { 
    id: 'source-5', 
    type: 'source', 
    position: { x: 50, y: 570 }, 
    data: { 
      name: 'Risk Sentinel',
      description: 'Portfolio risk monitoring',
      icon: <Shield className="w-5 h-5 text-green-400" />
    },
    draggable: false
  },
  
  // Routes
  { 
    id: 'route-1', 
    type: 'route', 
    position: { x: 350, y: 60 }, 
    data: { 
      label: 'ROUTE 1',
      name: 'Signal Filter',
      type: '🔹 Pipeline',
      description: 'High-value signals only'
    },
    draggable: false
  },
  { 
    id: 'route-2', 
    type: 'route', 
    position: { x: 350, y: 200 }, 
    data: { 
      label: 'ROUTE 2',
      name: 'Volatility Filter',
      type: '📦 Pack',
      description: 'Batched volatility data'
    },
    draggable: false
  },
  { 
    id: 'route-3', 
    type: 'route', 
    position: { x: 350, y: 340 }, 
    data: { 
      label: 'ROUTE 3',
      name: 'Arb Filter',
      type: '🔹 Pipeline',
      description: 'Profitable arb opportunities'
    },
    draggable: false
  },
  { 
    id: 'route-4', 
    type: 'route', 
    position: { x: 350, y: 480 }, 
    data: { 
      label: 'ROUTE 4',
      name: 'Multi-Source',
      type: '📦 Pack',
      description: 'Aggregated sentiment & risk'
    },
    draggable: false
  },
  
  // Destinations
  { 
    id: 'dest-1', 
    type: 'destination', 
    position: { x: 670, y: 80 }, 
    data: { 
      name: 'Live Dashboard',
      description: 'Real-time visualization',
      icon: <Layers className="w-5 h-5 text-blue-400" />
    },
    draggable: false
  },
  { 
    id: 'dest-2', 
    type: 'destination', 
    position: { x: 670, y: 210 }, 
    data: { 
      name: 'Alert System',
      description: 'Instant notifications',
      icon: <Bell className="w-5 h-5 text-blue-400" />
    },
    draggable: false
  },
  { 
    id: 'dest-3', 
    type: 'destination', 
    position: { x: 670, y: 340 }, 
    data: { 
      name: 'Data Lake',
      description: 'Historical storage',
      icon: <Database className="w-5 h-5 text-blue-400" />
    },
    draggable: false
  },
  { 
    id: 'dest-4', 
    type: 'destination', 
    position: { x: 670, y: 470 }, 
    data: { 
      name: 'API Gateway',
      description: 'External integrations',
      icon: <Globe className="w-5 h-5 text-blue-400" />
    },
    draggable: false
  },
];

const initialEdges: Edge[] = [
  // Sources to Routes - Match Streams sizing
  { id: 'e1-1', source: 'source-1', target: 'route-1', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'e2-2', source: 'source-2', target: 'route-2', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'e3-3', source: 'source-3', target: 'route-3', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'e4-4', source: 'source-4', target: 'route-4', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'e5-3', source: 'source-5', target: 'route-3', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  
  // Routes to Destinations - Match Streams sizing
  { id: 'er1-d1', source: 'route-1', target: 'dest-1', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er1-d2', source: 'route-1', target: 'dest-2', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er2-d2', source: 'route-2', target: 'dest-2', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er2-d3', source: 'route-2', target: 'dest-3', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er3-d3', source: 'route-3', target: 'dest-3', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er3-d4', source: 'route-3', target: 'dest-4', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
  { id: 'er4-d4', source: 'route-4', target: 'dest-4', animated: true, type: 'smoothstep', style: { stroke: '#00E5FF', strokeWidth: 4, filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF', width: 20, height: 20 } },
];

const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <AppHeader />

      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-secondary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <section className="px-4 md:px-6 pb-20 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 px-6 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <span className="text-xs font-display font-bold text-secondary uppercase tracking-wider">Pipeline Architecture</span>
            </div>
            <h1 className="text-5xl font-display font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #4299E1 50%, #00E5FF 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite'
            }}>
              Stream Flow Architecture
            </h1>
            <p className="text-white/60 font-display text-lg max-w-2xl mx-auto">
              Real-time data pipeline visualization showing intelligent routing and processing
            </p>
          </div>

          {/* ReactFlow Container */}
          <div 
            className="rounded-3xl relative"
            style={{
              height: '800px',
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, rgba(30, 58, 95, 0.3) 40%, rgba(17, 24, 39, 0.9) 100%)',
              backdropFilter: 'blur(24px)',
              border: '2px solid rgba(0, 229, 255, 0.2)',
              boxShadow: '0 30px 80px rgba(0, 229, 255, 0.15), inset 0 0 60px rgba(0, 229, 255, 0.05)',
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              fitView
              fitViewOptions={{ padding: 0.1, minZoom: 0.8, maxZoom: 1.2 }}
              proOptions={{ hideAttribution: true }}
              style={{
                background: 'transparent',
              }}
            >
              <Background 
                color="rgba(0, 229, 255, 0.08)" 
                gap={24} 
                size={1.5}
                style={{ opacity: 0.5 }}
              />
              <Controls 
                style={{
                  background: 'rgba(17, 24, 39, 0.9)',
                  border: '2px solid rgba(0, 229, 255, 0.3)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </ReactFlow>
          </div>

          {/* Pipeline Stats */}
          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl glass-strong border-2 border-primary/20 text-center relative overflow-hidden group hover:border-secondary/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl font-display font-bold gradient-text mb-1">5</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Active Sources</div>
                <div className="text-[10px] text-secondary/70 mt-1">Streaming Live</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl glass-strong border-2 border-primary/20 text-center relative overflow-hidden group hover:border-secondary/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl font-display font-bold gradient-text mb-1">4</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Pipeline Routes</div>
                <div className="text-[10px] text-secondary/70 mt-1">Processing</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl glass-strong border-2 border-primary/20 text-center relative overflow-hidden group hover:border-secondary/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl font-display font-bold gradient-text mb-1">4</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Destinations</div>
                <div className="text-[10px] text-secondary/70 mt-1">Connected</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl glass-strong border-2 border-secondary/30 text-center relative overflow-hidden group hover:border-secondary/60 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl font-display font-bold text-secondary mb-1">0.0010</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Total Cost</div>
                <div className="text-[10px] text-secondary/90 mt-1">USDC / Second</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Flow;
