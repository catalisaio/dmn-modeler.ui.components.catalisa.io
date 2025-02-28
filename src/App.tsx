import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { BaseNode } from './components/nodes/BaseNode';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useDmnStore } from './store/dmnStore';

const nodeTypes = {
  default: BaseNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  const { selectedNode, setSelectedNode } = useDmnStore();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#B0B0B0' },
      style: { stroke: '#B0B0B0' }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 240,
        y: event.clientY,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: {
          id: `${type}-${Date.now()}`,
          type,
          name: `New ${type}`,
          description: '',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
    if (node.data.type !== 'decision' || !node.data.decisionTable) {
      setIsPanelCollapsed(false);
    }
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsPanelCollapsed(true);
  }, [setSelectedNode]);

  useEffect(() => {
    if (selectedNode?.type === 'decision' && selectedNode?.decisionTable) {
      setIsPanelCollapsed(true);
    }
  }, [selectedNode]);

  return (
    <div className="flex h-screen w-screen bg-[#FAFAFA]">
      <Sidebar />
      <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#B0B0B0' },
            style: { stroke: '#B0B0B0' }
          }}
          fitView
        >
          <Controls 
            className="!bg-white !border-[#F0F0F0] !shadow-none"
            style={{ button: { border: '1px solid #F0F0F0', backgroundColor: 'white' }}}
          />
        </ReactFlow>
      </div>
      <PropertiesPanel 
        isCollapsed={isPanelCollapsed}
        onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
      />
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}