import React from 'react';
import { Play, Table2, Trash2, LineChart } from 'lucide-react';
import { NodeData } from '../../types/dmn';

interface NodeMenuProps {
  node: NodeData;
  onRun: () => void;
  onDecisionTable: () => void;
  onRemove: () => void;
  onInsights: () => void;
}

export const NodeMenu: React.FC<NodeMenuProps> = ({
  node,
  onRun,
  onDecisionTable,
  onRemove,
  onInsights,
}) => {
  return (
    <div className="absolute -right-10 top-0 flex flex-col gap-1">
      {(node.type === 'decision' || node.type === 'knowledge') && (
        <button
          onClick={onRun}
          className="w-8 h-8 rounded-sm bg-white border border-[#F0F0F0] flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Run"
        >
          <Play size={16} className="text-gray-600" />
        </button>
      )}
      
      {node.type === 'decision' && (
        <button
          onClick={onDecisionTable}
          className="w-8 h-8 rounded-sm bg-white border border-[#F0F0F0] flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Decision Table"
        >
          <Table2 size={16} className="text-gray-600" />
        </button>
      )}
      
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-sm bg-white border border-[#F0F0F0] flex items-center justify-center hover:bg-gray-50 transition-colors"
        title="Remove"
      >
        <Trash2 size={16} className="text-gray-600" />
      </button>
      
      <button
        onClick={onInsights}
        className="w-8 h-8 rounded-sm bg-white border border-[#F0F0F0] flex items-center justify-center hover:bg-gray-50 transition-colors"
        title="Insights"
      >
        <LineChart size={16} className="text-gray-600" />
      </button>
    </div>
  );
};