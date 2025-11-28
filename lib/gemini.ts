import { GoogleGenAI } from "@google/genai";

// Queue system to prevent rate limiting
const requestQueue: Array<() => Promise<void>> = [];
let isProcessing = false;
// Delay between requests in ms (4000ms = 4s to be safe for free tier limits)
const RATE_LIMIT_DELAY = 4000; 

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      await task();
      // Wait before next request to respect rate limits
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  isProcessing = false;
};

export async function generateProductImage(productName: string): Promise<string | null> {
  // Check if API key is available
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. Skipping image generation.");
    return null;
  }

  // Wrap the request in a promise that resolves when the queue processes it
  return new Promise((resolve) => {
    const task = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: `Professional studio product photography of ${productName}, isolated on a clean white background, high resolution, commercial advertisement style, cinematic lighting, 4k.`,
              },
            ],
          },
          config: {
            imageConfig: {
                aspectRatio: "1:1",
            }
          }
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
        // Handle Rate Limits Gracefully
        if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) {
          console.warn(`Quota exceeded for ${productName}. Returning null.`);
          resolve(null);
        } else {
          console.error("Failed to generate image for", productName, error);
          resolve(null);
        }
      }
    };

    // Add task to queue and start processing if not already started
    requestQueue.push(task);
    processQueue();
  });
}