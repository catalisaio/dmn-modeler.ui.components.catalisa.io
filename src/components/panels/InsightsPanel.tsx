import React from 'react';
import { NodeData } from '../../types/dmn';
import { 
  X, 
  Clock, 
  Activity,
  Users,
  TrendingUp,
  Database,
  BarChart,
  FileText,
  ExternalLink,
  FileSpreadsheet,
  Brain
} from 'lucide-react';

interface InsightsPanelProps {
  node: NodeData;
  onClose: () => void;
}

const insightColors = {
  analytics: {
    base: '#A8D5E2',
    corner: '#98C5D2'
  },
  report: {
    base: '#F9D5CA',
    corner: '#E9C5BA'
  },
  database: {
    base: '#E8E1EF',
    corner: '#D8D1DF'
  },
  external: {
    base: '#95D5B2',
    corner: '#85C5A2'
  }
};

const mockInsights = [
  { 
    title: 'Execution Time', 
    value: '245ms', 
    trend: '+12%', 
    icon: Clock,
    type: 'analytics'
  },
  { 
    title: 'Success Rate', 
    value: '98.5%', 
    trend: '+3%', 
    icon: Activity,
    type: 'analytics'
  },
  { 
    title: 'Daily Usage', 
    value: '1,234', 
    trend: '+25%', 
    icon: TrendingUp,
    type: 'analytics'
  },
  { 
    title: 'Unique Users', 
    value: '456', 
    trend: '+8%', 
    icon: Users,
    type: 'analytics'
  },
];

const mockReports = [
  {
    title: 'Performance Analysis',
    description: 'Performance optimization opportunities detected in rule execution',
    icon: BarChart,
    type: 'analytics'
  },
  {
    title: 'Decision Pattern Report',
    description: 'Unusual pattern detected in decision outcomes',
    icon: Brain,
    type: 'report'
  },
  {
    title: 'Data Correlation Study',
    description: 'High correlation found between input variables',
    icon: Database,
    type: 'database'
  },
  {
    title: 'Path Optimization Report',
    description: 'Decision path optimization suggested',
    icon: FileSpreadsheet,
    type: 'external'
  },
  {
    title: 'Data Quality Report',
    description: 'Data quality improvements recommended',
    icon: FileText,
    type: 'report'
  },
];

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ node, onClose }) => {
  return (
    <div className="w-[400px] h-full bg-white border-l border-[#F0F0F0] overflow-auto">
      <div className="flex items-center justify-between p-4 border-b border-[#F0F0F0]">
        <h2 className="text-lg font-medium">Insights</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {mockInsights.map((insight, index) => {
            const colors = insightColors[insight.type];
            return (
              <div
                key={index}
                className="rounded-sm overflow-hidden"
                style={{ 
                  background: colors.corner,
                  padding: '1px'
                }}
              >
                <div className="flex items-stretch bg-white">
                  <div 
                    className="flex items-center justify-center w-10"
                    style={{ backgroundColor: colors.base }}
                  >
                    <insight.icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1 p-2">
                    <div className="text-xs text-gray-600">{insight.title}</div>
                    <div className="text-lg font-medium">{insight.value}</div>
                    <div className="text-xs text-green-500">{insight.trend}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">AI Generated Insights</h3>
          <div className="space-y-3">
            {mockReports.map((report, index) => {
              const colors = insightColors[report.type];
              return (
                <div
                  key={index}
                  className="rounded-sm overflow-hidden cursor-pointer"
                  style={{ 
                    background: colors.corner,
                    padding: '1px'
                  }}
                >
                  <div className="flex items-stretch bg-white hover:bg-gray-50">
                    <div 
                      className="flex items-center justify-center w-12"
                      style={{ backgroundColor: colors.base }}
                    >
                      <report.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="text-sm font-medium">{report.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{report.description}</div>
                    </div>
                    <div 
                      className="flex items-center px-3"
                      style={{ color: colors.base }}
                    >
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};