"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGraphStore } from "@/store/useGraphStore";
import { Check, MoveRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEdgeModal({ isOpen, onClose }: Props) {
  const { addEdge, nodes } = useGraphStore();
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSourceId("");
      setTargetId("");
      setLabel("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!sourceId || !targetId) {
      setError("Select both a source and a target.");
      return;
    }
    if (sourceId === targetId) {
      setError("Source and target must be different nodes.");
      return;
    }
    addEdge(sourceId, targetId, label.trim() || "relates to");
    onClose();
  };

  const sourceNode = nodes.find((n) => n.id === sourceId);
  const targetNode = nodes.find((n) => n.id === targetId);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-[#161b22] border-[#30363d] text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center">
              <MoveRight className="w-3 h-3 text-[#3b82f6]" />
            </div>
            Create Connection
          </DialogTitle>
        </DialogHeader>

        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Live preview */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
          <div
            className={`flex-1 text-center py-2 px-3 rounded-lg border text-sm transition-all ${
              sourceId
                ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e] font-medium"
                : "bg-transparent border-dashed border-[#30363d] text-slate-600 italic"
            }`}
          >
            {sourceNode?.title || "Source"}
          </div>
          <MoveRight
            className={`w-4 h-4 shrink-0 ${
              sourceId && targetId ? "text-[#3b82f6]" : "text-[#30363d]"
            }`}
          />
          <div
            className={`flex-1 text-center py-2 px-3 rounded-lg border text-sm transition-all ${
              targetId
                ? "bg-[#3b82f6]/10 border-[#3b82f6]/30 text-[#3b82f6] font-medium"
                : "bg-transparent border-dashed border-[#30363d] text-slate-600 italic"
            }`}
          >
            {targetNode?.title || "Target"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-52 overflow-hidden">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold text-[#22c55e]">
              Source
            </Label>
            <div className="h-44 overflow-y-auto space-y-1 pr-1">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setSourceId(n.id); if (targetId === n.id) setTargetId(""); setError(""); }}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded-lg flex items-center justify-between transition-all ${
                    sourceId === n.id
                      ? "bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e]"
                      : "text-slate-400 hover:bg-[#30363d]/50 border border-transparent"
                  }`}
                >
                  <span className="truncate">{n.title}</span>
                  {sourceId === n.id && <Check className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold text-[#3b82f6]">
              Target
            </Label>
            <div className="h-44 overflow-y-auto space-y-1 pr-1">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  disabled={n.id === sourceId}
                  onClick={() => { setTargetId(n.id); setError(""); }}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded-lg flex items-center justify-between transition-all ${
                    targetId === n.id
                      ? "bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#3b82f6]"
                      : n.id === sourceId
                      ? "opacity-20 cursor-not-allowed border border-transparent"
                      : "text-slate-400 hover:bg-[#30363d]/50 border border-transparent"
                  }`}
                >
                  <span className="truncate">{n.title}</span>
                  {targetId === n.id && <Check className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Relationship Label
          </Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. depends on, extends, uses"
            className="bg-[#0d1117] border-[#30363d] text-slate-200 h-9 text-sm focus-visible:ring-[#3b82f6]/40 focus-visible:border-[#3b82f6]/50"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-sm h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!sourceId || !targetId}
            className={`font-medium text-sm h-9 px-5 transition-all ${
              sourceId && targetId
                ? "bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] border border-[#3b82f6]/40"
                : "bg-[#30363d] text-slate-600 border border-transparent cursor-not-allowed"
            }`}
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
