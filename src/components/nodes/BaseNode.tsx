import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from '../../types/dmn';
import { useDmnStore } from '../../store/dmnStore';
import { Database, BrainCircuit, FileInput } from 'lucide-react';
import { NodeMenu } from './NodeMenu';
import { RunModal } from '../modals/RunModal';
import DecisionTableEditor from '../DecisionTable';
import { InsightsPanel } from '../panels/InsightsPanel';

const nodeColors = {
  input: {
    base: '#A8D5E2',
    corner: '#98C5D2'
  },
  decision: {
    base: '#F9D5CA',
    corner: '#E9C5BA'
  },
  knowledge: {
    base: '#E8E1EF',
    corner: '#D8D1DF'
  }
};

const nodeIcons = {
  input: FileInput,
  decision: BrainCircuit,
  knowledge: Database,
};

export const BaseNode: React.FC<{ data: NodeData }> = ({ data }) => {
  const [showRunModal, setShowRunModal] = useState(false);
  const [showDecisionTable, setShowDecisionTable] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const setSelectedNode = useDmnStore((state) => state.setSelectedNode);
  const Icon = nodeIcons[data.type];
  const colors = nodeColors[data.type];

  const inputVariables = data.variables?.filter(v => v.direction === 'input') || [];
  const outputVariables = data.variables?.filter(v => v.direction === 'output') || [];

  const handleCloseDecisionTable = () => {
    setShowDecisionTable(false);
  };

  return (
    <>
      {/* Left Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#B0B0B0] border-0" 
      />
      
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="node-content flex items-stretch w-[300px] rounded-sm overflow-hidden"
          style={{ 
            background: colors.corner,
            padding: '1px'
          }}
        >
          <div 
            className="flex items-center justify-center w-12"
            style={{ backgroundColor: colors.base }}
          >
            <Icon size={24} className="text-white" />
          </div>

          <div className="flex-1 p-3 bg-white">
            <div className="font-medium text-sm truncate">{data.name || 'Unnamed Node'}</div>
            <div className="text-xs text-gray-500">{data.type}</div>
            
            {(inputVariables.length > 0 || outputVariables.length > 0) && (
              <div className="mt-2 text-xs">
                {inputVariables.length > 0 && (
                  <div className="text-[#A8D5E2] truncate">
                    Inputs: {inputVariables.map(v => v.name).join(', ')}
                  </div>
                )}
                {outputVariables.length > 0 && (
                  <div className="text-[#95D5B2] truncate">
                    Outputs: {outputVariables.map(v => v.name).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div 
          className={`absolute -right-[5px] top-0 flex flex-col gap-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <NodeMenu
            node={data}
            onRun={() => setShowRunModal(true)}
            onDecisionTable={() => setShowDecisionTable(true)}
            onRemove={() => {/* Implement remove logic */}}
            onInsights={() => setShowInsights(true)}
          />
        </div>
      </div>
      
      {/* Right Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-[#B0B0B0] border-0" 
      />

      {showRunModal && (
        <RunModal node={data} onClose={() => setShowRunModal(false)} />
      )}

      {showDecisionTable && (
        <DecisionTableEditor
          node={data}
          onClose={handleCloseDecisionTable}
          onUpdate={() => {/* Implement update logic */}}
        />
      )}

      {showInsights && (
        <InsightsPanel node={data} onClose={() => setShowInsights(false)} />
      )}
    </>
  );
};