import { GoogleGenAI } from "@google/genai";

// Queue system to prevent rate limiting
const requestQueue: Array<() => Promise<void>> = [];
let isProcessing = false;
const RATE_LIMIT_DELAY = 4000; 

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      await task();
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  isProcessing = false;
};

export async function generateProductImage(productName: string): Promise<string | null> {
  // NOTE: Changed to NEXT_PUBLIC_API_KEY for Client Side access
  if (!process.env.NEXT_PUBLIC_API_KEY) {
    console.warn("API_KEY is not set. Skipping image generation.");
    return null;
  }

  return new Promise((resolve) => {
    const task = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `Professional studio product photography of ${productName}, isolated on a clean white background, high resolution, commercial advertisement style, cinematic lighting, 4k.` }],
          },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            resolve(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
        if (!foundImage) resolve(null);

      } catch (error: any) {
        console.warn(`Generation failed/skipped for ${productName}.`);
        resolve(null);
      }
    };

    requestQueue.push(task);
    processQueue();
  });
}
