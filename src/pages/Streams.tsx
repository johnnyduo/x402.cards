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
    name: "AI Crawler Service",
    category: "REVENUE",
    description: "Deploy AI crawlers to earn passive income from data collection.",
    pricePerSec: 0.0003,
    icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
    features: [
      "Automated web data collection",
      "Real-time content indexing",
      "API monetization streams",
      "Earn 0.0003 USDC/sec per crawler"
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
          ? data.active
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.2))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.12))'
          : 'linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(0, 229, 255, 0.15))',
        border: isAddon
          ? `3px solid ${data.active ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.4)'}`
          : `3px solid ${data.active ? 'rgba(0, 229, 255, 0.8)' : 'rgba(66, 153, 225, 0.4)'}`,
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        boxShadow: data.active 
          ? isAddon
            ? '0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(16, 185, 129, 0.1)'
            : '0 0 40px rgba(0, 229, 255, 0.4), inset 0 0 30px rgba(0, 229, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        opacity: 1,
        zIndex: 100,
        position: 'relative',
      }}
    >
      {/* Connection handle for edges */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: data.active ? (isAddon ? '#10B981' : '#00E5FF') : (isAddon ? '#059669' : '#4299E1'),
          width: '12px',
          height: '12px',
          border: '2px solid rgba(0, 0, 0, 0.3)',
          opacity: 1,
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
                isAddon ? 'text-emerald-400/70' : 'text-secondary/70'
              }`}>
                {data.category}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isAddon
                    ? data.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-900/30 text-emerald-600 border border-emerald-800/30'
                    : data.active 
                      ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                }`}>
                  {data.active ? 'ON' : 'OFF'}
                </span>
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
          {isAddon && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  data.onSettings?.();
                }}
                className="w-9 h-9 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-center cursor-pointer transition-all"
                style={{ zIndex: 300, pointerEvents: 'auto' }}
                title="Configure AI Crawler"
              >
                <span className="text-emerald-400 text-base">⚙️</span>
              </button>
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
                  data.active ? 'bg-emerald-500' : 'bg-gray-700'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 bg-black rounded-full h-5 w-5 transition-transform ${
                    data.active ? 'translate-x-5' : ''
                  }`} />
                </div>
              </label>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="mb-4">
          <h3 className={`text-lg font-bold mb-2 ${
            isAddon ? (data.active ? 'text-emerald-400' : 'text-emerald-600') : 'text-white'
          }`}>
            {data.name}
          </h3>
          <p className={`text-sm ${
            isAddon ? (data.active ? 'text-emerald-400/70' : 'text-emerald-600/60') : 'text-white/70'
          }`}>
            {data.description}
          </p>
        </div>
        
        {/* Price & Accumulated */}
        <div className={`pt-4 border-t ${
          isAddon ? 'border-emerald-700/30' : 'border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs font-medium ${
              isAddon ? 'text-emerald-400/60' : 'text-white/50'
            }`}>
              {isAddon ? 'Revenue' : 'Cost'} / SEC
            </p>
            <p className={`text-xs font-bold ${
              isAddon ? 'text-emerald-400' : 'text-secondary'
            }`}>
              {isAddon ? '+' : ''}{data.pricePerSec.toFixed(4)} USDC
            </p>
          </div>
          {data.active && (
            <div className="mt-2 p-2 rounded-lg bg-black/30">
              <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${
                isAddon ? 'text-emerald-400/50' : 'text-white/40'
              }`}>
                {isAddon ? 'Total Earned' : 'Total Spent'}
              </p>
              <p className={`text-sm font-bold font-mono ${
                isAddon ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isAddon ? '+' : ''}{(data.accumulated || 0).toFixed(4)} USDC
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom node component for central hub
const HubNode = ({ data }: any) => (
  <div
    className="rounded-3xl p-8 transition-all duration-500"
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
      zIndex: 200,
      position: 'relative',
      pointerEvents: 'auto',
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
      <div className="flex items-center justify-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-secondary" />
        <span className="text-xs font-display text-white/70 tracking-wider uppercase">Active Agents</span>
      </div>
      <div className="text-4xl font-display font-bold text-white mb-2">
        {data.activeCount} <span className="text-white/40">/ 6</span>
      </div>
      <div className="text-[10px] font-display text-white/60 uppercase tracking-wider mb-1">
        {data.revenueActive ? 'Net Rate / Sec' : 'Cost / Sec'}
      </div>
      <div className={`text-xl font-display font-bold mb-3 ${
        data.revenueActive && data.netRate < 0 ? 'text-emerald-400' : 'gradient-text'
      }`}>
        {data.revenueActive && data.netRate < 0 ? '+' : ''}{Math.abs(data.netRate || data.totalCost).toFixed(4)} USDC
      </div>
      
      {/* Financial Summary */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
          <div className="text-[9px] text-red-400/60 uppercase tracking-wider">Spending</div>
          <div className="text-xs font-bold text-red-400">-{data.totalSpent?.toFixed(4) || '0.0000'}</div>
        </div>
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1">
          <div className="text-[9px] text-emerald-400/60 uppercase tracking-wider">Earning</div>
          <div className="text-xs font-bold text-emerald-400">+{data.totalEarned?.toFixed(4) || '0.0000'}</div>
        </div>
        <div className={`flex items-center justify-between border-2 rounded-lg px-2 py-1.5 ${
          ((data.totalEarned || 0) - (data.totalSpent || 0)) >= 0
            ? 'bg-emerald-500/20 border-emerald-500/50'
            : 'bg-red-500/20 border-red-500/50'
        }`}>
          <div className="text-[9px] text-white/70 uppercase tracking-wider font-bold">Net Balance</div>
          <div className={`text-sm font-bold ${
            ((data.totalEarned || 0) - (data.totalSpent || 0)) >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {((data.totalEarned || 0) - (data.totalSpent || 0)) >= 0 ? '+' : ''}{((data.totalEarned || 0) - (data.totalSpent || 0)).toFixed(4)}
          </div>
        </div>
      </div>
      
      <button
        onClick={data.onToggle}
        className={`w-full py-3 rounded-xl text-sm font-display font-bold tracking-wider transition-all duration-500 ${
          data.active
            ? 'bg-secondary hover:bg-secondary/90 text-black shadow-2xl'
            : 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/30'
        }`}
        style={{
          boxShadow: data.active ? '0 0 60px rgba(0, 229, 255, 0.5)' : 'none',
          pointerEvents: 'auto',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 300,
        }}
      >
        {data.active ? 'CLOSE ALL' : 'OPEN ALL'}
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
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [agentAccumulated, setAgentAccumulated] = useState<Record<number, number>>({});

  const activeCount = agents.filter(agent => streamStates[agent.id]).length;
  const totalCostPerSec = agents.filter((agent) => agent.id !== 6 && streamStates[agent.id]).reduce((sum, agent) => sum + agent.pricePerSec, 0);
  const addonRevenue = streamStates[6] ? 0.0003 : 0; // AI Crawler generates revenue
  const netRatePerSec = totalCostPerSec - addonRevenue; // Net rate after revenue
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

  // Real-time spending/earning tracker
  useEffect(() => {
    const interval = setInterval(() => {
      if (totalCostPerSec > 0) {
        setTotalSpent(prev => prev + totalCostPerSec);
      }
      if (addonRevenue > 0) {
        setTotalEarned(prev => prev + addonRevenue);
      }
      
      // Update individual agent accumulated amounts
      setAgentAccumulated(prev => {
        const newAccumulated = { ...prev };
        agents.forEach(agent => {
          if (streamStates[agent.id]) {
            const rate = agent.pricePerSec;
            newAccumulated[agent.id] = (newAccumulated[agent.id] || 0) + rate;
          }
        });
        return newAccumulated;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [totalCostPerSec, addonRevenue, streamStates]);

  const initialNodes: Node[] = [
    // Top row agents
    { 
      id: 'agent-1', 
      type: 'agent', 
      position: { x: 30, y: 60 },
      draggable: true,
      data: { 
        name: agents[0].name, 
        category: agents[0].category, 
        description: agents[0].description, 
        pricePerSec: agents[0].pricePerSec,
        icon: agents[0].icon,
        active: streamStates[1] || false,
        onToggle: () => handleToggleStream(1),
        accumulated: 0,
      }
    },
    { 
      id: 'agent-2', 
      type: 'agent', 
      position: { x: 540, y: 20 },
      draggable: true,
      data: { 
        name: agents[1].name, 
        category: agents[1].category, 
        description: agents[1].description, 
        pricePerSec: agents[1].pricePerSec,
        icon: agents[1].icon,
        active: streamStates[2] || false,
        onToggle: () => handleToggleStream(2),
        accumulated: 0,
      }
    },
    { 
      id: 'agent-3', 
      type: 'agent', 
      position: { x: 1050, y: 60 },
      draggable: true,
      data: { 
        name: agents[2].name, 
        category: agents[2].category, 
        description: agents[2].description, 
        pricePerSec: agents[2].pricePerSec,
        icon: agents[2].icon,
        active: streamStates[3] || false,
        onToggle: () => handleToggleStream(3),
        accumulated: 0,
      }
    },
    // Bottom row agents
    { 
      id: 'agent-4', 
      type: 'agent', 
      position: { x: 30, y: 700 },
      draggable: true,
      data: { 
        name: agents[3].name, 
        category: agents[3].category, 
        description: agents[3].description, 
        pricePerSec: agents[3].pricePerSec,
        icon: agents[3].icon,
        active: streamStates[4] || false,
        onToggle: () => handleToggleStream(4),
        accumulated: 0,
      }
    },
    { 
      id: 'agent-5', 
      type: 'agent', 
      position: { x: 540, y: 750 },
      draggable: true,
      data: { 
        name: agents[4].name, 
        category: agents[4].category, 
        description: agents[4].description, 
        pricePerSec: agents[4].pricePerSec,
        icon: agents[4].icon,
        active: streamStates[5] || false,
        onToggle: () => handleToggleStream(5),
        accumulated: 0,
      }
    },
    { 
      id: 'agent-6', 
      type: 'agent', 
      position: { x: 1050, y: 700 },
      draggable: true,
      data: { 
        name: agents[5].name, 
        category: agents[5].category, 
        description: agents[5].description, 
        pricePerSec: agents[5].pricePerSec,
        icon: agents[5].icon,
        active: streamStates[6] || false,
        onToggle: () => handleToggleStream(6),
        onSettings: () => setIsAddonModalOpen(true),
        isAddon: true,
        accumulated: 0,
      }
    },
    // Central hub
    { 
      id: 'hub', 
      type: 'hub', 
      position: { x: 560, y: 365 },
      draggable: true,
      data: { 
        activeCount,
        totalCost: totalCostPerSec,
        netRate: netRatePerSec,
        revenueActive: streamStates[6],
        active: allStreamsActive,
        onToggle: handleToggleAll,
        totalSpent,
        totalEarned,
      },
      style: { zIndex: 200 }
    },
  ];

  const createEdges = useCallback((): Edge[] => [
    { 
      id: 'e1', 
      source: 'agent-1', 
      target: 'hub', 
      sourceHandle: null,
      targetHandle: 'left',
      animated: streamStates[1] || false, 
      type: 'smoothstep',
      className: streamStates[1] ? 'animated-edge-glow' : '',
      style: { 
        stroke: streamStates[1] ? 'url(#edge-gradient-1)' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[1] ? 4 : 1.5,
        filter: streamStates[1] ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))' : 'none',
        opacity: streamStates[1] ? 1 : 0.6,
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
      sourceHandle: null,
      targetHandle: 'top',
      animated: streamStates[2] || false, 
      type: 'smoothstep',
      className: streamStates[2] ? 'animated-edge-glow' : '',
      style: { 
        stroke: streamStates[2] ? 'url(#edge-gradient-2)' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[2] ? 4 : 1.5,
        filter: streamStates[2] ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))' : 'none',
        opacity: streamStates[2] ? 1 : 0.6,
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
      sourceHandle: null,
      targetHandle: 'right',
      animated: streamStates[3] || false, 
      type: 'smoothstep',
      className: streamStates[3] ? 'animated-edge-glow' : '',
      style: { 
        stroke: streamStates[3] ? 'url(#edge-gradient-3)' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[3] ? 4 : 1.5,
        filter: streamStates[3] ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))' : 'none',
        opacity: streamStates[3] ? 1 : 0.6,
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
      sourceHandle: null,
      targetHandle: 'left',
      animated: streamStates[4] || false, 
      type: 'smoothstep',
      className: streamStates[4] ? 'animated-edge-glow' : '',
      style: { 
        stroke: streamStates[4] ? 'url(#edge-gradient-4)' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[4] ? 4 : 1.5,
        filter: streamStates[4] ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))' : 'none',
        opacity: streamStates[4] ? 1 : 0.6,
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
      sourceHandle: null,
      targetHandle: 'bottom',
      animated: streamStates[5] || false, 
      type: 'smoothstep',
      className: streamStates[5] ? 'animated-edge-glow' : '',
      style: { 
        stroke: streamStates[5] ? 'url(#edge-gradient-5)' : 'rgba(66, 153, 225, 0.4)', 
        strokeWidth: streamStates[5] ? 4 : 1.5,
        filter: streamStates[5] ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))' : 'none',
        opacity: streamStates[5] ? 1 : 0.6,
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[5] ? '#00E5FF' : 'rgba(66, 153, 225, 0.4)',
        width: 20,
        height: 20,
      } 
    },
    { 
      id: 'e6', 
      source: 'agent-6', 
      target: 'hub', 
      sourceHandle: null,
      targetHandle: 'right',
      animated: streamStates[6] || false, 
      type: 'smoothstep',
      className: streamStates[6] ? 'animated-edge-glow-green' : '',
      style: { 
        stroke: streamStates[6] ? 'url(#edge-gradient-6)' : 'rgba(16, 185, 129, 0.4)', 
        strokeWidth: streamStates[6] ? 4 : 1.5,
        filter: streamStates[6] ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))' : 'none',
        opacity: streamStates[6] ? 1 : 0.6,
      }, 
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: streamStates[6] ? '#10B981' : 'rgba(16, 185, 129, 0.4)',
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
    const currentActiveCount = agents.filter(agent => streamStates[agent.id]).length;
    const currentTotalCost = agents.filter((agent) => agent.id !== 6 && streamStates[agent.id]).reduce((sum, agent) => sum + agent.pricePerSec, 0);
    const currentRevenue = streamStates[6] ? 0.0003 : 0;
    const currentNetRate = currentTotalCost - currentRevenue;
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
              netRate: currentNetRate,
              revenueActive: streamStates[6],
              active: currentAllActive,
              onToggle: handleToggleAll,
              totalSpent,
              totalEarned,
            },
          };
        } else if (node.type === 'agent') {
          const agentId = parseInt(node.id.split('-')[1]);
          return {
            ...node,
            data: {
              ...node.data,
              active: streamStates[agentId] || false,
              onToggle: () => handleToggleStream(agentId),
              onSettings: agentId === 6 ? () => setIsAddonModalOpen(true) : undefined,
              accumulated: agentAccumulated[agentId] || 0,
            },
          };
        }
        return node;
      })
    );

    // Update edges with createEdges function
    setEdges(createEdges());
  }, [streamStates, handleToggleAll, handleToggleStream, createEdges, totalSpent, totalEarned, agentAccumulated]);

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
              elevateNodesOnSelect={false}
            >
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <linearGradient key={i} id={`edge-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3">
                        <animate attributeName="stop-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#00E5FF" stopOpacity="1">
                        <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#4299E1" stopOpacity="0.3">
                        <animate attributeName="stop-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                      </stop>
                    </linearGradient>
                  ))}
                  <linearGradient id="edge-gradient-6" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3">
                      <animate attributeName="stop-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#10B981" stopOpacity="1">
                      <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.3">
                      <animate attributeName="stop-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    </stop>
                  </linearGradient>
                </defs>
              </svg>
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

      {/* AI Crawler Configuration Modal */}
      <Dialog open={isAddonModalOpen} onOpenChange={setIsAddonModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-emerald-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold flex items-center gap-3" style={{
              background: 'linear-gradient(90deg, #10B981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              <Sparkles className="w-6 h-6 text-emerald-400" />
              AI Crawler Service Configuration
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Deploy autonomous AI crawlers to collect and monetize web data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Crawler Stats Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Revenue Statistics</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-xs text-emerald-400/60 mb-1">Active Crawlers</div>
                  <div className="text-2xl font-bold text-emerald-400">1</div>
                </div>
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-xs text-emerald-400/60 mb-1">Revenue/Sec</div>
                  <div className="text-2xl font-bold text-emerald-400">0.0003</div>
                </div>
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-xs text-emerald-400/60 mb-1">Total Earned</div>
                  <div className="text-2xl font-bold text-emerald-400">{totalEarned.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Crawler Configuration */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Crawler Targets</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="target-url" className="text-xs text-emerald-400/60">Target URL</Label>
                  <Input 
                    id="target-url" 
                    placeholder="https://example.com"
                    className="bg-black/40 border-emerald-500/30 text-white placeholder:text-white/30 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <Label htmlFor="crawl-depth" className="text-xs text-emerald-400/60">Crawl Depth</Label>
                  <Input 
                    id="crawl-depth" 
                    type="number"
                    defaultValue="3"
                    className="bg-black/40 border-emerald-500/30 text-white focus:border-emerald-400"
                  />
                </div>
                <div>
                  <Label htmlFor="data-types" className="text-xs text-emerald-400/60">Data Types to Collect</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Text Content', 'Images', 'Links', 'Metadata', 'Structured Data', 'Media Files'].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-2 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all">
                        <input type="checkbox" className="rounded border-emerald-500/30" defaultChecked={type === 'Text Content'} />
                        <span className="text-xs text-white/70">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="update-frequency" className="text-xs text-emerald-400/60">Update Frequency</Label>
                    <Input 
                      id="update-frequency" 
                      type="number"
                      defaultValue="60"
                      placeholder="Minutes"
                      className="bg-black/40 border-emerald-500/30 text-white focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-pages" className="text-xs text-emerald-400/60">Max Pages</Label>
                    <Input 
                      id="max-pages" 
                      type="number"
                      defaultValue="100"
                      className="bg-black/40 border-emerald-500/30 text-white focus:border-emerald-400"
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
                  handleToggleStream(6); // Activate AI Crawler stream
                  setIsAddonModalOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold hover:opacity-90 border-0"
              >
                Deploy Crawler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Streams;
