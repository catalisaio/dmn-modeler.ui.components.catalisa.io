import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import { Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDmnStore } from '../store/dmnStore';
import { Variable } from '../types/dmn';
import DecisionTableEditor from './DecisionTable';

const dataTypes = ['string', 'number', 'boolean', 'date'] as const;

interface PropertiesPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { selectedNode, updateNode } = useDmnStore();

  const handleAddVariable = () => {
    if (!selectedNode) return;

    const newVariable: Variable = {
      name: '',
      type: 'string',
      direction: 'input',
    };

    updateNode(selectedNode.id, {
      variables: [...(selectedNode.variables || []), newVariable],
    });
  };

  const handleUpdateVariable = (index: number, updates: Partial<Variable>) => {
    if (!selectedNode) return;

    const updatedVariables = [...(selectedNode.variables || [])];
    updatedVariables[index] = { ...updatedVariables[index], ...updates };

    updateNode(selectedNode.id, { variables: updatedVariables });
  };

  const handleRemoveVariable = (index: number) => {
    if (!selectedNode) return;

    const updatedVariables = [...(selectedNode.variables || [])];
    updatedVariables.splice(index, 1);

    updateNode(selectedNode.id, { variables: updatedVariables });
  };

  // Don't render anything if there's no selected node
  if (!selectedNode) {
    return null;
  }

  const hasNameError = !selectedNode.name.trim();

  return (
    <div className="relative flex h-full">
      <button
        onClick={onToggleCollapse}
        className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-12 bg-white border border-[#F0F0F0] rounded-l-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronLeft size={20} className="text-gray-600" />
        ) : (
          <ChevronRight size={20} className="text-gray-600" />
        )}
      </button>

      <Paper
        elevation={0}
        sx={{
          width: isCollapsed ? 0 : 300,
          height: '100%',
          p: isCollapsed ? 0 : 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
          transition: 'width 0.3s ease, padding 0.3s ease',
          borderLeft: '1px solid #F0F0F0',
          borderRadius: 0,
        }}
      >
        {!isCollapsed && (
          <>
            <Typography variant="h6">Properties</Typography>

            <TextField
              label="ID"
              value={selectedNode.id}
              size="small"
              fullWidth
              disabled
            />

            <TextField
              label="Name"
              value={selectedNode.name}
              onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
              size="small"
              fullWidth
              required
              error={hasNameError}
              helperText={hasNameError ? 'Name is required' : ''}
            />

            <TextField
              label="Description"
              value={selectedNode.description}
              onChange={(e) =>
                updateNode(selectedNode.id, { description: e.target.value })
              }
              multiline
              rows={3}
              size="small"
              fullWidth
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedNode.type}
                label="Type"
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    type: e.target.value as 'decision' | 'input' | 'knowledge',
                  })
                }
              >
                <MenuItem value="decision">Decision</MenuItem>
                <MenuItem value="input">Input Data</MenuItem>
                <MenuItem value="knowledge">Business Knowledge</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Variables</Typography>
              <Button
                startIcon={<Plus size={16} />}
                onClick={handleAddVariable}
                size="small"
              >
                Add Variable
              </Button>
            </Box>

            {selectedNode.variables?.map((variable, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Variable {index + 1}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveVariable(index)}
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>

                <TextField
                  label="Name"
                  value={variable.name}
                  onChange={(e) =>
                    handleUpdateVariable(index, { name: e.target.value })
                  }
                  size="small"
                  fullWidth
                  required
                  error={!variable.name.trim()}
                  helperText={!variable.name.trim() ? 'Variable name is required' : ''}
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={variable.type}
                    label="Type"
                    onChange={(e) =>
                      handleUpdateVariable(index, {
                        type: e.target.value as Variable['type'],
                      })
                    }
                  >
                    {dataTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Direction</InputLabel>
                  <Select
                    value={variable.direction}
                    label="Direction"
                    onChange={(e) =>
                      handleUpdateVariable(index, {
                        direction: e.target.value as 'input' | 'output',
                      })
                    }
                  >
                    <MenuItem value="input">Input</MenuItem>
                    <MenuItem value="output">Output</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ))}
          </>
        )}
      </Paper>
    </div>
  );
};