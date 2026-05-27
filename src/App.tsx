/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NostalgiaScene, SavedScene } from "./types";
import { 
  DECADE_PRESETS, 
  THEME_PRESETS, 
  AUDIENCE_PRESETS, 
  REGION_PRESETS, 
  RETRO_LOADING_PHRASES 
} from "./data";
import PromptCard from "./components/PromptCard";
import SavedDrawer from "./components/SavedDrawer";
import { 
  Tv, 
  Sparkles, 
  HelpCircle, 
  Heart, 
  ListChecks, 
  Layers, 
  ArrowRight, 
  Play, 
  Compass, 
  RefreshCw, 
  Check, 
  Info, 
  Clock 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Option selection states
  const [selectedDecade, setSelectedDecade] = useState<string | null>("1990s");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("millennials");
  const [selectedRegion, setSelectedRegion] = useState<string>("us_canada");

  // Core generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<NostalgiaScene[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Loading screen sub-state
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Saved workspace states
  const [savedScenes, setSavedScenes] = useState<SavedScene[]>([]);

  // Local clock state to make the board feel immersive
  const [currentTime, setCurrentTime] = useState("");

  // Populate loading text cycling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % RETRO_LOADING_PHRASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Immersive clock updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading progress percentage mock ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingProgress(0);
      const tick = () => {
        setLoadingProgress((prev) => {
          if (prev >= 98) return prev;
          const inc = Math.floor(Math.random() * 8) + 3;
          return Math.min(prev + inc, 98);
        });
      };
      timer = setInterval(tick, 400);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Load Saved elements on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nostalgia_saved_scenes");
      if (stored) {
        setSavedScenes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved scenes:", e);
    }
  }, []);

  // Set default initial scenes on load if empty
  useEffect(() => {
    // Inject custom starter concepts so the app has high-quality initial layout before first API trigger
    setScenes([
      {
        number: 1,
        title: "The Super Nintendo Battle",
        era: "1990s",
        focalSubject: "a group of friends laughing while gathered around a wood-paneled Curtis Mathes CRT television screen, playing Super Nintendo",
        lightingStyle: "the heavy scanlines and violet flickering cathode-ray glow of a CRT television screen",
        settingDetails: "cluttered bedroom floor scattered with SNES cartridge boxes, a half-empty glass bottle of orange slice soda, and vintage posters",
        ambientMotion: "dust motes slowly floating in the cathode ray beam, with fingers furiously clicking the action buttons",
        colorGrading: "warm amber highlights, matte shadows, and faded film contrast",
        cameraLanguage: "candid handheld camcorder view from a low angle",
        textureReference: "Kodak Gold 200 film grain and soft lens diffusion",
        imagePrompt: "A raw, photorealistic candid shot capturing an emotionally authentic scene from the 1990s: showing a group of friends laughing while gathered around a wood-paneled Curtis Mathes CRT television screen, playing Super Nintendo. The setting features cluttered bedroom floor scattered with SNES cartridge boxes, a half-empty glass bottle of orange slice soda, and vintage posters. The composition is shot with candid handheld camcorder view from a low angle on 35mm film with Kodak Gold 200 film grain and soft lens diffusion. The scene is illuminated by the heavy scanlines and violet flickering cathode-ray glow of a CRT television screen, casting warm amber highlights, matte shadows, and faded film contrast across the frame. Film softness, dreamlike memory realism, and low digital sharpness.",
        videoPrompt: "The camera has candid handheld camcorder view from a low angle drift. The scene has subtle ambient movement: dust motes slowly floating in the cathode ray beam, with fingers furiously clicking the action buttons. The lighting warm amber highlights, matte shadows, and faded film contrast. The video preserves Kodak Gold 200 film grain and soft lens diffusion texture, feeling like a faded family memory."
      },
      {
        number: 2,
        title: "Blockbuster VHS Rentals",
        era: "1980s",
        focalSubject: "a family browsing rental tapes inside a brightly lit Blockbuster video store",
        lightingStyle: "the glowing blue checkout lane halogen lamps mixing with the warm golden hour afternoon sun through glass panels",
        settingDetails: "towering racks of black plastic VHS cases, cardboard movie sleeves, and a checkout scan-beeper counter",
        ambientMotion: "checkout scanner laser flashing red, with hands holding tape boxes",
        colorGrading: "Spielberg-inspired wonder, dreamy warm highlights, and slightly sun-faded colors",
        cameraLanguage: "observational over-the-shoulder perspective",
        textureReference: "faded VHS tape artifacts and analog broadcast softness",
        imagePrompt: "A raw, photorealistic candid shot capturing an emotionally authentic scene from the 1980s: showing a family browsing rental tapes inside a brightly lit Blockbuster video store. The setting features towering racks of black plastic VHS cases, cardboard movie sleeves, and a checkout scan-beeper counter. The composition is shot with observational over-the-shoulder perspective on 35mm film with faded VHS tape artifacts and analog broadcast softness. The scene is illuminated by the glowing blue checkout lane halogen lamps mixing with the warm golden hour afternoon sun through glass panels, casting Spielberg-inspired wonder, dreamy warm highlights, and slightly sun-faded colors across the frame. Film softness, dreamlike memory realism, and low digital sharpness.",
        videoPrompt: "The camera has observational over-the-shoulder perspective drift. The scene has subtle ambient movement: checkout scanner laser flashing red, with hands holding tape boxes. The lighting Spielberg-inspired wonder, dreamy warm highlights, and slightly sun-faded colors. The video preserves faded VHS tape artifacts and analog broadcast softness texture, feeling like a faded family memory."
      }
    ]);
  }, []);

  // Post Request to generate 5 scenes from Gemini server
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorStatus(null);
    setLoadingProgress(5);

    const dataPayload = {
      decade: customTheme ? null : selectedDecade,
      theme: customTheme || null,
      audience: AUDIENCE_PRESETS.find(a => a.id === selectedAudience)?.label,
      country: REGION_PRESETS.find(r => r.id === selectedRegion)?.label
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPayload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to contact generator backend.");
      }

      if (result.scenes && result.scenes.length > 0) {
        setScenes(result.scenes);
        setSelectedDecade(selectedDecade);
      } else {
        throw new Error("No scenes were returned. Try tweaking your custom prompt!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "A network error occurred. Please verify your settings and retry.");
    } finally {
      setIsGenerating(false);
      setLoadingProgress(100);
    }
  };

  const handleSaveScene = (scene: NostalgiaScene) => {
    const isAlreadySaved = savedScenes.some(s => s.scene.imagePrompt === scene.imagePrompt);
    let updated: SavedScene[] = [];
    
    if (isAlreadySaved) {
      updated = savedScenes.filter(s => s.scene.imagePrompt !== scene.imagePrompt);
    } else {
      const newItem: SavedScene = {
        id: `save-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        decade: selectedDecade || "",
        theme: customTheme || "Custom Nostalgic Scene",
        scene,
        savedAt: new Date().toISOString()
      };
      updated = [newItem, ...savedScenes];
    }
    
    setSavedScenes(updated);
    localStorage.setItem("nostalgia_saved_scenes", JSON.stringify(updated));
  };

  const handleClearSaved = () => {
    if (window.confirm("Are you sure you want to discard your entire concept roll?")) {
      setSavedScenes([]);
      localStorage.removeItem("nostalgia_saved_scenes");
    }
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedScenes.filter(s => s.id !== id);
    setSavedScenes(updated);
    localStorage.setItem("nostalgia_saved_scenes", JSON.stringify(updated));
  };

  const isSceneSaved = (scene: NostalgiaScene) => {
    return savedScenes.some(s => s.scene.imagePrompt === scene.imagePrompt);
  };

  // Direct quick select theme loader
  const handleSelectThemePreset = (themePreset: any) => {
    setCustomTheme(themePreset.theme);
    setSelectedDecade(null);
  };

  return (
    <div className="bg-[#0a0a0a] text-neutral-300 min-h-screen selection:bg-amber-500 selection:text-neutral-900 pb-20 font-sans relative">
      
      {/* Dynamic Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-retro-scanlines opacity-[0.03]" />

      {/* Retro Signal Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-black font-black italic shadow-lg shadow-amber-500/10">
              N
            </div>
             <div>
               <div className="flex items-center gap-2">
                 <h1 className="font-serif text-lg sm:text-xl font-light tracking-widest text-white uppercase">
                   Memory-Engine <span className="text-amber-500 font-sans text-[10px] align-top tracking-normal ml-2 opacity-70">CINEMATIC GENERATOR v3.0</span>
                 </h1>
               </div>
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Universal Cinematic & Retro Memory Workspace</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold">
              <span className="text-amber-500 cursor-pointer">Generator</span>
              <span className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Archive</span>
              <span className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Demographics</span>
              <span className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Settings</span>
            </div>

            {/* Immersive HUD data */}
            <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
              <div className="hidden sm:block text-[10px]">
                <span className="text-neutral-500">SEQ_</span>
                <span className="text-amber-500 font-bold">001_ACTIVE</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span className="text-[11px] font-mono">{currentTime || "00:00:00"}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* Banner */}
        <div className="bg-[#0f0f0f] border border-white/10 p-6 sm:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-amber-500 via-yellow-500 to-transparent opacity-40" />
          
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase font-semibold px-2.5 py-0.5 rounded">
              <Sparkles className="w-3 h-3" /> Universal Nostalgia Director Blueprint
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-white tracking-normal leading-tight">
              The Saturday Morning Ritual
            </h2>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              A crisp, statics-charged memory where world scales are small, warm, and highly focused.
              These parameters generate high-fidelity, demographically tuned image and video instructions tailored for nostalgic content creators.
            </p>
          </div>

          <div className="md:ml-auto flex items-center justify-center bg-[#0a0a0a] p-4 border border-white/5 min-w-[200px] text-center shrink-0">
            <div className="space-y-1">
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Active Models</p>
              <p className="text-xs font-bold text-neutral-300 font-mono">Gemini 3.5 Flash</p>
              <div className="h-[1px] bg-white/5 my-2" />
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Render Anchor</p>
              <p className="text-[11px] text-amber-500 font-mono">Gemini 2.5 Image</p>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Main Controllers & Generated Output */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The Control Desk Container */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
              
              <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm uppercase tracking-widest text-neutral-400 font-mono">Generation Parameters</h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Configure Focus</span>
              </div>

              {/* Decide Decades OR custom theme */}
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-3">
                    Target Decade Group
                  </label>
                  
                  {/* Decade buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {DECADE_PRESETS.map((dec) => (
                      <button
                        key={dec.id}
                        onClick={() => {
                          setSelectedDecade(dec.id);
                          setCustomTheme(""); // clear custom
                        }}
                        className={`p-3 rounded border text-center flex flex-col items-center justify-center gap-1 transition-all text-xs cursor-pointer ${
                          selectedDecade === dec.id
                            ? "bg-amber-500/10 border-amber-500 text-amber-500 font-semibold"
                            : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/15 hover:text-neutral-200"
                        }`}
                        title={dec.description}
                      >
                        <span className="text-lg">{dec.icon}</span>
                        <span className="font-mono tracking-wider">{dec.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme suggestions */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Select a Quick Theme Hook Blueprint:
                    </span>
                    {customTheme && (
                      <button
                        onClick={() => setCustomTheme("")}
                        className="text-[10px] text-amber-500 hover:text-amber-400 font-mono uppercase tracking-wider"
                      >
                        Reset Theme Hook
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1.5 scrollbar-thin">
                    {THEME_PRESETS.map((themePreset) => (
                      <button
                        key={themePreset.id}
                        onClick={() => handleSelectThemePreset(themePreset)}
                        className={`p-2.5 rounded border text-left flex items-start gap-3 transition-all text-xs cursor-pointer ${
                          customTheme === themePreset.theme
                            ? "bg-amber-500/15 border-amber-500/60 text-amber-500"
                            : "bg-[#0a0a0a] border-white/5 text-neutral-400 hover:border-white/10"
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{themePreset.icon}</span>
                        <div className="truncate">
                          <p className="font-serif italic text-neutral-200 font-semibold leading-tight truncate">{themePreset.label}</p>
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">{themePreset.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom input box */}
                <div className="bg-[#0a0a0a]/80 p-4 rounded border border-white/5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mix custom triggers (e.g., slurping a blue slushee in 1993, holding a Nokia 3310...)"
                      value={customTheme}
                      onChange={(e) => {
                        setCustomTheme(e.target.value);
                        setSelectedDecade(null); // disable rigid decade selection
                      }}
                      className="flex-1 bg-neutral-900 border border-white/10 rounded py-2 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-0"
                    />
                  </div>
                  <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider mt-2 block">
                    Custom triggers bypass static decade scopes and refine historical contextual features.
                  </p>
                </div>

                {/* Dropdowns details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                      Target Audience Archetype
                    </label>
                    <select
                      value={selectedAudience}
                      onChange={(e) => setSelectedAudience(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-neutral-300 py-2 px-3 rounded text-xs font-mono focus:outline-none focus:border-amber-500/50"
                    >
                      {AUDIENCE_PRESETS.map(aud => (
                        <option key={aud.id} value={aud.id} className="bg-neutral-950">
                          {aud.icon} {aud.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                      Regional Dialect Flavor
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-neutral-300 py-2 px-3 rounded text-xs font-mono focus:outline-none focus:border-amber-500/50"
                    >
                      {REGION_PRESETS.map(reg => (
                        <option key={reg.id} value={reg.id} className="bg-neutral-950">
                          {reg.code} {reg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Launch Ticker Engine */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-black ${isGenerating ? 'animate-spin' : ''}`} />
                  Generate Nostalgic Sequence
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>

            </div>

            {/* ERROR Display */}
            {errorStatus && (
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/50 text-xs font-mono text-red-400 leading-relaxed">
                <span className="font-bold uppercase tracking-wider block mb-1">⚠️ GENERATOR SUBSYSTEM REPORT:</span>
                {errorStatus}
              </div>
            )}
            {/* Immersive Loading Sequence overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                >
                  {/* CRT Line Simulator */}
                  <div className="absolute inset-0 bg-retro-scanlines opacity-20 pointer-events-none" />

                  <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-spin">
                      <div className="w-13 h-13 rounded-full bg-[#0d0d0d] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-md">
                      <p className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
                        <span className="inline-block w-2 bg-amber-500 aspect-square rounded-full shrink-0" />
                        CALIBRATING ANALOG MATRIX ... {loadingProgress}%
                      </p>
                      
                      {/* Beautiful Retro Bar */}
                      <div className="w-64 h-1 bg-[#0a0a0a] rounded-full overflow-hidden border border-white/5 mx-auto">
                        <div 
                           className="h-full bg-amber-500 transition-all duration-300"
                           style={{ width: `${loadingProgress}%` }}
                        />
                      </div>

                      <p className="text-white font-serif italic text-sm h-6 overflow-hidden">
                        {RETRO_LOADING_PHRASES[loadingMsgIndex]}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                        Sending prompt parameters via deep server-side Gemini 3.5 AI...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scene Cards List on Success */}
            {!isGenerating && scenes.length > 0 && (
              <div className="space-y-8">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-amber-500" /> Active Storyboard Sequence
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    5 High-Fidelity Chapters
                  </span>
                </div>

                <div className="space-y-6">
                  {scenes.map((scene) => (
                    <PromptCard
                      key={scene.number}
                      scene={scene}
                      decade={selectedDecade || ""}
                      theme={customTheme || ""}
                      onSave={handleSaveScene}
                      isSaved={isSceneSaved(scene)}
                    />
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Column 3: Saved Workspace & Viral Playbook */}
          <div className="space-y-6">
            
            {/* Saved concept rolls library */}
            <SavedDrawer
              savedScenes={savedScenes}
              onRemove={handleRemoveSaved}
              onClearAll={handleClearSaved}
            />

            {/* Playbook instructions */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
              
              <h3 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Director's Viral Guidebook
              </h3>

              <div className="space-y-4 text-xs font-mono text-neutral-400">
                <p className="leading-relaxed">
                  How top creators turn these detailed prompts into multi-million viewer viral clips:
                </p>

                <div className="space-y-3.5">
                  <div className="flex gap-2.5 items-start">
                    <span className="bg-neutral-900 border border-white/5 text-[9px] px-1.5 py-0.5 text-amber-500 font-bold shrink-0">1</span>
                    <p className="leading-normal text-[11px]">
                      Copy the <span className="text-white font-serif italic">Image Prompt Matrix</span> from any card.
                    </p>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="bg-neutral-900 border border-white/5 text-[9px] px-1.5 py-0.5 text-amber-500 font-bold shrink-0">2</span>
                    <p className="leading-normal text-[11px]">
                      Feed it to an image engine (Midjourney v6, FLUX, or DALL-E) to render the base film frame with analog grain.
                    </p>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="bg-neutral-900 border border-white/5 text-[9px] px-1.5 py-0.5 text-amber-500 font-bold shrink-0">3</span>
                    <p className="leading-normal text-[11px]">
                      Use the render as a <strong className="text-white font-medium">starting keyframe</strong> inside Luma Dream Machine, Kling AI, or Runway Gen-3.
                    </p>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="bg-neutral-900 border border-white/5 text-[9px] px-1.5 py-0.5 text-amber-500 font-bold shrink-0">4</span>
                    <p className="leading-normal text-[11px]">
                      Inject the <span className="text-white font-serif italic">Video Prompt Matrix</span> into description controllers to restrict movement strictly to micro-gesturing.
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 my-4" />

                <div className="bg-[#0a0a0a] p-3 border border-white/5 rounded">
                  <span className="text-[9px] font-bold text-amber-500 uppercase flex items-center gap-1 mb-1">
                    <Info className="w-3 h-3" /> DIRECTING SECRET
                  </span>
                  <p className="text-[11px] leading-relaxed text-neutral-500 font-sans font-light">
                    Video generators hold objects best when hands remain stationary. Focus on the slow shift of background static and flickering CRT light reflections.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer info */}
      <footer className="mt-20 border-t border-white/10 bg-[#0f0f0f] py-10 px-6 sm:px-12 text-center text-[10px] font-mono text-neutral-500 space-y-3">
        <div className="flex items-center justify-center gap-2 text-neutral-400">
          <Tv className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-serif tracking-widest text-xs uppercase text-white font-light">Cinematic Memory-Engine Suite</span>
        </div>
        <p className="font-light max-w-xl mx-auto">Designed with Gemini AI Server-Side assistance. Programmed on custom elegant dark structures using Playfair Display, Inter, and JetBrains Mono pairing.</p>
        <p className="text-neutral-600 tracking-widest uppercase">STATION INTEGRATION 3000 • DEPLOYED • MEMORY BLUEPRINT v3.0</p>
      </footer>

    </div>
  );
}
