import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
// This blueprint uses Replit AI Integrations for Gemini access, 
// does not require your own API key, and charges are billed to your credits.
export const genAI = new GoogleGenerativeAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy-key");

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-3-pro-preview",
  baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL 
} as any);

/**
 * Perform AI analysis on nutrition data using Gemini.
 */
export async function analyzeNutritionWithGemini(data: {
  profile: any;
  meals: any[];
  foods: any[];
}) {
  const prompt = `
    Analyze the following nutrition data for a person in Kenya.
    
    User Profile: ${JSON.stringify(data.profile)}
    Recent Meals: ${JSON.stringify(data.meals)}
    Available Kenyan Foods: ${JSON.stringify(data.foods.filter(f => f.isKenyaSpecific))}
    
    Provide a detailed health analysis including:
    1. Nutritional balance assessment based on Kenyan context.
    2. Specific recommendations for improvement using local foods.
    3. Potential risks or missing nutrients (like Iron, Vitamin A).
    
    Return the analysis as a structured JSON object with fields: "summary", "recommendations" (array), and "score" (0-100).
  `;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from markdown if necessary
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e) {
    return { summary: text, recommendations: [], score: 50 };
  }
}
