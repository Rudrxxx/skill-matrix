"use client";

import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useGraphStore } from "@/store/useGraphStore";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

type CyStyle = cytoscape.Css.Node &
  cytoscape.Css.Edge &
  cytoscape.Css.Core &
  Record<string, unknown>;

interface CyStylesheet {
  selector: string;
  style: Partial<CyStyle>;
}

if (!cytoscape.prototype.hasInitialDagre) {
  cytoscape.use(dagre);
  cytoscape.prototype.hasInitialDagre = true;
}

interface Props {
  layoutDirection: "LR" | "TB";
  flowMode: boolean;
}

export function GraphCanvas({ layoutDirection, flowMode }: Props) {
  const { nodes, edges, setSelectedNode, updateNodePosition, selectedNodeId } =
    useGraphStore();
  const cyRef = useRef<cytoscape.Core | null>(null);
  const searchQuery = useGraphStore((s) => s.searchQuery);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const layout = cy.layout({
        name: "dagre",
        rankDir: layoutDirection,
        padding: 60,
        animate: true,
        nodeDimensionsIncludeLabels: true,
        rankSep: 80,
        nodeSep: 40,
      } as cytoscape.LayoutOptions);
      layout.run();

      const handleResize = () => {
        cy.resize();
        cy.fit(undefined, 60);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [nodes.length, edges.length, layoutDirection]);

  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.elements().removeClass("highlighted dimmed");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cy.elements().addClass("dimmed");
      cy.nodes()
        .filter((n) => (n.data("label") || "").toLowerCase().includes(q))
        .removeClass("dimmed")
        .addClass("highlighted");
      return;
    }

    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId);
      if (node.length > 0) {
        cy.elements().addClass("dimmed");
        node.removeClass("dimmed").addClass("highlighted");
        node.neighborhood().removeClass("dimmed").addClass("highlighted");
      }
    }
  }, [searchQuery, selectedNodeId, nodes.length, edges.length]);

  useEffect(() => {
    if (!cyRef.current) return;
    let interval: ReturnType<typeof setInterval>;
    if (flowMode) {
      cyRef.current.edges().addClass("flowing");
      let offset = 0;
      interval = setInterval(() => {
        offset = (offset - 1) % 24;
        cyRef.current?.edges(".flowing").style("line-dash-offset", offset);
      }, 28);
    } else {
      cyRef.current.edges().removeClass("flowing");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [flowMode, edges.length]);

  const elements = [
    ...nodes.map((n) => ({
      data: { id: n.id, label: n.title, color: n.color || "#22c55e" },
    })),
    ...edges.map((e) => ({
      data: { id: e.id, source: e.source, target: e.target, label: e.label },
    })),
  ];

  const stylesheet: CyStylesheet[] = [
    {
      selector: "node",
      style: {
        shape: "roundrectangle",
        "background-color": "#161b22",
        color: "#e2e8f0",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap": "wrap",
        "text-max-width": "110px",
        "border-color": "data(color)",
        "border-width": 1.5,
        width: "130",
        height: "42",
        padding: "10",
        "font-family": "Space Grotesk, system-ui, sans-serif",
        "font-size": "11",
        "font-weight": "normal",
        "transition-property":
          "background-color, border-color, opacity, border-width",
        "transition-duration": 300,
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": "#30363d",
        "target-arrow-color": "#30363d",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "9",
        color: "#6b7280",
        "text-background-color": "#0d1117",
        "text-background-opacity": 1,
        "text-background-padding": "3px",
        "text-background-shape": "roundrectangle",
        "text-rotation": "autorotate",
        "transition-property":
          "line-color, target-arrow-color, opacity, color",
        "transition-duration": 300,
      },
    },
    {
      selector: ".dimmed",
      style: { opacity: 0.1 },
    },
    {
      selector: "node.highlighted",
      style: {
        "border-width": 3,
        "border-color": "#22c55e",
        color: "#ffffff",
        opacity: 1,
      },
    },
    {
      selector: "edge.highlighted",
      style: {
        "line-color": "#22c55e",
        "target-arrow-color": "#22c55e",
        color: "#22c55e",
        width: 2,
        opacity: 1,
      },
    },
    {
      selector: "edge.flowing",
      style: {
        "line-color": "#22c55e",
        "target-arrow-color": "#22c55e",
        width: 2,
        opacity: 0.9,
        "line-style": "dashed",
        "line-dash-pattern": [6, 3],
        "line-dash-offset": 0,
        "transition-duration": 0,
      },
    },
  ];

  return (
    <div
      className="w-full relative bg-transparent"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {/* Zoom controls */}
      <div className="absolute bottom-5 left-5 flex flex-col gap-1.5 bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] p-1.5 rounded-xl z-50 pointer-events-auto">
        <button
          onClick={() =>
            cyRef.current?.zoom(cyRef.current.zoom() + 0.2)
          }
          title="Zoom in"
          className="p-2 rounded-lg text-slate-500 hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => cyRef.current?.fit()}
          title="Fit view"
          className="p-2 rounded-lg text-slate-500 hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            cyRef.current?.zoom(cyRef.current.zoom() - 0.2)
          }
          title="Zoom out"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#161b22] transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Node count badge (bottom right) */}
      <div className="absolute bottom-5 right-5 z-10 pointer-events-none">
        <div className="bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] rounded-xl px-4 py-3 text-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">
            Graph
          </p>
          <p className="text-lg font-bold text-white font-mono">
            {nodes.length}
            <span className="text-xs text-slate-500 font-normal ml-1">N</span>
          </p>
          <p className="text-sm font-bold text-[#22c55e] font-mono">
            {edges.length}
            <span className="text-xs text-slate-500 font-normal ml-1">E</span>
          </p>
        </div>
      </div>

      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        stylesheet={stylesheet}
        cy={(cy) => {
          cyRef.current = cy;
          if (!cy.scratch("_listenersAttached")) {
            cy.on("tap", "node", (evt) => {
              const id = evt.target.id();
              cy.elements().removeClass("highlighted dimmed").addClass("dimmed");
              evt.target.removeClass("dimmed").addClass("highlighted");
              evt.target
                .neighborhood()
                .removeClass("dimmed")
                .addClass("highlighted");
              setSelectedNode(null);
              setTimeout(() => setSelectedNode(id), 0);
            });

            cy.on("tap", (evt) => {
              if (evt.target === cy) {
                cy.elements().removeClass("highlighted dimmed");
                setSelectedNode(null);
              }
            });

            cy.on("dragfree", "node", (evt) => {
              const pos = evt.target.position();
              updateNodePosition(evt.target.id(), pos.x, pos.y);
            });

            cy.on("add", "edge", (evt) => {
              evt.target.style("opacity", 0);
              evt.target.animate({ style: { opacity: 1 } }, { duration: 400 });
            });

            cy.scratch("_listenersAttached", true);
          }
        }}
        wheelSensitivity={0.1}
        maxZoom={3}
        minZoom={0.15}
      />
    </div>
  );
}
