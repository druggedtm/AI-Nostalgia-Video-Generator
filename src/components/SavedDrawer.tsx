import React, { useState } from "react";
import { SavedScene, NostalgiaScene } from "../types";
import { Trash2, Copy, Bookmark, Calendar, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SavedDrawerProps {
  savedScenes: SavedScene[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedDrawer({ savedScenes, onRemove, onClearAll }: SavedDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-sm p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500" />
          <h3 className="text-lg font-serif italic text-white leading-none">Saved Concept Rolls</h3>
          <span className="bg-[#0a0a0a] text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded border border-white/5">
            {savedScenes.length}
          </span>
        </div>
        
        {savedScenes.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] text-red-500 hover:text-red-400 transition-colors font-mono uppercase tracking-widest"
          >
            Clear All
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {savedScenes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 border border-dashed border-white/10 rounded"
          >
            <Bookmark className="w-6 h-6 text-neutral-700 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">No concepts saved yet</p>
            <p className="text-neutral-500 text-xs px-4 mt-1.5 leading-relaxed font-sans">
              Click "Save Concept" on any generated scene card above to queue it in your workspace drawer!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1.5 scrollbar-thin">
            {savedScenes.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#121212] border border-white/5 p-4 rounded space-y-3 relative group"
              >
                {/* Meta details */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-wider mr-2">
                      Scene {item.scene.number}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      {item.decade || "Custom theme"}
                    </span>
                    <h4 className="text-neutral-200 text-sm font-bold mt-1.5 tracking-tight font-serif italic text-white">
                      {item.scene.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, `📷 IMAGE PROMPT:\n${item.scene.imagePrompt}\n\n🎥 VIDEO PROMPT:\n${item.scene.videoPrompt}`)}
                      className="text-neutral-400 hover:text-white p-1.5 hover:bg-white/5 rounded transition-colors"
                      title="Copy Prompts Suite"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 hover:bg-white/5 rounded transition-colors"
                      title="Discard Saved Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Micro-summarization */}
                <div className="text-xs text-neutral-400 bg-[#0a0a0a] p-2 rounded border border-white/5 leading-normal">
                  <span className="text-neutral-500 font-mono text-[9px] uppercase block mb-0.5 tracking-wide">Holding focus:</span>
                  {item.scene.focalSubject}
                </div>

                {/* Timeline info */}
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                  <Calendar className="w-3 h-3 text-neutral-600" />
                  <span>{formatDate(item.savedAt)}</span>
                  {item.theme && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="truncate max-w-[150px]" title={item.theme}>
                        Theme: {item.theme}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
