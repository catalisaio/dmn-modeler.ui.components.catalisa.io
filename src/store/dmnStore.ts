import { create } from 'zustand';
import { DmnStore, NodeData } from '../types/dmn';

export const useDmnStore = create<DmnStore>((set) => ({
  nodes: [],
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node
      ),
    })),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (id) =>
    set((state) => ({ nodes: state.nodes.filter((node) => node.id !== id) })),
}));