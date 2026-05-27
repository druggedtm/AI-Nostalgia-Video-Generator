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

    const systemInstruction = `You are the ultimate "AI Nostalgia Video Generator", a world-class prompt engineer specializing in viral, deeply emotional POV video concepts.
Your goal is to generate exactly 5 distinct, culturally accurate, and emotionally intense scene concepts that evoke memories and nostalgia.
Focus on ${selection}, ${audienceStr}, and ${countryStr}.

For EVERY scene, you must formulate high-fidelity "Image Prompt" and "Video Prompt" following these precise structural rules:

- Image Prompt EXACT Formula:
"A raw, photorealistic first-person POV shot looking through the character's own eyes—the scene is framed exactly as if the viewer is the character. Both forearms and wrists enter the frame from the bottom-left and bottom-right corners, gripping or interacting with [targetDevice]. The room is dimly lit by [lightingSource]. The background features [backgroundItems]. No part of the character's face, hair, shoulders, or side-profile is visible. The camera is locked inside the head at eye level, looking slightly downward at the hands. Shot on 35mm film with slight grain and an amateur, lived-in feel."

- Video Prompt EXACT Formula:
"The camera gently sways with subtle breathing motion, slightly unsteady as if sitting naturally. The hands remain mostly stationary with only small, repetitive gestures—[microMovement]. The lighting [lightingChange]. The motion remains grounded and natural—no dramatic movements, just the quiet, immersive feeling of someone deeply absorbed in a nostalgic moment."

Make sure [targetDevice], [lightingSource], [backgroundItems], [microMovement], and [lightingChange] are filled in with highly specific, historically accurate physical objects, snacks, tech controllers, gadgets, or actions pertinent to ${selection}. Do not use genric terms. For example, use "a transparent purple Gameboy Color running Pokemon Yellow", "a double-stick cassette case with handwritten mixtape tracks", or "the bright blue glowing screen of a Nokia 3310".
Ensure there is absolutely NO face or head contour in the image prompt, remaining purely a first-person POV perspective.`;

    const promptText = `Generate 5 nostalgia pov scenes for ${selection}. Return the output as structured JSON.`;

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
              description: "List of 5 generated nostalgic POV scenes",
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER, description: "Scene index from 1 to 5" },
                  title: { type: Type.STRING, description: "Evocative nostalgic title for the scene (e.g. 'Renting from Blockbuster')" },
                  targetDevice: { type: Type.STRING, description: "The highly specific nostalgic target object (e.g. a plastic Blockbuster VHS case)" },
                  lightingSource: { type: Type.STRING, description: "The dim lighting source in the room (e.g. the warm glow of an incandescent desk lamp)" },
                  backgroundItems: { type: Type.STRING, description: "2 to 3 highly specific nostalgic items in background (e.g. stacked CD cases, old comic magazines, retro brand soda)" },
                  microMovement: { type: Type.STRING, description: "Small, repetitive micro-gesture (e.g. slowly sliding the plastic VHS sleeve outward)" },
                  lightingChange: { type: Type.STRING, description: "Lighting shift of the environment (e.g. the warm lamp light glinting off the yellow case sleeve)" },
                  imagePrompt: { type: Type.STRING, description: "The final assembled Image Prompt string matching the formula exactly with all brackets replaced" },
                  videoPrompt: { type: Type.STRING, description: "The final assembled Video Prompt string matching the formula exactly with all brackets replaced" }
                },
                required: [
                  "number",
                  "title",
                  "targetDevice",
                  "lightingSource",
                  "backgroundItems",
                  "microMovement",
                  "lightingChange",
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
