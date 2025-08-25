
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, GameStats, GeminiApiResponse } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    statChanges: {
      type: Type.OBJECT,
      description: "The change in points for each stat. Positive for increase, negative for decrease. Range from -10 to 10.",
      properties: {
        economy: { type: Type.INTEGER },
        social: { type: Type.INTEGER },
        politics: { type: Type.INTEGER },
        environment: { type: Type.INTEGER },
        international: { type: Type.INTEGER },
      },
    },
    narrative: {
      type: Type.STRING,
      description: "A 1-2 sentence narrative describing the outcome of the policy. This will be shown to the player.",
    },
    headline: {
      type: Type.STRING,
      description: "A short, news-style headline for the event.",
    },
    isGameOver: {
      type: Type.BOOLEAN,
      description: "Set to true ONLY if this action directly causes a catastrophic game over (e.g., a coup, impeachment, starting a war).",
    },
    gameOverReason: {
      type: Type.STRING,
      description: "If isGameOver is true, provide the reason for the game over. E.g., 'You were impeached by parliament.'",
    },
  },
  required: ["statChanges", "narrative", "headline", "isGameOver", "gameOverReason"],
};


const getSystemInstruction = (gameState: GameState, isCrisisResponse: boolean) => {
    const crisisText = isCrisisResponse ? `The president is responding to a national crisis: ${gameState.currentEvent?.title} - ${gameState.currentEvent?.description}. The response must be relevant to this crisis.` : `This is a standard policy decision.`
    
    return `You are an expert political and economic simulation AI for the game "President Simulator Indonesia." Your role is to determine the consequences of the player's policies.

Current Game State:
- Year: ${gameState.year}
- Economy: ${gameState.stats.economy}/100
- Social Welfare: ${gameState.stats.social}/100
- Politics & Stability: ${gameState.stats.politics}/100
- Environment: ${gameState.stats.environment}/100
- International Relations: ${gameState.stats.international}/100

${crisisText}

Based on the player's proposed policy, you must calculate the short-term and long-term effects. Adhere strictly to the provided JSON schema.
- Stat changes should be logical and balanced. A big boost in one area might negatively affect another.
- The narrative should be concise, neutral, and sound like a report.
- The headline should be catchy, like a newspaper headline.
- Only set isGameOver to true for actions that would realistically lead to an immediate end of a presidency.
- Be creative and realistic within the context of modern Indonesia.`;
};


export const evaluatePolicy = async (policy: string, gameState: GameState, isCrisisResponse: boolean): Promise<GeminiApiResponse> => {
    const systemInstruction = getSystemInstruction(gameState, isCrisisResponse);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Player's Policy: "${policy}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse: GeminiApiResponse = JSON.parse(jsonText);
        return parsedResponse;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get a response from the AI model.");
    }
};

export const generateEndGameLegacy = async (finalStats: GameStats, reason: string, isWin: boolean): Promise<string> => {
    const winOrLose = isWin ? "The President has achieved a great victory for the nation." : "The President's term has ended in failure.";
    
    const systemInstruction = `You are a historian writing the legacy of a former President of Indonesia for a history book.
    - Write a short, compelling paragraph (3-4 sentences) summarizing their presidency.
    - The tone should be reflective and historical.
    - Conclude with a memorable final sentence about how they will be remembered.`;

    const prompt = `
    The presidency concluded for the following reason: "${reason}"
    ${winOrLose}

    Here were the final national statistics:
    - Economy: ${finalStats.economy}/100
    - Social Welfare: ${finalStats.social}/100
    - Politics & Stability: ${finalStats.politics}/100
    - Environment: ${finalStats.environment}/100
    - International Relations: ${finalStats.international}/100
    
    Based on this, please write their historical legacy.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini legacy generation failed:", error);
        return "History's final verdict on your presidency remains unwritten due to unforeseen circumstances.";
    }
};