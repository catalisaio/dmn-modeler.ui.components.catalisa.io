import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { 
  X, 
  Plus,
  ChevronDown,
  Table2,
  Settings,
  Check,
  XCircle,
} from 'lucide-react';
import { NodeData, HitPolicy, TableColumn, TableRule } from '../types/dmn';
import { DecisionTableContent } from './DecisionTableContent';

interface DecisionTableEditorProps {
  node: NodeData;
  onClose?: () => void;
  onUpdate: (updates: Partial<NodeData>) => void;
}

interface ColumnConfigProps {
  column: TableColumn;
  onUpdate: (updates: Partial<TableColumn>) => void;
  onClose: () => void;
}

const ColumnConfig: React.FC<ColumnConfigProps> = ({ column, onUpdate, onClose }) => {
  const [name, setName] = useState(column.label);
  const [expression, setExpression] = useState(column.expressionLanguage);

  const handleSave = () => {
    onUpdate({ label: name, expressionLanguage: expression });
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-sm shadow-lg p-3 min-w-[250px] z-50">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-sm text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expression</label>
          <select
            value={expression}
            onChange={(e) => setExpression(e.target.value as 'feel' | 'javascript')}
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-sm text-sm"
          >
            <option value="feel">FEEL</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-sm"
          >
            <XCircle size={16} />
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm text-[#E85D3F] hover:bg-gray-50 rounded-sm"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const hitPolicies: HitPolicy[] = ['UNIQUE', 'FIRST', 'ANY', 'COLLECT', 'PRIORITY'];

export default function DecisionTableEditor({ node, onClose, onUpdate }: DecisionTableEditorProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [configColumn, setConfigColumn] = useState<string | null>(null);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const decisionTable = node.decisionTable || {
    hitPolicy: 'UNIQUE' as HitPolicy,
    inputColumns: [],
    outputColumns: [],
    rules: [],
    annotations: '',
  };

  useEffect(() => {
    if ((!decisionTable.inputColumns || decisionTable.inputColumns.length === 0) && 
        (!decisionTable.rules || decisionTable.rules.length === 0)) {
      const initialColumn: TableColumn = {
        id: `col-${Date.now()}`,
        variableId: '',
        label: 'Condition 1',
        expressionLanguage: 'feel',
      };

      // Initialize with 10 empty rules
      const initialRules: TableRule[] = Array.from({ length: 10 }, (_, i) => ({
        id: `rule-${Date.now()}-${i}`,
        inputEntries: [''],
        outputEntries: [],
        annotation: '',
      }));

      onUpdate({
        decisionTable: {
          ...decisionTable,
          inputColumns: [initialColumn],
          rules: initialRules,
        },
      });
    }
  }, []);

  const handleColumnDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  const handleColumnDragOver = (index: number) => {
    if (draggedColumnIndex === null || draggedColumnIndex === index) return;

    const newColumns = [...decisionTable.inputColumns];
    const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(index, 0, draggedColumn);

    const newRules = decisionTable.rules.map(rule => {
      const newEntries = [...rule.inputEntries];
      const [draggedEntry] = newEntries.splice(draggedColumnIndex, 1);
      newEntries.splice(index, 0, draggedEntry);
      return { ...rule, inputEntries: newEntries };
    });

    onUpdate({
      decisionTable: {
        ...decisionTable,
        inputColumns: newColumns,
        rules: newRules,
      },
    });
    setHasChanges(true);
    setDraggedColumnIndex(index);
  };

  const handleRowDragStart = (index: number) => {
    setDraggedRowIndex(index);
  };

  const handleRowDragOver = (index: number) => {
    if (draggedRowIndex === null || draggedRowIndex === index) return;

    const newRules = [...decisionTable.rules];
    const [draggedRule] = newRules.splice(draggedRowIndex, 1);
    newRules.splice(index, 0, draggedRule);

    onUpdate({
      decisionTable: {
        ...decisionTable,
        rules: newRules,
      },
    });
    setHasChanges(true);
    setDraggedRowIndex(index);
  };

  const addInputColumn = () => {
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      variableId: '',
      label: 'New Input',
      expressionLanguage: 'feel',
    };

    onUpdate({
      decisionTable: {
        ...decisionTable,
        inputColumns: [...decisionTable.inputColumns, newColumn],
        rules: decisionTable.rules.map(rule => ({
          ...rule,
          inputEntries: [...rule.inputEntries, ''],
        })),
      },
    });
    setHasChanges(true);
  };

  const addRule = () => {
    const newRule: TableRule = {
      id: `rule-${Date.now()}`,
      inputEntries: Array(decisionTable.inputColumns.length).fill(''),
      outputEntries: Array(decisionTable.outputColumns.length).fill(''),
      annotation: '',
    };

    onUpdate({
      decisionTable: {
        ...decisionTable,
        rules: [...decisionTable.rules, newRule],
      },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    onClose?.();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <Rnd
        default={{
          x: window.innerWidth / 2 - 450,
          y: window.innerHeight / 2 - 300,
          width: 900,
          height: 600,
        }}
        minWidth={900}
        minHeight={600}
        bounds="window"
        className="bg-white shadow-xl border border-gray-200 flex flex-col overflow-hidden rounded-sm"
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ 
            background: '#E85D3F',
            color: 'white'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-white/20 flex items-center justify-center">
              <Table2 size={20} className="text-white" />
            </div>
            
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium">Decision Table</h2>
              
              <div className="relative">
                <button
                  className="px-3 py-1.5 bg-white/20 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-white/30"
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                >
                  {decisionTable.hitPolicy}
                  <ChevronDown size={16} />
                </button>
                
                {showTypeMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-sm shadow-lg py-1 min-w-[120px] z-50">
                    {hitPolicies.map(policy => (
                      <button
                        key={policy}
                        className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          onUpdate({
                            decisionTable: {
                              ...decisionTable,
                              hitPolicy: policy,
                            },
                          });
                          setShowTypeMenu(false);
                          setHasChanges(true);
                        }}
                      >
                        {policy}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/20"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-hidden">
          <DecisionTableContent
            decisionTable={decisionTable}
            onColumnConfig={setConfigColumn}
            onUpdateColumn={(index, updates) => {
              const updatedColumns = [...decisionTable.inputColumns];
              updatedColumns[index] = { ...updatedColumns[index], ...updates };
              onUpdate({
                decisionTable: {
                  ...decisionTable,
                  inputColumns: updatedColumns,
                },
              });
              setHasChanges(true);
            }}
            onUpdateRule={(ruleIndex, inputIndex, value) => {
              const updatedRules = [...decisionTable.rules];
              updatedRules[ruleIndex].inputEntries[inputIndex] = value;
              onUpdate({
                decisionTable: {
                  ...decisionTable,
                  rules: updatedRules,
                },
              });
              setHasChanges(true);
            }}
            onAddRule={addRule}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onRowDragStart={handleRowDragStart}
            onRowDragOver={handleRowDragOver}
          />
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ 
            background: '#E85D3F',
            color: 'white',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-sm text-white/70">
            {hasChanges ? 'Unsaved changes' : 'No changes'}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm rounded-sm ${
                hasChanges 
                  ? 'bg-white text-[#E85D3F] hover:bg-white/90' 
                  : 'bg-white/20 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Rnd>
    </div>
  );
}