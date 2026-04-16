# MindMesh

A browser-based interactive graph tool for mapping concepts, ideas, and the relationships between them. Built as a frontend assignment demonstrating graph state management and visualization.

## Features

### Graph Visualization
- Renders nodes and edges using Cytoscape.js with the Dagre layout engine.
- Supports both left-to-right and top-to-bottom hierarchical layouts.
- Nodes can be dragged freely; positions persist across sessions.

### CRUD Operations
- Add nodes with a title, optional notes, and tags.
- Create directed edges between any two nodes with a custom relationship label.
- Edit node titles, notes, tags, and colors directly from the detail panel.
- Delete individual nodes (cascades to connected edges) or individual edges.

### State and Persistence
- Graph state stored in localStorage under the key `mindmesh-graph`.
- Pre-loaded with seed data on first visit.
- Export the full graph as a JSON file and re-import it later.

### Extra Features
- Tag system for categorizing nodes.
- Flow mode: animates edges with a marching-ants effect to show directionality.
- Search bar filters and highlights matching nodes, dimming the rest.
- Clicking a node highlights its immediate neighborhood.
- Analytics panel showing node count, edge count, average degree, graph density, and per-node connection details.

## Tech Stack

- Next.js 14 (App Router), TypeScript
- Tailwind CSS, Framer Motion
- Zustand (state + localStorage persistence)
- Cytoscape.js + Dagre layout plugin
- Shadcn UI / Radix primitives

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Feature Checklist

| Feature | Status |
|---|---|
| Render nodes and edges | Pass |
| Relationship labels on edges | Pass |
| Non-overlapping hierarchical layout | Pass |
| Node detail panel with inline editing | Pass |
| Create, update, delete nodes | Pass |
| Create, delete edges | Pass |
| localStorage persistence | Pass |
| Highlight connected nodes on selection | Pass |
| Tag system for nodes | Pass |
| Export and import graph as JSON | Pass |
| Flow mode edge animation | Pass |
| Search and filter nodes | Pass |
| Analytics panel with graph density | Pass |
