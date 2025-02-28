import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { Database, BrainCircuit, FileInput } from 'lucide-react';

const nodeTypes = [
  { 
    type: 'input', 
    icon: FileInput, 
    label: 'Input Data',
    color: '#A8D5E2',
    description: 'External data input'
  },
  { 
    type: 'decision', 
    icon: BrainCircuit, 
    label: 'Decision',
    color: '#F9D5CA',
    description: 'Decision logic'
  },
  { 
    type: 'knowledge', 
    icon: Database, 
    label: 'Business Knowledge',
    color: '#E8E1EF',
    description: 'Reusable business logic'
  },
];

export const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 240,
        height: '100%',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderRight: '1px solid #F0F0F0',
        borderRadius: 0,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>DMN Elements</Typography>
      
      {nodeTypes.map(({ type, icon: Icon, label, color, description }) => (
        <React.Fragment key={type}>
          <Box
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'grab',
              borderRadius: 1,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                bgcolor: color,
              }}
            >
              <Icon size={20} color="white" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
              <Typography variant="caption" color="text.secondary">{description}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
    </Paper>
  );
};