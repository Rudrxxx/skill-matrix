"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, CheckCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  layoutDirection: "LR" | "TB";
  onLayoutChange: (dir: "LR" | "TB") => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  layoutDirection,
  onLayoutChange,
}: Props) {
  const [dir, setDir] = useState<"LR" | "TB">(layoutDirection);

  const handleApply = () => {
    onLayoutChange(dir);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[380px] bg-[#161b22] border-[#30363d] text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#3b82f6]" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div>
            <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3 block">
              Layout Direction
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["LR", "TB"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setDir(option)}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all ${
                    dir === option
                      ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
                      : "border-[#30363d] bg-[#0d1117] text-slate-500 hover:border-[#30363d]/80"
                  }`}
                >
                  <div className="relative w-10 h-9 flex items-center justify-center">
                    {option === "LR" ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded border-[1.5px] border-current" />
                        <div className="w-4 h-px bg-current" />
                        <div className="w-3.5 h-3.5 rounded border-[1.5px] border-current" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded border-[1.5px] border-current" />
                        <div className="h-4 w-px bg-current" />
                        <div className="w-3.5 h-3.5 rounded border-[1.5px] border-current" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold">
                    {option === "LR" ? "Left to Right" : "Top to Bottom"}
                  </span>
                  {dir === option && (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#30363d] pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-slate-500 hover:text-slate-300 border border-[#30363d] h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#3b82f6]/15 hover:bg-[#3b82f6]/25 text-[#3b82f6] border border-[#3b82f6]/35 h-9 text-sm font-medium"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
