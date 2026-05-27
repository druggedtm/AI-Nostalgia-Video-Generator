/**
 * AI Nostalgia Video Generator - TypeScript definitions
 */

export interface NostalgiaScene {
  number: number;
  title: string;
  era: string;
  focalSubject: string;
  lightingStyle: string;
  settingDetails: string;
  ambientMotion: string;
  colorGrading: string;
  cameraLanguage: string;
  textureReference: string;
  imagePrompt: string;
  videoPrompt: string;
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
