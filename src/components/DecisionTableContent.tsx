import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Settings, Plus, GripVertical, MoveHorizontal } from 'lucide-react';
import { TableColumn, TableRule, DecisionTable } from '../types/dmn';

interface DecisionTableContentProps {
  decisionTable: DecisionTable;
  onColumnConfig: (columnId: string) => void;
  onUpdateColumn: (index: number, updates: Partial<TableColumn>) => void;
  onUpdateRule: (ruleIndex: number, inputIndex: number, value: string) => void;
  onAddRule: () => void;
  onColumnDragStart: (index: number) => void;
  onColumnDragOver: (index: number) => void;
  onRowDragStart: (index: number) => void;
  onRowDragOver: (index: number) => void;
}

export const DecisionTableContent: React.FC<DecisionTableContentProps> = ({
  decisionTable,
  onColumnConfig,
  onUpdateColumn,
  onUpdateRule,
  onAddRule,
  onColumnDragStart,
  onColumnDragOver,
  onRowDragStart,
  onRowDragOver,
}) => {
  const columnHelper = createColumnHelper<TableRule>();

  const columns = useMemo(() => {
    const cols = [
      columnHelper.display({
        id: 'dragHandle',
        header: '',
        cell: ({ row }) => (
          <div
            className="w-10"
            draggable
            onDragStart={() => onRowDragStart(row.index)}
            onDragOver={() => onRowDragOver(row.index)}
          >
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <GripVertical size={16} />
            </button>
          </div>
        ),
        size: 40,
      }),
      ...decisionTable.inputColumns.map((column, index) =>
        columnHelper.accessor(
          (row) => row.inputEntries[index],
          {
            id: column.id,
            header: () => (
              <div
                draggable
                onDragStart={() => onColumnDragStart(index)}
                onDragOver={() => onColumnDragOver(index)}
                className="p-3 bg-[#34495E] text-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MoveHorizontal size={16} className="cursor-move text-white/50" />
                  <div className="flex-1">{column.label}</div>
                  <button
                    onClick={() => onColumnConfig(column.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-white/20"
                  >
                    <Settings size={14} />
                  </button>
                </div>
                <select
                  value={column.variableId}
                  onChange={(e) => onUpdateColumn(index, { variableId: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-sm text-sm text-white"
                >
                  <option value="">Select Type</option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                </select>
              </div>
            ),
            cell: ({ row, column }) => (
              <div className="p-3">
                <input
                  type="text"
                  value={row.getValue(column.id)}
                  onChange={(e) => onUpdateRule(row.index, index, e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-sm text-sm focus:border-[#E85D3F] focus:ring-1 focus:ring-[#E85D3F] transition-colors"
                  placeholder="Enter condition"
                />
              </div>
            ),
          }
        )
      ),
      columnHelper.display({
        id: 'addColumn',
        header: () => (
          <div className="p-3 bg-[#34495E] text-white w-10">
            <button
              onClick={onAddRule}
              className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center hover:bg-white/20"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        ),
        cell: () => (
          <div className="p-3">
            <button
              onClick={onAddRule}
              className="w-8 h-8 rounded-sm border border-gray-200 flex items-center justify-center hover:border-[#E85D3F] hover:text-[#E85D3F] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        ),
        size: 40,
      }),
    ];

    return cols;
  }, [decisionTable.inputColumns]);

  const table = useReactTable({
    data: decisionTable.rules,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="w-10 bg-[#2C3E50] text-white"></th>
            <th 
              className="text-left p-3 bg-[#2C3E50] text-white font-medium"
              colSpan={decisionTable.inputColumns.length || 1}
            >
              WHEN
            </th>
            <th className="w-10 bg-[#2C3E50] text-white"></th>
          </tr>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};