import { useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { AppHeader } from "@/components/AppHeader";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  // Sources
  { id: 'source-1', type: 'default', position: { x: 50, y: 50 }, data: { label: '🎯 Signal Forge' }, style: { background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.4))', border: '2px solid rgba(52, 211, 153, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'source-2', type: 'default', position: { x: 50, y: 150 }, data: { label: '📊 Volatility Pulse' }, style: { background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.4))', border: '2px solid rgba(52, 211, 153, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'source-3', type: 'default', position: { x: 50, y: 250 }, data: { label: '🔀 Arb Navigator' }, style: { background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.4))', border: '2px solid rgba(52, 211, 153, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'source-4', type: 'default', position: { x: 50, y: 350 }, data: { label: '❤️ Sentiment Radar' }, style: { background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.4))', border: '2px solid rgba(52, 211, 153, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'source-5', type: 'default', position: { x: 50, y: 450 }, data: { label: '🛡️ Risk Sentinel' }, style: { background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.4))', border: '2px solid rgba(52, 211, 153, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  
  // Routes
  { id: 'route-1', type: 'default', position: { x: 400, y: 50 }, data: { label: 'ROUTE 1\nSignal Filter\n🔹 Pipeline' }, style: { background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(66, 153, 225, 0.3))', border: '3px solid rgba(0, 229, 255, 0.6)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '14px', fontWeight: '700', textAlign: 'center', minWidth: '180px' } },
  { id: 'route-2', type: 'default', position: { x: 400, y: 180 }, data: { label: 'ROUTE 2\nVolatility Filter\n📦 Pack' }, style: { background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(66, 153, 225, 0.3))', border: '3px solid rgba(0, 229, 255, 0.6)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '14px', fontWeight: '700', textAlign: 'center', minWidth: '180px' } },
  { id: 'route-3', type: 'default', position: { x: 400, y: 310 }, data: { label: 'ROUTE 3\nArb Filter\n🔹 Pipeline' }, style: { background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(66, 153, 225, 0.3))', border: '3px solid rgba(0, 229, 255, 0.6)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '14px', fontWeight: '700', textAlign: 'center', minWidth: '180px' } },
  { id: 'route-4', type: 'default', position: { x: 400, y: 440 }, data: { label: 'ROUTE 4\nSentiment Filter\n📦 Pack' }, style: { background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(66, 153, 225, 0.3))', border: '3px solid rgba(0, 229, 255, 0.6)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '14px', fontWeight: '700', textAlign: 'center', minWidth: '180px' } },
  
  // Destinations
  { id: 'dest-1', type: 'output', position: { x: 750, y: 80 }, data: { label: '📊 Live Dashboard' }, style: { background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.4))', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'dest-2', type: 'output', position: { x: 750, y: 200 }, data: { label: '🔔 Alert System' }, style: { background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.4))', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'dest-3', type: 'output', position: { x: 750, y: 320 }, data: { label: '💾 Data Lake' }, style: { background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.4))', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
  { id: 'dest-4', type: 'output', position: { x: 750, y: 440 }, data: { label: '🌐 API Gateway' }, style: { background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.4))', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600' } },
];

const initialEdges: Edge[] = [
  // Sources to Routes
  { id: 'e1-1', source: 'source-1', target: 'route-1', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'e2-2', source: 'source-2', target: 'route-2', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'e3-3', source: 'source-3', target: 'route-3', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'e4-4', source: 'source-4', target: 'route-4', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'e5-3', source: 'source-5', target: 'route-3', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.6)' } },
  
  // Routes to Destinations
  { id: 'er1-d1', source: 'route-1', target: 'dest-1', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er1-d2', source: 'route-1', target: 'dest-2', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.5)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er2-d2', source: 'route-2', target: 'dest-2', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er2-d3', source: 'route-2', target: 'dest-3', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.5)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er3-d3', source: 'route-3', target: 'dest-3', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er3-d4', source: 'route-3', target: 'dest-4', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.5)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
  { id: 'er4-d4', source: 'route-4', target: 'dest-4', animated: true, style: { stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(0, 229, 255, 0.8)' } },
];

const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(() => {}, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <AppHeader />

      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold gradient-text mb-2">Stream Flow Architecture</h1>
            <p className="text-white/60 font-display">Data pipeline visualization for x402 streaming intelligence</p>
          </div>

          <div 
            className="rounded-3xl relative"
            style={{
              height: '700px',
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 153, 225, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              style={{
                background: 'transparent',
              }}
            >
              <Background 
                color="rgba(66, 153, 225, 0.1)" 
                gap={20} 
                size={1}
              />
              <Controls 
                style={{
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(66, 153, 225, 0.2)',
                  borderRadius: '12px',
                }}
              />
              <MiniMap 
                style={{
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(66, 153, 225, 0.2)',
                  borderRadius: '12px',
                }}
                nodeColor="rgba(0, 229, 255, 0.6)"
              />
            </ReactFlow>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-display font-bold gradient-text">5</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Sources</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-display font-bold gradient-text">4</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Routes</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-display font-bold gradient-text">4</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Destinations</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-display font-bold text-secondary">0.0010</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">USDC/sec</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Flow;
