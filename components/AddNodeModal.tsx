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
import { Textarea } from "@/components/ui/textarea";
import { useGraphStore } from "@/store/useGraphStore";
import { Plus, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddNodeModal({ isOpen, onClose }: Props) {
  const addNode = useGraphStore((s) => s.addNode);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setNote("");
      setTagInput("");
      setTags([]);
      setError("");
    }
  }, [isOpen]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    addNode(title.trim(), note, tags);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[420px] bg-[#161b22] border-[#30363d] text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center">
              <Plus className="w-3 h-3 text-[#22c55e]" />
            </div>
            Add Node
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="nm-title" className="text-[10px] text-slate-500 uppercase tracking-widest">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="nm-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setError(""); }}
              placeholder="e.g. Gradient Descent"
              className={`bg-[#0d1117] border-[#30363d] text-slate-200 h-9 text-sm focus-visible:ring-[#22c55e]/40 focus-visible:border-[#22c55e]/50 ${
                error ? "border-red-500/60" : ""
              }`}
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nm-note" className="text-[10px] text-slate-500 uppercase tracking-widest">
              Notes (optional)
            </Label>
            <Textarea
              id="nm-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What does this concept mean?"
              className="bg-[#0d1117] border-[#30363d] text-slate-300 min-h-[90px] text-sm resize-none focus-visible:ring-[#22c55e]/40 focus-visible:border-[#22c55e]/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] text-slate-500 uppercase tracking-widest">
              Tags (optional)
            </Label>
            <div className="flex gap-1.5">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="e.g. optimization"
                className="bg-[#0d1117] border-[#30363d] text-slate-300 h-8 text-xs"
              />
              <Button
                size="sm"
                onClick={addTag}
                className="h-8 px-3 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/25 text-xs"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[10px] font-mono"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
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
            className="bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] border border-[#22c55e]/40 font-medium text-sm h-9 px-5"
          >
            Create Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
