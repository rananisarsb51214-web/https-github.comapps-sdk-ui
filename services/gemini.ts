import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceContent = async (text: string, tone: 'professional' | 'creative' | 'casual'): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure your environment.";

  try {
    const prompt = `Rewrite the following social media post to be more ${tone}, engaging, and impactful. Keep it concise.
    
    Original text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original
  }
};

export const generateCaption = async (topic: string): Promise<string> => {
   if (!process.env.API_KEY) return "API Key missing.";
   
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, catchy social media caption about: ${topic}. Include hashtags.`,
    });
    return response.text || "";
   } catch (error) {
     console.error("Gemini API Error:", error);
     return "Could not generate caption.";
   }
}