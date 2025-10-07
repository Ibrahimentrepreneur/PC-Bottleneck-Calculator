import { GoogleGenAI } from "@google/genai";
import type { BottleneckResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development, but the environment must have the key.
  console.warn("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getBottleneckAnalysis = async (
  cpuName: string,
  gpuName: string,
  resolution: string,
  result: BottleneckResult
): Promise<string> => {
  const { percentage, bottleneckComponent, isBalanced } = result;

  const prompt = `
    Act as a PC hardware expert providing an analysis for a user's computer build. You are friendly, knowledgeable, and helpful.

    User's Configuration:
    - CPU: ${cpuName}
    - GPU: ${gpuName}
    - Gaming Resolution: ${resolution}

    Analysis Result:
    - Bottleneck Percentage: ${percentage}%
    - Bottlenecked Component: ${bottleneckComponent}

    Calculation Context:
    The bottleneck percentage was calculated by comparing the GPU's performance score against an 'effective CPU score'. The CPU's raw score was adjusted based on the selected resolution, as lower resolutions (like 1080p) are more demanding on the CPU, while higher resolutions (like 4K) shift the load heavily to the GPU.

    Based on this information, provide a concise, easy-to-understand analysis in markdown format.

    Your response must include:
    1.  A clear heading: "### AI Analysis".
    2.  A one-sentence summary of the situation (e.g., "This is a well-balanced system," or "Your GPU is significantly holding back your CPU's potential at this resolution.").
    3.  A short paragraph explaining what this result means for gaming at ${resolution}. If the GPU is the bottleneck, explain that the CPU can push more frames than the GPU can render. If the CPU is the bottleneck, explain that the powerful GPU is not being fully utilized. If it's balanced, praise the component pairing for the target resolution.
    4.  A "### Recommendations" section with 1-2 specific, actionable bullet points.
        - If there is a bottleneck, suggest a specific and logical upgrade path. For example, if the user has an RTX 3060, recommend models like an "NVIDIA RTX 4070" or "AMD RX 7800 XT" as a suitable next step, considering the user's current CPU. Mention current market context if relevant (e.g., "great value for 1440p gaming").
        - If the system is balanced, confirm that it is a great pairing and that no immediate upgrades are necessary. You could suggest what component to look at for a future upgrade cycle.

    Keep the entire response under 200 words.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};