import React from 'react';
import { NodeData } from '../../types/dmn';
import { X } from 'lucide-react';

interface RunModalProps {
  node: NodeData;
  onClose: () => void;
}

export const RunModal: React.FC<RunModalProps> = ({ node, onClose }) => {
  const inputVariables = node.variables?.filter(v => v.direction === 'input') || [];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm w-[500px] shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-[#F0F0F0]">
          <h2 className="text-lg font-medium">Run {node.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {inputVariables.map((variable) => (
              <div key={variable.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {variable.name}
                </label>
                <input
                  type={variable.type === 'number' ? 'number' : 'text'}
                  className="w-full px-3 py-2 border border-[#F0F0F0] rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${variable.name}`}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[#F0F0F0] rounded-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-sm hover:bg-blue-600"
            >
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};