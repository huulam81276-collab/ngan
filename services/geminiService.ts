
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error?.includes("API_KEY")) {
        throw new Error("API_KEY_MISSING");
      }
      throw new Error("API_ERROR");
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    // The backend returns the stringified JSON from Gemini in the 'text' field
    return JSON.parse(data.text.trim());
  } catch (e: any) {
    if (e.message === "API_KEY_MISSING") throw e;
    console.error("Error calling backend API:", e);
    throw new Error("PARSE_ERROR");
  }
};
