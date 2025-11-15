import { useState, useCallback, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, TrendingUp, GitBranch, Heart, Shield, Sparkles } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const agents = [
  {
    id: 1,
    name: "Signal Forge",
    category: "SIGNALS",
    description: "Sculpts high-frequency trade entries with adaptive quants.",
    pricePerSec: 0.0002,
    icon: <Activity className="w-6 h-6 text-white" />,
    features: [
      "Multi-timeframe pattern detection",
      "ML-powered signal generation",
      "Risk-adjusted entry/exit points",
      "Backtested strategy metrics"
    ],
  },
  {
    id: 2,
    name: "Volatility Pulse",
    category: "VOLATILITY",
    description: "Detects turbulence spikes across majors & synths.",
    pricePerSec: 0.0002,
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    features: [
      "Real-time VIX tracking",
      "Volatility forecasting models",
      "Cross-market correlation analysis",
      "Historical volatility comparisons"
    ],
  },
  {
    id: 3,
    name: "Arb Navigator",
    category: "ARBITRAGE",
    description: "Plots cross-venue price corridors & neutral legs.",
    pricePerSec: 0.0002,
    icon: <GitBranch className="w-6 h-6 text-white" />,
    features: [
      "Multi-DEX price monitoring",
      "Gas-optimized route finding",
      "Flash loan opportunity detection",
      "Slippage impact calculations"
    ],
  },
  {
    id: 4,
    name: "Sentiment Radar",
    category: "SENTIMENT",
    description: "Scrapes macro narratives & crowd mood vectors.",
    pricePerSec: 0.0002,
    icon: <Heart className="w-6 h-6 text-white" />,
    features: [
      "Multi-platform sentiment aggregation",
      "AI-powered emotion detection",
      "Influencer impact tracking",
      "Trending topic alerts"
    ],
  },
  {
    id: 5,
    name: "Risk Sentinel",
    category: "RISK",
    description: "Scores systemic debt & collateral exposures.",
    pricePerSec: 0.0002,
    icon: <Shield className="w-6 h-6 text-white" />,
    features: [
      "Real-time liquidation risk scoring",
      "Portfolio health monitoring",
      "Collateral ratio tracking",
      "Smart contract risk analysis"
    ],
  },
  {
    id: 6,
    name: "+ Add-on Streams",
    category: "EXTEND",
    description: "Plug in bespoke alpha modules & partner feeds.",
    pricePerSec: 0,
    icon: <Sparkles className="w-6 h-6 text-white" />,
    features: [
      "Partner ecosystem integration",
      "Custom data stream creation",
      "Advanced analytics modules",
      "Enterprise-grade SLAs"
    ],
  },
];

