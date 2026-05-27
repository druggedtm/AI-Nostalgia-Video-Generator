/**
 * AI Nostalgia Video Generator - TypeScript definitions
 */

export interface NostalgiaScene {
  number: number;
  title: string;
  targetDevice: string;
  lightingSource: string;
  backgroundItems: string;
  microMovement: string;
  lightingChange: string;
  imagePrompt: string;
  videoPrompt: string;
  perspective?: "first-person" | "third-person" | "environmental";
}

export interface GeneratedResponse {
  scenes: NostalgiaScene[];
}

export interface SavedScene {
  id: string;
  decade: string;
  theme: string;
  scene: NostalgiaScene;
  savedAt: string;
  customNotes?: string;
}

export interface GeneratorPreset {
  id: string;
  label: string;
  decade?: string;
  theme?: string;
  icon: string;
  description: string;
}
