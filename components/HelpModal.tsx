"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MousePointer,
  Move,
  ZoomIn,
  Plus,
  Trash2,
  RotateCcw,
  Activity,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const actions = [
  {
    icon: <MousePointer className="w-3.5 h-3.5 text-[#22c55e]" />,
    action: "Click node",
    desc: "Select it and open the node editor panel.",
  },
  {
    icon: <MousePointer className="w-3.5 h-3.5 text-slate-500" />,
    action: "Click canvas",
    desc: "Deselect current node and clear highlights.",
  },
  {
    icon: <Move className="w-3.5 h-3.5 text-[#3b82f6]" />,
    action: "Drag node",
    desc: "Reposition node; location saves automatically.",
  },
  {
    icon: <ZoomIn className="w-3.5 h-3.5 text-[#a78bfa]" />,
    action: "Scroll wheel",
    desc: "Zoom the canvas in or out.",
  },
  {
    icon: <Plus className="w-3.5 h-3.5 text-[#22c55e]" />,
    action: "Node / Edge buttons",
    desc: "Add new nodes or connections to the graph.",
  },
  {
    icon: <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />,
    action: "Flow mode",
    desc: "Animate edges to visualize data flow direction.",
  },
  {
    icon: <Trash2 className="w-3.5 h-3.5 text-red-400" />,
    action: "Delete Node",
    desc: "Removes the node and all its edges.",
  },
  {
    icon: <RotateCcw className="w-3.5 h-3.5 text-red-500" />,
    action: "Reset Graph",
    desc: "Restore default seed data, clear storage.",
  },
];

export function HelpModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[440px] bg-[#161b22] border-[#30363d] text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#a78bfa]" />
            How to Use MindMesh
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          {actions.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#22c55e]/20 transition-colors"
            >
              <div className="mt-0.5 shrink-0">{a.icon}</div>
              <div>
                <p className="text-sm font-medium text-slate-200">{a.action}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-1 px-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-slate-500">
          All changes are saved automatically to{" "}
          <code className="text-[#22c55e] font-mono">localStorage</code>. No
          manual save needed.
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-[#a78bfa]/15 hover:bg-[#a78bfa]/25 border border-[#a78bfa]/30 text-[#a78bfa] font-medium h-9 text-sm"
        >
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
