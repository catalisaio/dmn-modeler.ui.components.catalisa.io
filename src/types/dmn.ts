export type NodeData = {
  id: string;
  name: string;
  description: string;
  type: 'decision' | 'input' | 'knowledge';
  variables?: Variable[];
  decisionTable?: DecisionTable;
};

export type Variable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  direction: 'input' | 'output';
};

export type HitPolicy = 'UNIQUE' | 'FIRST' | 'ANY' | 'COLLECT' | 'PRIORITY';

export type DecisionTable = {
  hitPolicy: HitPolicy;
  inputColumns: TableColumn[];
  outputColumns: TableColumn[];
  rules: TableRule[];
  annotations: string;
};

export type TableColumn = {
  id: string;
  variableId: string;
  label: string;
  expressionLanguage: 'feel' | 'javascript';
};

export type TableRule = {
  id: string;
  inputEntries: string[];
  outputEntries: string[];
  annotation: string;
};

export type DmnStore = {
  nodes: NodeData[];
  selectedNode: NodeData | null;
  setSelectedNode: (node: NodeData | null) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  addNode: (node: NodeData) => void;
  removeNode: (id: string) => void;
};