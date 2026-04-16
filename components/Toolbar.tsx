"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RotateCcw,
  Search,
  BarChart2,
  Download,
  HelpCircle,
  Activity,
  Settings,
  Network,
  Menu,
  X,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGraphStore } from "@/store/useGraphStore";
import { AnalyticsModal } from "@/components/AnalyticsModal";
import { HelpModal } from "@/components/HelpModal";
import { SettingsModal } from "@/components/SettingsModal";

interface Props {
  onAddNode: () => void;
  onAddEdge: () => void;
  layoutDirection: "LR" | "TB";
  onLayoutChange: (dir: "LR" | "TB") => void;
  flowMode: boolean;
  onToggleFlow: () => void;
}

export function Toolbar({
  onAddNode,
  onAddEdge,
  layoutDirection,
  onLayoutChange,
  flowMode,
  onToggleFlow,
}: Props) {
  const { initGraph, nodes, edges, searchQuery, setSearchQuery, importGraph } =
    useGraphStore();

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleReset = () => {
    localStorage.removeItem("mindmesh-graph");
    initGraph();
  };

  const handleExport = () => {
    const data = { nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindmesh-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
            importGraph(parsed.nodes, parsed.edges);
          }
        } catch {
          alert("Invalid MindMesh JSON file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <header
        className="fixed top-0 w-full z-[100] flex items-center justify-between px-4 md:px-6"
        style={{
          height: "60px",
          backgroundColor: "rgba(13, 17, 23, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(34, 197, 94, 0.12)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-mm-green hover:bg-[#22c55e]/10"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/25">
              <Network className="w-4 h-4 text-[#22c55e]" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white">
                MindMesh
              </h1>
              <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                {nodes.length} nodes / {edges.length} edges
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 justify-center max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <Input
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 h-9 bg-[#161b22] border-[#30363d] text-slate-300 placeholder:text-slate-600 focus-visible:ring-[#22c55e]/40 focus-visible:border-[#22c55e]/50 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onAddNode}
            className="bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] border border-[#22c55e]/30 hover:border-[#22c55e]/50 h-8 px-3 rounded-lg font-medium text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Node
          </Button>
          <Button
            size="sm"
            onClick={onAddEdge}
            className="bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/25 hover:border-[#3b82f6]/40 h-8 px-3 rounded-lg font-medium text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Edge
          </Button>

          <div className="w-px h-5 bg-[#30363d] mx-1" />

          <Button
            variant="ghost"
            size="icon"
            title="Analytics"
            onClick={() => setAnalyticsOpen(true)}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-[#22c55e] hover:bg-[#22c55e]/10"
          >
            <BarChart2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Flow mode"
            onClick={onToggleFlow}
            className={`w-8 h-8 rounded-lg transition-colors ${
              flowMode
                ? "text-[#22c55e] bg-[#22c55e]/15"
                : "text-slate-500 hover:text-[#22c55e] hover:bg-[#22c55e]/10"
            }`}
          >
            <Activity className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Import JSON"
            onClick={handleImport}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#161b22]"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Export JSON"
            onClick={handleExport}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#161b22]"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Settings"
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#161b22]"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Help"
            onClick={() => setHelpOpen(true)}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#161b22]"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  title="Reset graph"
                  className="w-8 h-8 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-900/20"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              }
            />
            <AlertDialogContent className="bg-mm-surface border-[#30363d] text-slate-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This will clear all your nodes and edges and restore the
                  default seed graph. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent text-slate-400 border-[#30363d]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 border-0"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Mobile quick actions */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            size="icon"
            onClick={onAddNode}
            className="bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={onAddEdge}
            className="bg-[#3b82f6]/10 border border-[#3b82f6]/25 text-[#3b82f6] h-8 w-8"
          >
            <Activity className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-mm-surface border-r border-[#30363d] z-[120] p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#22c55e]" />
                  <span className="font-bold text-white">MindMesh</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#161b22] border-[#30363d] h-9 text-sm"
                />
              </div>

              <div className="space-y-1 flex-1">
                <Button
                  variant="ghost"
                  onClick={() => { setAnalyticsOpen(true); setMenuOpen(false); }}
                  className="w-full justify-start text-slate-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 text-sm"
                >
                  <BarChart2 className="w-4 h-4 mr-2.5" /> Analytics
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { onToggleFlow(); setMenuOpen(false); }}
                  className={`w-full justify-start text-sm ${
                    flowMode ? "text-[#22c55e]" : "text-slate-400"
                  }`}
                >
                  <Activity className="w-4 h-4 mr-2.5" /> Flow Mode
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { handleExport(); setMenuOpen(false); }}
                  className="w-full justify-start text-slate-400 text-sm"
                >
                  <Download className="w-4 h-4 mr-2.5" /> Export
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { handleImport(); setMenuOpen(false); }}
                  className="w-full justify-start text-slate-400 text-sm"
                >
                  <Upload className="w-4 h-4 mr-2.5" /> Import
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}
                  className="w-full justify-start text-slate-400 text-sm"
                >
                  <Settings className="w-4 h-4 mr-2.5" /> Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setHelpOpen(true); setMenuOpen(false); }}
                  className="w-full justify-start text-slate-400 text-sm"
                >
                  <HelpCircle className="w-4 h-4 mr-2.5" /> Help
                </Button>
              </div>

              <div className="pt-4 border-t border-[#30363d]">
                <Button
                  onClick={handleReset}
                  className="w-full bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-600 text-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset Graph
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnalyticsModal
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        layoutDirection={layoutDirection}
        onLayoutChange={onLayoutChange}
      />
    </>
  );
}
