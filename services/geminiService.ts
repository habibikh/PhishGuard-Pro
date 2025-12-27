
import { GoogleGenAI, Type } from "@google/genai";
import { RiskLevel, GeminiAnalysisResponse } from "../types";

const SYSTEM_INSTRUCTION = `You are a professional Cybersecurity Analyst specializing in phishing email detection.
Analyze the provided email content for:
1. Urgency, fear, authority pressure, or threats.
2. Suspicious sender behavior or unusual requests.
3. Requests for credentials, personal data, payments, or suspicious links.
4. Tone, grammar quality, and intent.

Rules:
- Be objective.
- If information is insufficient, set confidence lower and state limitations in the explanation.
- Risk levels: SAFE (no threats), SUSPICIOUS (potential red flags), PHISHING (clear malicious intent).

Output MUST be JSON.`;

export const analyzeEmail = async (emailContent: string): Promise<GeminiAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this email content:\n\n${emailContent}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: {
            type: Type.STRING,
            description: "Risk Level: SAFE, SUSPICIOUS, or PHISHING",
            enum: ["SAFE", "SUSPICIOUS", "PHISHING"]
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence percentage (0-100)"
          },
          riskIndicators: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Short, clear bullet points of risk indicators"
          },
          explanation: {
            type: Type.STRING,
            description: "3-5 lines of user-friendly explanation"
          },
          recommendedActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable steps for the user"
          }
        },
        required: ["riskLevel", "confidence", "riskIndicators", "explanation", "recommendedActions"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return result as GeminiAnalysisResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
