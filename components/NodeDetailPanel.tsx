"use client";

import { useState } from "react";
import { useGraphStore } from "@/store/useGraphStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, X, Tag, Link2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR_PALETTE = [
  "#22c55e",
  "#3b82f6",
  "#a78bfa",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#e2e8f0",
];

export function NodeDetailPanel() {
  const {
    selectedNodeId,
    nodes,
    edges,
    updateNode,
    deleteNode,
    deleteEdge,
    setSelectedNode,
    updateNodeColor,
  } = useGraphStore();
  const [tagInput, setTagInput] = useState("");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || !selectedNode) return;
    const existing = selectedNode.tags || [];
    if (existing.includes(tag)) return;
    updateNode(selectedNode.id, selectedNode.title, selectedNode.note, [
      ...existing,
      tag,
    ]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!selectedNode) return;
    updateNode(
      selectedNode.id,
      selectedNode.title,
      selectedNode.note,
      (selectedNode.tags || []).filter((t) => t !== tag)
    );
  };

  const nodeEdges = selectedNode
    ? edges.filter(
        (e) => e.source === selectedNode.id || e.target === selectedNode.id
      )
    : [];

  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed right-0 md:right-5 top-[68px] bottom-0 md:bottom-5 w-full md:w-[320px] z-50 flex flex-col px-3 md:px-0"
        >
          <Card className="flex-1 flex flex-col bg-[#161b22]/90 backdrop-blur-xl border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
            {/* Top accent line matching node color */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 opacity-70"
              style={{
                background: `linear-gradient(90deg, transparent, ${selectedNode.color || "#22c55e"}, transparent)`,
              }}
            />

            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-[#30363d] shrink-0 space-y-0 bg-[#0d1117]/40">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: selectedNode.color || "#22c55e",
                    boxShadow: `0 0 8px ${selectedNode.color || "#22c55e"}88`,
                  }}
                />
                <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                  Node Editor
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNode(null)}
                className="text-slate-600 hover:text-slate-300 hover:bg-[#30363d] rounded-lg h-7 w-7"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="node-title"
                  className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold"
                >
                  Title
                </Label>
                <Input
                  id="node-title"
                  value={selectedNode.title}
                  onChange={(e) =>
                    updateNode(
                      selectedNode.id,
                      e.target.value,
                      selectedNode.note,
                      selectedNode.tags
                    )
                  }
                  className="bg-[#0d1117] border-[#30363d] text-slate-200 focus-visible:ring-[#22c55e]/40 focus-visible:border-[#22c55e]/50 h-9 text-sm"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="node-note"
                  className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold"
                >
                  Notes
                </Label>
                <Textarea
                  id="node-note"
                  value={selectedNode.note}
                  onChange={(e) =>
                    updateNode(
                      selectedNode.id,
                      selectedNode.title,
                      e.target.value,
                      selectedNode.tags
                    )
                  }
                  className="bg-[#0d1117] border-[#30363d] text-slate-300 min-h-[100px] focus-visible:ring-[#22c55e]/40 focus-visible:border-[#22c55e]/50 resize-y text-sm leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </Label>
                <div className="flex gap-1.5">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    className="bg-[#0d1117] border-[#30363d] text-slate-300 h-8 text-xs flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={addTag}
                    className="h-8 px-3 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/25 text-xs"
                  >
                    Add
                  </Button>
                </div>
                {(selectedNode.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(selectedNode.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[10px] font-mono cursor-pointer hover:bg-red-900/20 hover:text-red-400 hover:border-red-400/30 transition-colors"
                        onClick={() => removeTag(tag)}
                        title="Click to remove"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  Color
                </Label>
                <div className="flex gap-2 p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateNodeColor(selectedNode.id, c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        selectedNode.color === c
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: c,
                        boxShadow: `0 0 6px ${c}55`,
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Connections */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> Connections ({nodeEdges.length})
                </Label>
                {nodeEdges.length === 0 ? (
                  <p className="text-xs text-slate-600 italic px-1">
                    No connections yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                    {nodeEdges.map((edge) => {
                      const otherId =
                        edge.source === selectedNode.id
                          ? edge.target
                          : edge.source;
                      const other = nodes.find((n) => n.id === otherId);
                      const isOut = edge.source === selectedNode.id;
                      return (
                        <div
                          key={edge.id}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#22c55e]/25 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isOut ? "bg-[#22c55e]" : "bg-[#3b82f6]"
                              }`}
                            />
                            <span className="text-[10px] text-slate-500 italic shrink-0">
                              {edge.label}
                            </span>
                            <span className="text-xs text-slate-300 truncate">
                              {other?.title || "Unknown"}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-slate-700 hover:text-red-400 hover:bg-red-900/20 shrink-0"
                            onClick={() => deleteEdge(edge.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ID */}
              <div className="text-[10px] font-mono text-slate-700 bg-[#0d1117] px-3 py-2 rounded-lg border border-[#30363d] flex justify-between">
                <span>ID</span>
                <span className="text-slate-600">{selectedNode.id.slice(0, 18)}...</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-[#30363d] shrink-0 bg-[#0d1117]/40">
              <Button
                variant="destructive"
                className="w-full bg-red-950/50 hover:bg-red-700 border border-red-500/40 text-red-300 hover:text-white font-medium text-sm h-9 transition-all"
                onClick={handleDelete}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Node
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
