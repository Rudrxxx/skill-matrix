"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGraphStore } from "@/store/useGraphStore";
import { BarChart2, Network, Cpu, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: Props) {
  const { nodes, edges } = useGraphStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const deg: Record<string, number> = {};
  nodes.forEach((n) => { deg[n.id] = 0; });
  edges.forEach((e) => {
    deg[e.source] = (deg[e.source] || 0) + 1;
    deg[e.target] = (deg[e.target] || 0) + 1;
  });

  const topNodeId = Object.entries(deg).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topNode = nodes.find((n) => n.id === topNodeId);
  const isolated = nodes.filter((n) => deg[n.id] === 0);
  const avgDeg =
    nodes.length > 0
      ? (Object.values(deg).reduce((a, b) => a + b, 0) / nodes.length).toFixed(1)
      : "0";

  const density =
    nodes.length > 1
      ? ((edges.length / (nodes.length * (nodes.length - 1))) * 100).toFixed(1)
      : "0";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[480px] bg-[#161b22] border-[#30363d] text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-200">
            <BarChart2 className="w-4 h-4 text-[#22c55e]" />
            Graph Analytics
          </DialogTitle>
        </DialogHeader>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Nodes", value: nodes.length, icon: <Cpu className="w-4 h-4 text-[#22c55e]" />, color: "border-[#22c55e]/20 bg-[#22c55e]/5" },
            { label: "Edges", value: edges.length, icon: <Network className="w-4 h-4 text-[#3b82f6]" />, color: "border-[#3b82f6]/20 bg-[#3b82f6]/5" },
            { label: "Avg Degree", value: avgDeg, icon: <BarChart2 className="w-4 h-4 text-[#a78bfa]" />, color: "border-[#a78bfa]/20 bg-[#a78bfa]/5" },
            { label: "Isolated", value: isolated.length, icon: <AlertCircle className="w-4 h-4 text-[#f59e0b]" />, color: "border-[#f59e0b]/20 bg-[#f59e0b]/5" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.color}`}>
              {s.icon}
              <div>
                <p className="text-xl font-bold text-white font-mono">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Density */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Graph Density</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22c55e] rounded-full"
                style={{ width: `${Math.min(parseFloat(density), 100)}%` }}
              />
            </div>
            <span className="text-sm font-mono font-bold text-[#22c55e]">{density}%</span>
          </div>
        </div>

        {topNode && (
          <div className="px-3.5 py-3 rounded-xl border border-[#30363d] bg-[#0d1117]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
              Most Connected
            </p>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white text-sm">{topNode.title}</p>
              <span className="text-xs font-mono text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-md border border-[#22c55e]/25">
                {deg[topNode.id]} links
              </span>
            </div>
          </div>
        )}

        {/* Node list */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2 px-0.5">
            All Nodes
          </p>
          <div className="flex flex-col gap-1.5 max-h-[30vh] sm:max-h-[220px] overflow-y-auto">
            {[...nodes]
              .sort((a, b) => (deg[b.id] || 0) - (deg[a.id] || 0))
              .map((n) => {
                const nodeEdges = edges.filter(
                  (e) => e.source === n.id || e.target === n.id
                );
                const isExpanded = expanded === n.id;
                return (
                  <div key={n.id}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : n.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all text-sm ${
                        isExpanded
                          ? "bg-[#22c55e]/10 border-[#22c55e]/25 text-white"
                          : "bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-[#22c55e]/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: n.color || "#22c55e" }}
                        />
                        <span className="truncate">{n.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isExpanded ? "text-[#22c55e] bg-[#22c55e]/15" : "text-slate-600 bg-[#30363d]"}`}>
                          {deg[n.id] || 0}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3 text-[#22c55e]" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && nodeEdges.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden bg-[#0d1117] rounded-b-lg border-x border-b border-[#22c55e]/15 mx-1"
                        >
                          <div className="p-2 space-y-1">
                            {nodeEdges.map((edge) => {
                              const isOut = edge.source === n.id;
                              const otherId = isOut ? edge.target : edge.source;
                              const other = nodes.find((nb) => nb.id === otherId);
                              return (
                                <div
                                  key={edge.id}
                                  className="flex items-center justify-between px-2 py-1.5 rounded bg-[#161b22] text-xs"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isOut ? "bg-[#22c55e]" : "bg-[#3b82f6]"}`} />
                                    <span className="text-slate-500 italic">{edge.label}</span>
                                  </div>
                                  <span className="text-slate-300 font-medium">{other?.title}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
