export interface GraphNode {
  id: string;
  title: string;
  note: string;
  color?: string;
  position?: { x: number; y: number };
  tags?: string[];
  createdAt?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
