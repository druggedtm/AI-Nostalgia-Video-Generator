import React, { useState } from "react";
import { NostalgiaScene, SavedScene } from "../types";
import { Copy, Check, Tv, Sparkles, Sliders, RefreshCw, Bookmark, BookmarkCheck, FileText, Smartphone, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PromptCardProps {
  key?: React.Key;
  scene: NostalgiaScene;
  decade: string;
  theme: string;
  onSave: (scene: NostalgiaScene) => void;
  isSaved: boolean;
}

export default function PromptCard({ scene, decade, theme, onSave, isSaved }: PromptCardProps) {
  const [copiedImg, setCopiedImg] = useState(false);
  const [copiedVid, setCopiedVid] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  
  // Magic Live Preview states
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Creative Sandbox states: modifying variables locally
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [localDevice, setLocalDevice] = useState(scene.targetDevice);
  const [localLighting, setLocalLighting] = useState(scene.lightingSource);
  const [localItems, setLocalItems] = useState(scene.backgroundItems);
  const [localMovement, setLocalMovement] = useState(scene.microMovement);
  const [localLightChange, setLocalLightChange] = useState(scene.lightingChange);
  
  // Re-generate complete prompt formulas dynamically based on sandboxed values
  const getAssembledImagePrompt = () => {
    const perspective = scene.perspective || "first-person";
    if (perspective === "first-person") {
      return `A raw, photorealistic first-person POV shot looking through the character's own eyes—the scene is framed exactly as if the viewer is the character. Both forearms and wrists enter the frame from the bottom-left and bottom-right corners, gripping or interacting with ${localDevice}. The room is dimly lit by ${localLighting}. The background features ${localItems}. No part of the character's face, hair, shoulders, or side-profile is visible. The camera is locked inside the head at eye level, looking slightly downward at the hands. Shot on 35mm film with slight grain and an amateur, lived-in feel.`;
    } else if (perspective === "third-person") {
      return `A raw, photorealistic cinematic shot from a third-person perspective (such as over-the-shoulder or medium close-up) showing a person interacting with ${localDevice}. The person's shoulder, side of their head, or back of their head is partially in the frame, but their full face is obscured or in soft focus to keep it relatable. The room is dimly lit by ${localLighting}. The background features ${localItems}. Shot on 35mm film with slight grain, realistic textures, and a cozy, lived-in retro aesthetic.`;
    } else {
      return `A raw, photorealistic wide-angle or close-up still life shot capturing a nostalgic scene: ${localItems}, with ${localDevice} resting naturally as the focal point of the composition. The room is dimly lit by ${localLighting}, casting long, soft shadows and creating a cozy, atmospheric mood. Shot on 35mm film with slight grain, realistic textures, and a lived-in retro aesthetic.`;
    }
  };

  const getAssembledVideoPrompt = () => {
    const perspective = scene.perspective || "first-person";
    if (perspective === "first-person") {
      return `The camera gently sways with subtle breathing motion, slightly unsteady as if sitting naturally. The hands remain mostly stationary with only small, repetitive gestures—${localMovement}. The lighting ${localLightChange}. The motion remains grounded and natural—no dramatic movements, just the quiet, immersive feeling of someone deeply absorbed in a nostalgic moment.`;
    } else if (perspective === "third-person") {
      return `The camera has slow, natural handheld camera drift. The person is seen gently ${localMovement} with the ${localDevice}. The lighting ${localLightChange}. The motion remains atmospheric and grounded—a slow, nostalgic cinematic memory frozen in time.`;
    } else {
      return `The camera has extremely slow, cinematic pan or handheld float, revealing the details of the scene. The lighting ${localLightChange}. The motion remains quiet and atmospheric, with subtle ambient movement like ${localMovement}—a slow, nostalgic cinematic memory frozen in time.`;
    }
  };

  const handleCopyText = (text: string, setCopiedState: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleCopyScriptBundle = () => {
    const fullScript = `🎬 RETRO NOSTALGIA SCENE CONCEPT

Title: Scene ${scene.number} - ${scene.title}
Theme Focus: ${theme || decade}

📷 IMAGE PROMPT (Create Scene Background):
${getAssembledImagePrompt()}

🎥 VIDEO PROMPT (Animate Hands & Vibe):
${getAssembledVideoPrompt()}

🎵 RECOMMENDED SOUND/MUSIC OVERLAY:
"Low-fidelity warbling synthesizer tracks, muffled VHS dust crackling sounds, and high-frequency analog television whine."

📱 VIRAL POINTERS & HASHTAGS:
- Focus on subtle ambient movements or slow camera drifts.
- Caption Idea: "Remember when Friday afternoons felt like this? 🍂"
- Tags: #Nostalgia #Retro #Vintage #Cinematic #AIVideo #TikTokReels #RetroAesthetics #MemoryLane`;

    handleCopyText(fullScript, setCopiedScript);
  };

  // Triggers backend Imagen/Gemini 2.5 Image generation
  const handleGeneratePreview = async () => {
    setIsGeneratingImg(true);
    setPreviewError(null);
    setPreviewImage(null);

    try {
      const response = await fetch("/api/generate-image-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText: getAssembledImagePrompt() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation error");
      }

      setPreviewImage(data.imageData);
    } catch (err: any) {
      console.warn("Unable to generate live render. Using aesthetic retro styling CSS container instead.", err);
      setPreviewError(err.message || "Model failed / key limit. Prompt is perfectly safe and generated!");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const imagePromptText = getAssembledImagePrompt();
  const videoPromptText = getAssembledVideoPrompt();

  return (
    <motion.div
      id={`scene-card-${scene.number}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: scene.number * 0.1 }}
      className="bg-[#0f0f0f] border border-white/10 overflow-hidden shadow-2xl relative"
    >
      {/* Tape Roll Edge decoration */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-repeating-stripes opacity-25 pointer-events-none" />

      {/* Card Header */}
      <div className="bg-[#121212] p-5 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 pl-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-amber-500 font-mono text-xs tracking-tighter">
            SEQ_00{scene.number}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif italic text-white tracking-normal leading-tight">
            {scene.title}
          </h3>
          {scene.perspective === "third-person" && (
            <span className="inline-flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-mono uppercase font-semibold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(139,92,246,0.05)]">
              <Smartphone className="w-2.5 h-2.5 rotate-90" /> Cinematic (Third-Person)
            </span>
          )}
          {(scene.perspective === "first-person" || !scene.perspective) && (
            <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono uppercase font-semibold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              <Tv className="w-2.5 h-2.5" /> POV (First-Person)
            </span>
          )}
          {scene.perspective === "environmental" && (
            <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-mono uppercase font-semibold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.05)]">
              <Compass className="w-2.5 h-2.5" /> Environmental / Still-Life
            </span>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(scene)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-[11px] uppercase tracking-wider font-semibold transition-all ${
              isSaved
                ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:text-white hover:border-white/15"
            }`}
            title="Save for Concept Library"
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            {isSaved ? "Saved" : "Save Concept"}
          </button>

          <button
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className={`p-1.5 rounded border text-xs transition-all ${
              isSandboxOpen
                ? "bg-amber-500/15 border-amber-500/50 text-amber-500"
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:text-white"
            }`}
            title="Tweak Ingredients Sandbox"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Layout: Left is Details & Sandbox, Right is Prompt outputs and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Nostalgic Blueprint details */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-white/10 pl-8 bg-black/40">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-amber-500/70 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Historical Composition Variables
          </h4>

          {/* Variables Stack */}
          <div className="space-y-4">
            <div className="p-3 bg-neutral-900/40 rounded border border-white/5">
              <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1">🎮 Cultural Target Device</span>
              <p className="text-neutral-300 text-sm font-medium">{localDevice}</p>
            </div>

            <div className="p-3 bg-neutral-900/40 rounded border border-white/5">
              <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1">💡 Ambient Light Source</span>
              <p className="text-neutral-300 text-sm font-medium">{localLighting}</p>
            </div>

            <div className="p-3 bg-neutral-900/40 rounded border border-white/5">
              <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1">📦 Background Scattered Relics</span>
              <p className="text-neutral-300 text-sm font-medium">{localItems}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-900/40 rounded border border-white/5">
                <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1">🖐️ Breathing Micro-Action</span>
                <p className="text-neutral-300 text-xs font-light">{localMovement}</p>
              </div>
              <div className="p-3 bg-neutral-900/40 rounded border border-white/5">
                <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1">⚡ Dynamic Aura Shift</span>
                <p className="text-neutral-300 text-xs font-light">{localLightChange}</p>
              </div>
            </div>
          </div>

          {/* Sandbox Editor Toggled */}
          <AnimatePresence>
            {isSandboxOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 pt-5 border-t border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-mono font-bold text-amber-500/80 uppercase">🔬 Prompt Refiner Sandbox</h5>
                  <button 
                    onClick={() => {
                      setLocalDevice(scene.targetDevice);
                      setLocalLighting(scene.lightingSource);
                      setLocalItems(scene.backgroundItems);
                      setLocalMovement(scene.microMovement);
                      setLocalLightChange(scene.lightingChange);
                    }}
                    className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Revert Variables
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Target Object / Device:</label>
                    <input
                      type="text"
                      value={localDevice}
                      onChange={(e) => setLocalDevice(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Lighting Source & Tone:</label>
                    <input
                      type="text"
                      value={localLighting}
                      onChange={(e) => setLocalLighting(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Background Relics:</label>
                    <input
                      type="text"
                      value={localItems}
                      onChange={(e) => setLocalItems(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block mb-1">Micro Gesture:</label>
                      <input
                        type="text"
                        value={localMovement}
                        onChange={(e) => setLocalMovement(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-white text-[11px] focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">Lighting Change:</label>
                      <input
                        type="text"
                        value={localLightChange}
                        onChange={(e) => setLocalLightChange(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-white text-[11px] focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Render Prompts & Live Negative View */}
        <div className="p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Image Prompt Display */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                  📸 Image Prompt Formula
                </span>
                <button
                  onClick={() => handleCopyText(imagePromptText, setCopiedImg)}
                  className="text-neutral-400 hover:text-amber-500 text-[10px] uppercase tracking-wider flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedImg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10 text-xs text-neutral-300 font-mono leading-relaxed select-all hover:border-white/20 transition-colors h-24 overflow-y-auto scrollbar-thin">
                {imagePromptText}
              </div>
            </div>

            {/* Video Prompt Display */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                  🎥 Video Prompt / Animation Formula
                </span>
                <button
                  onClick={() => handleCopyText(videoPromptText, setCopiedVid)}
                  className="text-neutral-400 hover:text-amber-500 text-[10px] uppercase tracking-wider flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedVid ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10 text-xs text-neutral-300 font-mono leading-relaxed select-all hover:border-white/20 transition-colors h-24 overflow-y-auto scrollbar-thin">
                {videoPromptText}
              </div>
            </div>

          </div>

          {/* Magic Frame & Generation */}
          <div className="border border-white/10 rounded bg-[#0a0a0a] p-4 space-y-4">
            
            {/* Visual Screen Container */}
            <div className="relative aspect-video rounded overflow-hidden bg-[#121212] border border-white/5 flex flex-col items-center justify-center text-center">
              
              {/* Retro Viewport Grid Overlay */}
              <div className="absolute inset-0 bg-retro-scanlines opacity-25 pointer-events-none" />

              <AnimatePresence mode="wait">
                {isGeneratingImg ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2 p-4 text-center z-10"
                  >
                    <Tv className="w-6 h-6 text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">DEVELOPING 35MM REELS...</span>
                    {/* Retro Progress bar animation */}
                    <div className="w-32 h-[1px] bg-neutral-900 overflow-hidden mt-1 col-span-2">
                      <div className="h-full bg-amber-500 animate-loading-bar" />
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">via gemini-2.5-flash-image</span>
                  </motion.div>
                ) : previewImage ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full relative"
                  >
                    <img
                      src={previewImage}
                      alt="Nostalgic visual scene render"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 text-[9px] font-mono text-amber-500">
                      RETRO ENGINE ACTIVE RENDER 1.0
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 flex flex-col items-center gap-1.5 text-center text-neutral-500"
                  >
                    <Tv className="w-8 h-8 stroke-[1.5] text-neutral-700" />
                    <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Retro CRT Screen Viewport</p>
                    <p className="text-[11px] text-neutral-500 max-w-xs leading-normal">
                      Click below to generate an AI visual drafting frame of this scene composition.
                    </p>
                    {previewError && (
                      <div className="mt-1 px-2 py-0.5 rounded bg-red-950/40 border border-red-900/40 text-[9px] text-red-400 font-mono">
                        {previewError}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Render and Script copy controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleGeneratePreview}
                disabled={isGeneratingImg}
                className="flex-1 min-w-[150px] bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3.5 py-2 rounded text-[11px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                {previewImage ? "Regenerate Render" : "Generate Draft Preview"}
              </button>

              <button
                onClick={handleCopyScriptBundle}
                className="bg-neutral-900 hover:bg-neutral-800 text-white border border-white/5 px-3.5 py-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy ready-to-post script with visual hashtags & specs"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500">Copied Bundle</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Reels Bundle</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}
