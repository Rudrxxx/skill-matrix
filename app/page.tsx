"use client";

import { useEffect, useState } from "react";
import { GraphCanvas } from "@/components/GraphCanvas";
import { Toolbar } from "@/components/Toolbar";
import { AddNodeModal } from "@/components/AddNodeModal";
import { AddEdgeModal } from "@/components/AddEdgeModal";
import { NodeDetailPanel } from "@/components/NodeDetailPanel";
import { useGraphStore } from "@/store/useGraphStore";

export default function Home() {
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<"LR" | "TB">("LR");
  const [flowMode, setFlowMode] = useState(false);
  const initGraph = useGraphStore((s) => s.initGraph);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  return (
    <div className="flex flex-col h-screen w-full bg-mm-surface text-slate-200 font-space">
      <Toolbar
        onAddNode={() => setIsNodeModalOpen(true)}
        onAddEdge={() => setIsEdgeModalOpen(true)}
        layoutDirection={layoutDirection}
        onLayoutChange={setLayoutDirection}
        flowMode={flowMode}
        onToggleFlow={() => setFlowMode((f) => !f)}
      />

      <main className="flex-1 relative mt-[60px] overflow-hidden">
        <GraphCanvas layoutDirection={layoutDirection} flowMode={flowMode} />
        <NodeDetailPanel />
      </main>

      <AddNodeModal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
      />
      <AddEdgeModal
        isOpen={isEdgeModalOpen}
        onClose={() => setIsEdgeModalOpen(false)}
      />
    </div>
  );
}