// Custom Agent Node Component
const AgentNode = ({ data }: { data: any }) => {
  const isAddon = data.isAddon || false;
  
  return (
    <div 
      className="relative group pointer-events-auto"
      onClick={isAddon ? data.onToggle : undefined}
      style={{
        cursor: isAddon ? 'pointer' : 'default',
        width: '240px',
        background: isAddon 
          ? 'linear-gradient(135deg, rgba(100, 100, 100, 0.1), rgba(70, 70, 70, 0.15))'
          : 'linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(0, 229, 255, 0.15))',
        border: isAddon
          ? '3px dashed rgba(100, 100, 100, 0.4)'
          : `3px solid ${data.active ? 'rgba(0, 229, 255, 0.8)' : 'rgba(66, 153, 225, 0.4)'}`,
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        boxShadow: data.active 
          ? '0 0 40px rgba(0, 229, 255, 0.4), inset 0 0 30px rgba(0, 229, 255, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        opacity: isAddon ? 0.7 : 1,
      }}
    >
      {/* Connection handle for edges */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: data.active ? '#00E5FF' : '#4299E1',
          width: '12px',
          height: '12px',
          border: '2px solid rgba(0, 0, 0, 0.3)',
          opacity: isAddon ? 0 : 1,
        }}
      />
      {/* Glow effect */}
      {data.active && !isAddon && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.3), rgba(66, 153, 225, 0.3))',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm ${
              isAddon 
                ? 'bg-gradient-to-br from-gray-700/30 to-gray-600/30 border border-gray-600/20'
                : 'bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20'
            }`}>
              <div className={`${isAddon ? 'text-gray-400' : 'text-primary'}`}>
                {data.icon}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className={`text-[10px] font-medium uppercase tracking-wider ${
                isAddon ? 'text-gray-500' : 'text-secondary/70'
              }`}>
                {data.category}
              </span>
              <div className="flex items-center gap-2">
                {!isAddon ? (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    data.active 
                      ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                  }`}>
                    {data.active ? 'ON' : 'OFF'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-700/30 text-gray-500 border border-gray-600/30">
                    ADDON
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isAddon && (
            <label className="relative inline-flex items-center cursor-pointer z-10" onClick={(e) => e.stopPropagation()}>
              <input 
                type="checkbox" 
                checked={data.active} 
                onChange={(e) => {
                  e.stopPropagation();
                  data.onToggle();
                }}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-all pointer-events-auto ${
                data.active ? 'bg-secondary' : 'bg-gray-700'
              }`}>
                <div className={`absolute top-0.5 left-0.5 bg-black rounded-full h-5 w-5 transition-transform ${
                  data.active ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          )}
        </div>
        
        {/* Content */}
        <div className="mb-4">
          <h3 className={`text-lg font-bold mb-2 ${
            isAddon ? 'text-gray-400' : 'text-white'
          }`}>
            {data.name}
          </h3>
          <p className={`text-sm ${
            isAddon ? 'text-gray-500' : 'text-white/70'
          }`}>
            {data.description}
          </p>
        </div>
        
        {/* Price */}
        <div className={`pt-4 border-t ${
          isAddon ? 'border-gray-700/30' : 'border-white/10'
        }`}>
          <p className={`text-xs font-medium ${
            isAddon ? 'text-gray-500' : 'text-white/50'
          }`}>
            {data.price}
          </p>
        </div>
      </div>
    </div>
  );
};

// Custom node component for central hub
const HubNode = ({ data }: any) => (
  <div
    className="rounded-3xl p-8 transition-all duration-500 pointer-events-auto"
    style={{
      width: '400px',
      height: '360px',
      background: data.active
        ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(66, 153, 225, 0.4) 50%, rgba(30, 58, 95, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(66, 153, 225, 0.2) 0%, rgba(30, 58, 95, 0.6) 50%, rgba(30, 58, 95, 0.8) 100%)',
      border: data.active ? '4px solid rgba(0, 229, 255, 0.8)' : '3px solid rgba(66, 153, 225, 0.4)',
      boxShadow: data.active
        ? '0 0 100px rgba(0, 229, 255, 0.6), 0 0 150px rgba(66, 153, 225, 0.4)'
        : '0 0 60px rgba(66, 153, 225, 0.3)',
      backdropFilter: 'blur(24px)',
    }}
  >
    {/* Connection handles for incoming edges */}
    <Handle
      type="target"
      position={Position.Top}
      id="top"
      style={{
        background: data.active ? '#00E5FF' : '#4299E1',
        width: '16px',
        height: '16px',
        border: '3px solid rgba(0, 0, 0, 0.3)',
        top: '-8px',
      }}
    />
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      style={{
        background: data.active ? '#00E5FF' : '#4299E1',
        width: '16px',
        height: '16px',
        border: '3px solid rgba(0, 0, 0, 0.3)',
        left: '-8px',
      }}
    />
    <Handle
      type="target"
      position={Position.Right}
      id="right"
      style={{
        background: data.active ? '#00E5FF' : '#4299E1',
        width: '16px',
        height: '16px',
        border: '3px solid rgba(0, 0, 0, 0.3)',
        right: '-8px',
      }}
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="bottom"
      style={{
        background: data.active ? '#00E5FF' : '#4299E1',
        width: '16px',
        height: '16px',
        border: '3px solid rgba(0, 0, 0, 0.3)',
        bottom: '-8px',
      }}
    />
    {data.active && (
      <div className="absolute inset-0 rounded-3xl border-2 border-secondary/30 animate-ping" style={{ animationDuration: '2s' }} />
    )}
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-secondary" />
        <span className="text-sm font-display text-white/70 tracking-wider uppercase">Active Agents</span>
      </div>
      <div className="text-5xl font-display font-bold text-white mb-3">
        {data.activeCount} <span className="text-white/40">/ 6</span>
      </div>
      <div className="text-xs font-display text-white/60 uppercase tracking-wider mb-2">Cost / Sec</div>
      <div className="text-2xl font-display font-bold gradient-text mb-4">
        {data.totalCost.toFixed(4)} USDC
      </div>
      {data.active && (
        <div className="mb-4">
          <span className="text-xs font-display text-secondary uppercase tracking-wider px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40">
            Balanced
          </span>
        </div>
      )}
      <button
        onClick={data.onToggle}
        className={`w-full py-4 rounded-2xl text-base font-display font-bold tracking-wider transition-all duration-500 ${
          data.active
            ? 'bg-secondary hover:bg-secondary/90 text-black shadow-2xl'
            : 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/30'
        }`}
        style={{
          boxShadow: data.active ? '0 0 60px rgba(0, 229, 255, 0.5)' : 'none',
        }}
      >
        {data.active ? 'CLOSE ALL STREAMS' : 'OPEN ALL STREAMS'}
      </button>
    </div>
  </div>
);

