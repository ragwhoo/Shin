'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { getGraph } from '@/lib/api';
import { GraphNode, GraphEdge } from '@/lib/types';

const colors: Record<string, string> = {
  concept: '#4c6ef5', experience: '#2b8a3e', principle: '#e67700',
  decision: '#cc5de8', failure: '#e03131', architecture: '#0c8599',
};

export default function GraphPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGraph().then(data => {
      const nodes = data.nodes.map((n, i) => ({
        id: n.id, type: 'default' as const,
        position: { x: 220 * (i % 4), y: 120 * Math.floor(i / 4) },
        data: { label: n.label },
        style: { background: colors[n.type] || '#666', color: '#fff',
                 border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 },
      }));
      const edges = data.edges.map(e => ({
        id: e.id, source: e.source, target: e.target,
        label: e.label, style: { stroke: '#94a3b8' },
        markerEnd: { type: MarkerType.ArrowClosed }, labelStyle: { fontSize: 10 },
      }));
      setNodes(nodes); setEdges(edges); setLoaded(true);
    });
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  if (!loaded) return <div className="text-gray-500">Loading graph...</div>;

  return (
    <div className="h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Knowledge Graph</h1>
      <div className="w-full h-full border rounded-lg bg-white">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
          <Controls /><Background />
        </ReactFlow>
      </div>
    </div>
  );
}
