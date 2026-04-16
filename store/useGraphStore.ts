import { create } from "zustand";
import { GraphNode, GraphEdge } from "@/types/graph";
import { seedNodes, seedEdges } from "@/data/seedData";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "mindmesh-graph";

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  searchQuery: string;
  initGraph: () => void;
  addNode: (title: string, note: string, tags?: string[]) => void;
  updateNode: (id: string, title: string, note: string, tags?: string[]) => void;
  updateNodeColor: (id: string, color: string) => void;
  deleteNode: (id: string) => void;
  addEdge: (source: string, target: string, label: string) => void;
  deleteEdge: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  setSearchQuery: (query: string) => void;
  importGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
}

const NODE_PALETTE = [
  "#22c55e",
  "#3b82f6",
  "#a78bfa",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
];

const save = (nodes: GraphNode[], edges: GraphEdge[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  }
};

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  searchQuery: "",

  initGraph: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
            set({ nodes: parsed.nodes, edges: parsed.edges });
            return;
          }
        } catch (e) {
          console.error("MindMesh: failed to restore graph state", e);
        }
      }
    }
    const colored = seedNodes.map((n, i) => ({
      ...n,
      color: NODE_PALETTE[i % NODE_PALETTE.length],
      createdAt: Date.now(),
    }));
    set({ nodes: colored, edges: seedEdges });
    save(colored, seedEdges);
  },

  addNode: (title, note, tags = []) => {
    const node: GraphNode = {
      id: uuidv4(),
      title,
      note,
      tags,
      createdAt: Date.now(),
      position: {
        x: Math.floor(Math.random() * 500) + 120,
        y: Math.floor(Math.random() * 300) + 120,
      },
      color: NODE_PALETTE[Math.floor(Math.random() * NODE_PALETTE.length)],
    };
    set((s) => {
      const next = [...s.nodes, node];
      save(next, s.edges);
      return { nodes: next };
    });
  },

  updateNode: (id, title, note, tags) => {
    set((s) => {
      const next = s.nodes.map((n) =>
        n.id === id ? { ...n, title, note, ...(tags !== undefined && { tags }) } : n
      );
      save(next, s.edges);
      return { nodes: next };
    });
  },

  updateNodeColor: (id, color) => {
    set((s) => {
      const next = s.nodes.map((n) => (n.id === id ? { ...n, color } : n));
      save(next, s.edges);
      return { nodes: next };
    });
  },

  deleteNode: (id) => {
    set((s) => {
      const nodes = s.nodes.filter((n) => n.id !== id);
      const edges = s.edges.filter((e) => e.source !== id && e.target !== id);
      save(nodes, edges);
      return {
        nodes,
        edges,
        selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
      };
    });
  },

  addEdge: (source, target, label) => {
    const edge: GraphEdge = { id: uuidv4(), source, target, label };
    set((s) => {
      const next = [...s.edges, edge];
      save(s.nodes, next);
      return { edges: next };
    });
  },

  deleteEdge: (id) => {
    set((s) => {
      const next = s.edges.filter((e) => e.id !== id);
      save(s.nodes, next);
      return { edges: next };
    });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodePosition: (id, x, y) => {
    set((s) => {
      const next = s.nodes.map((n) =>
        n.id === id ? { ...n, position: { x, y } } : n
      );
      save(next, s.edges);
      return { nodes: next };
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  importGraph: (nodes, edges) => {
    save(nodes, edges);
    set({ nodes, edges, selectedNodeId: null });
  },
}));