// Define nodeTypes outside component to prevent re-creation on every render
const nodeTypes = {
  agent: AgentNode,
  hub: HubNode,
};

const Streams = () => {
  const [streamStates, setStreamStates] = useState<Record<number, boolean>>({});
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);

  const activeCount = agents.filter(agent => agent.id !== 6 && streamStates[agent.id]).length;
  const totalCostPerSec = agents.filter((agent) => streamStates[agent.id]).reduce((sum, agent) => sum + agent.pricePerSec, 0);
  const allStreamsActive = agents.filter(agent => agent.id !== 6).every(agent => streamStates[agent.id]);

  const handleToggleAll = useCallback(() => {
    setStreamStates((prev) => {
      const currentAllActive = agents.filter(agent => agent.id !== 6).every(agent => prev[agent.id]);
      const newState = !currentAllActive;
      const newStates: Record<number, boolean> = {};
      agents.forEach((agent) => {
        if (agent.id !== 6) {
          newStates[agent.id] = newState;
        }
      });
      console.log('Toggle All - Current:', currentAllActive, 'New State:', newState, 'New States:', newStates);
      return newStates;
    });
  }, []);

  const handleToggleStream = useCallback((agentId: number) => {
    setStreamStates((prev) => {
      const newState = !prev[agentId];
      console.log(`Toggle Agent ${agentId} - Old:`, prev[agentId], 'New:', newState);
      return { ...prev, [agentId]: newState };
    });
  }, []);

  const initialNodes: Node[] = [
    // Top row agents
    { 
      id: 'agent-1', 
      type: 'agent', 
      position: { x: 50, y: 80 },
      draggable: false,
      data: { 
        name: agents[0].name, 
        category: agents[0].category, 
        description: agents[0].description, 
        price: `${agents[0].pricePerSec.toFixed(4)} USDC / SEC`,
        icon: agents[0].icon,
        active: streamStates[1] || false,
        onToggle: () => handleToggleStream(1)
      }
    },
    { 
      id: 'agent-2', 
      type: 'agent', 
      position: { x: 540, y: 30 },
      draggable: false,
      data: { 
        name: agents[1].name, 
        category: agents[1].category, 
        description: agents[1].description, 
        price: `${agents[1].pricePerSec.toFixed(4)} USDC / SEC`,
        icon: agents[1].icon,
        active: streamStates[2] || false,
        onToggle: () => handleToggleStream(2)
      }
    },
    { 
      id: 'agent-3', 
      type: 'agent', 
      position: { x: 1030, y: 80 },
      draggable: false,
      data: { 
        name: agents[2].name, 
        category: agents[2].category, 
        description: agents[2].description, 
        price: `${agents[2].pricePerSec.toFixed(4)} USDC / SEC`,
        icon: agents[2].icon,
        active: streamStates[3] || false,
        onToggle: () => handleToggleStream(3)
      }
    },
    // Bottom row agents
    { 
      id: 'agent-4', 
      type: 'agent', 
      position: { x: 50, y: 680 },
      draggable: false,
      data: { 
        name: agents[3].name, 
        category: agents[3].category, 
        description: agents[3].description, 
        price: `${agents[3].pricePerSec.toFixed(4)} USDC / SEC`,
        icon: agents[3].icon,
        active: streamStates[4] || false,
        onToggle: () => handleToggleStream(4)
      }
    },
    { 
      id: 'agent-5', 
      type: 'agent', 
      position: { x: 540, y: 730 },
      draggable: false,
      data: { 
        name: agents[4].name, 
        category: agents[4].category, 
        description: agents[4].description, 
        price: `${agents[4].pricePerSec.toFixed(4)} USDC / SEC`,
        icon: agents[4].icon,
        active: streamStates[5] || false,
        onToggle: () => handleToggleStream(5)
      }
    },
    { 
      id: 'agent-6', 
      type: 'agent', 
      position: { x: 1030, y: 680 },
      draggable: false,
      data: { 
        name: agents[5].name, 
        category: agents[5].category, 
        description: agents[5].description, 
        price: 'COMING SOON',
        icon: agents[5].icon,
        active: false,
        onToggle: () => setIsAddonModalOpen(true),
        isAddon: true
      }
    },
    // Central hub
    { 
      id: 'hub', 
      type: 'hub', 
      position: { x: 540, y: 360 },
      draggable: false,
      data: { 
        activeCount,
        totalCost: totalCostPerSec,
        active: allStreamsActive,
        onToggle: handleToggleAll
      }
    },
  ];

  const createEdges = useCallback((): Edge[] => [
    { 
      id: 'e1', 
      source: 'agent-1', 
      target: 'hub', 
      animated: streamStates[1] || false, 
      type: 'smoothstep',
      style: { 
        stroke: streamStates[1] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[1] ? 4 : 2,
        filter: streamStates[1] ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' : 'none',
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[1] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
    { 
      id: 'e2', 
      source: 'agent-2', 
      target: 'hub', 
      animated: streamStates[2] || false, 
      type: 'smoothstep',
      style: { 
        stroke: streamStates[2] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[2] ? 4 : 2,
        filter: streamStates[2] ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' : 'none',
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[2] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
    { 
      id: 'e3', 
      source: 'agent-3', 
      target: 'hub', 
      animated: streamStates[3] || false, 
      type: 'smoothstep',
      style: { 
        stroke: streamStates[3] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[3] ? 4 : 2,
        filter: streamStates[3] ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' : 'none',
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[3] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
    { 
      id: 'e4', 
      source: 'agent-4', 
      target: 'hub', 
      animated: streamStates[4] || false, 
      type: 'smoothstep',
      style: { 
        stroke: streamStates[4] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[4] ? 4 : 2,
        filter: streamStates[4] ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' : 'none',
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[4] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
    { 
      id: 'e5', 
      source: 'agent-5', 
      target: 'hub', 
      animated: streamStates[5] || false, 
      type: 'smoothstep',
      style: { 
        stroke: streamStates[5] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[5] ? 4 : 2,
        filter: streamStates[5] ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))' : 'none',
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[5] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
  ], [streamStates]);

  const initialEdges = createEdges();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = () => {};

  // Update everything when streamStates change
  useEffect(() => {
    // Calculate current values from streamStates
    const currentActiveCount = agents.filter(agent => agent.id !== 6 && streamStates[agent.id]).length;
    const currentTotalCost = agents.filter((agent) => streamStates[agent.id]).reduce((sum, agent) => sum + agent.pricePerSec, 0);
    const currentAllActive = agents.filter(agent => agent.id !== 6).every(agent => streamStates[agent.id]);

    // Update nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'hub') {
          return {
            ...node,
            data: {
              ...node.data,
              activeCount: currentActiveCount,
              totalCost: currentTotalCost,
              active: currentAllActive,
              onToggle: handleToggleAll,
            },
          };
        } else if (node.type === 'agent') {
          const agentId = parseInt(node.id.split('-')[1]);
          return {
            ...node,
            data: {
              ...node.data,
              active: streamStates[agentId] || false,
              onToggle: agentId === 6 ? () => setIsAddonModalOpen(true) : () => handleToggleStream(agentId),
            },
          };
        }
        return node;
      })
    );

    // Update edges with createEdges function
    setEdges(createEdges());
  }, [streamStates, handleToggleAll, handleToggleStream, createEdges]);

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
              <span className="text-xs font-display font-bold text-secondary uppercase tracking-wider">Live Intelligence Dashboard</span>
            </div>
            <h1 className="text-5xl font-display font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #4299E1 50%, #00E5FF 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite'
            }}>
              Streaming Agent Matrix
            </h1>
            <p className="text-white/60 font-display text-lg max-w-2xl mx-auto">
              Real-time data streams flowing through autonomous intelligence agents
            </p>
          </div>

          {/* ReactFlow Container */}
          <div 
            className="rounded-3xl relative"
            style={{
              height: '900px',
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
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              fitView
              fitViewOptions={{ padding: 0.1, minZoom: 0.8, maxZoom: 1 }}
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
        </div>
      </section>

      {/* Add-on Streams Configuration Modal */}
      <Dialog open={isAddonModalOpen} onOpenChange={setIsAddonModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold gradient-text flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-secondary" />
              Add-on Streams Configuration
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Customize and integrate additional data streams from our partner ecosystem
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Partner Integration Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white uppercase tracking-wider">Partner Integrations</Label>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-xl border-2 border-primary/30 hover:border-secondary/60 bg-primary/5 hover:bg-secondary/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Chainlink</p>
                      <p className="text-xs text-white/50">Price Feeds</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 rounded-xl border-2 border-primary/30 hover:border-secondary/60 bg-primary/5 hover:bg-secondary/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-teal-500/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">The Graph</p>
                      <p className="text-xs text-white/50">On-chain Data</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 rounded-xl border-2 border-primary/30 hover:border-secondary/60 bg-primary/5 hover:bg-secondary/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Pyth Network</p>
                      <p className="text-xs text-white/50">Real-time Prices</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 rounded-xl border-2 border-primary/30 hover:border-secondary/60 bg-primary/5 hover:bg-secondary/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">LunarCrush</p>
                      <p className="text-xs text-white/50">Social Metrics</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Stream Configuration */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white uppercase tracking-wider">Custom Stream Configuration</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="stream-name" className="text-xs text-white/60">Stream Name</Label>
                  <Input 
                    id="stream-name" 
                    placeholder="e.g., Custom DEX Aggregator"
                    className="bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus:border-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="api-endpoint" className="text-xs text-white/60">API Endpoint</Label>
                  <Input 
                    id="api-endpoint" 
                    placeholder="https://api.example.com/v1/data"
                    className="bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus:border-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="api-key" className="text-xs text-white/60">API Key (Optional)</Label>
                  <Input 
                    id="api-key" 
                    type="password"
                    placeholder="Enter your API key"
                    className="bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus:border-secondary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="refresh-rate" className="text-xs text-white/60">Refresh Rate (sec)</Label>
                    <Input 
                      id="refresh-rate" 
                      type="number"
                      defaultValue="5"
                      className="bg-black/40 border-primary/30 text-white focus:border-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost" className="text-xs text-white/60">Cost per Second (USDC)</Label>
                    <Input 
                      id="cost" 
                      type="number"
                      step="0.0001"
                      defaultValue="0.0003"
                      className="bg-black/40 border-primary/30 text-white focus:border-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddonModalOpen(false)}
                className="flex-1 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // TODO: Handle stream configuration save
                  setIsAddonModalOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-secondary to-primary text-black font-bold hover:opacity-90 border-0"
              >
                Add Stream
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Streams;
