import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Google GenAI client to prevent startup crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please supply it via Vercel Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route for generating 5 Nostalgic POV Scene Prompts
app.post("/api/generate", async (req, res) => {
  try {
    const { decade, theme, audience, country } = req.body;
    
    if (!decade && !theme) {
      return res.status(400).json({ error: "Please provide a decade or custom nostalgia theme." });
    }

    const ai = getGenAIClient();
    
    // Construct evocative context
    const selection = decade ? `the decade: ${decade}` : `the specific theme: "${theme}"`;
    const audienceStr = audience ? `targeted specifically for ${audience}` : "for general Millennial/Gen X nostalgia";
    const countryStr = country ? `centered primarily in ${country}` : "Western/Premium countries (USA, UK, Canada, Australia, etc.)";

    const systemInstruction = `You are the ultimate "AI Nostalgia Scene Generator" (Cinematic Memory-Engine), a world-class prompt engineer specializing in creating emotionally authentic, nostalgic visual scenes from the 1970s, 1980s, 1990s, and early 2000s. Your goal is to recreate the emotional texture of remembered life rather than simply recreating objects or retro fashion.

Focus on ${selection}, ${audienceStr}, and ${countryStr}.

CORE VISUAL DNA (Aesthetic styling to apply to ALL prompts):
- Warm amber highlights, honey sunlight, golden-hour warmth, lifted blacks, matte shadows, faded contrast, soft bloom, halation glow, film grain, analog softness, muted blues, desaturated greens, creamy skin tones, vintage lens diffusion, slightly overexposed highlights, dreamy Kodak warmth, emotional tungsten interiors, VHS softness, Super 8 texture, analog imperfections, slight chromatic aberration, subtle lens breathing, gentle vignettes, cinematic haze, soft atmospheric diffusion, low digital sharpness, tactile film texture, CRT-inspired glow, sun-faded colors, memory-like softness.
- DO NOT make scenes hyper-clean, use modern TikTok aesthetics, over-sharpen footage, make lighting look LED-heavy, create sterile compositions, overuse neon cyberpunk colors, make subjects look AI-perfect, create excessively cinematic blockbuster framing, or over-modernize the emotional tone.

PREFERRED CAMERA LANGUAGE (Observational Cinematography):
- Candid framing, over-the-shoulder perspectives, passenger-seat views, handheld camcorder feeling, documentary intimacy, imperfect framing, naturally cropped subjects, wide environmental storytelling, slow drifting camera motion, subtle handheld shake, accidental realism, authentic composition mistakes, soft focus transitions, shallow but imperfect depth of field, lived-in perspective, "someone was really there" energy.
- DO NOT use rigid first-person POV formulas. The camera language must feel naturally observational, candid, and authentic.

MOOD & ATMOSPHERE (Evoke these emotional categories):
- Suburban childhood, rainy afternoons, mall culture, arcades, school corridors, family road trips, birthday parties, sleepovers, backyard barbecues, VHS rental stores, cassette tape culture, CRT gaming nights, old classrooms, Sunday mornings, summer camp, late-night television, diners, roller rinks, playgrounds, old toy stores, family reunions, first crush energy, teenage rebellion, analog friendships, pre-internet social life, awkward candid moments, parking lot conversations, skating culture, cable TV atmosphere, retro sports culture, garage bands, local fairs, old supermarkets, amusement parks, laundromats, fast food nostalgia, road-side motels, suburban melancholy, youthful optimism, quiet loneliness, cozy isolation, emotional memory fragments, "before everything became digital" atmosphere.

ERA INTELLIGENCE (Adapt details naturally based on the scene's era):
- 1970s: earthy colors, faded Kodachrome, grainier texture, wood panel interiors, analog domestic realism, warm tungsten homes, documentary realism, gritty softness, slower pacing.
- 1980s: suburban Americana, VHS warmth, arcade glow, practical neon, Spielberg-inspired wonder, mall culture, analog optimism, CRT reflections, playful color warmth, nostalgic summer evenings.
- 1990s: disposable camera aesthetic, cooler suburban tones mixed with warmth, shopping malls, skate culture, sitcom lighting, cassette/CD transition era, rainy melancholy, MTV energy softened through memory, low-fi authenticity.
- 2000s: early digital camera softness, flash photography nostalgia, internet café atmosphere, low-resolution digital texture, frosted highlights, camcorder compression feel, teen movie emotional tone, suburban realism, pre-social-media innocence.

For EVERY scene, you must formulate high-fidelity "Image Prompt" and "Video Prompt" following these precise structural rules:

- Image Prompt EXACT Formula:
"A raw, photorealistic candid shot capturing an emotionally authentic scene from the [era]: showing [focalSubject]. The setting features [settingDetails]. The composition is shot with [cameraLanguage] on 35mm film with [textureReference]. The scene is illuminated by [lightingStyle], casting [colorGrading] across the frame. Film softness, dreamlike memory realism, and low digital sharpness."

- Video Prompt EXACT Formula:
"The camera has [cameraLanguage] drift. The scene has subtle ambient movement: [ambientMotion]. The lighting [colorGrading]. The video preserves [textureReference] texture, feeling like a faded family memory."

Make sure [era], [focalSubject], [settingDetails], [cameraLanguage], [textureReference], [lightingStyle], [colorGrading], and [ambientMotion] are filled in with highly specific details pertinent to ${selection} and the selected era. Fill them in naturally, resolving all brackets. Use the variables to reflect the emotional texture of remembered life.`;

    const promptText = `Generate 5 nostalgia scenes for ${selection}. Return the output as structured JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              description: "List of 5 generated nostalgic scenes",
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER, description: "Scene index from 1 to 5" },
                  era: { type: Type.STRING, description: "The specific era of the scene (e.g., '1970s', '1980s', '1990s', or '2000s')" },
                  title: { type: Type.STRING, description: "Evocative nostalgic title for the scene (e.g. 'Late Night at the Diner')" },
                  focalSubject: { type: Type.STRING, description: "The focal subject(s) and their natural human interactions or props (e.g. a group of kids sitting on a wood-paneled floor playing split-screen Mario Kart)" },
                  lightingStyle: { type: Type.STRING, description: "The lighting philosophy (e.g. the warm sodium-vapor glow of streetlights outside, or a flickering CRT television screen)" },
                  settingDetails: { type: Type.STRING, description: "Nostalgic props and cluttered lived-in setting details (e.g. stacked VHS cases, wood paneling, discarded retro soda cans)" },
                  ambientMotion: { type: Type.STRING, description: "Subtle ambient motion details (e.g. dust motes floating in the window light, or static lines roll on the CRT)" },
                  colorGrading: { type: Type.STRING, description: "Specific film color grading (e.g. warm amber highlights, desaturated greens, and matte shadows)" },
                  cameraLanguage: { type: Type.STRING, description: "Candid camera composition (e.g. handheld camcorder feel, over-the-shoulder documentary perspective)" },
                  textureReference: { type: Type.STRING, description: "Tactile media format (e.g. Kodak Gold 200 film grain, Polaroid fading, VHS artifacts)" },
                  imagePrompt: { type: Type.STRING, description: "The final assembled Image Prompt string matching the formula exactly with all brackets replaced" },
                  videoPrompt: { type: Type.STRING, description: "The final assembled Video Prompt string matching the formula exactly with all brackets replaced" }
                },
                required: [
                  "number",
                  "era",
                  "title",
                  "focalSubject",
                  "lightingStyle",
                  "settingDetails",
                  "ambientMotion",
                  "colorGrading",
                  "cameraLanguage",
                  "textureReference",
                  "imagePrompt",
                  "videoPrompt"
                ]
              }
            }
          },
          required: ["scenes"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{scenes: []}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error generating scene content:", err);
    res.status(500).json({ error: err.message || "An error occurred while generating nostalgic scenes." });
  }
});

// ROUTE for generating a preview image using Gemini image capabilities
app.post("/api/generate-image-preview", async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: "No prompt text provided for image generation." });
    }

    const ai = getGenAIClient();
    
    // We attempt image generation. If the key doesn't support gemini-2.5-flash-image, we catch gracefully.
    console.log("Generating image with prompt via gemini-2.5-flash-image...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: promptText,
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    let base64Image = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Image) {
      return res.json({ imageData: `data:image/png;base64,${base64Image}` });
    } else {
      res.status(404).json({ error: "Could not extract image content from generative model response." });
    }
  } catch (err: any) {
    console.error("Image generation error:", err);
    res.status(500).json({ 
      error: "Image generation model failed or is not available for this API key. Displaying fallback nostalgic filter instead!" 
    });
  }
});

export default app;
