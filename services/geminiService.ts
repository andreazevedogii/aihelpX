
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Tool } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateTagsForImage(imageBase64: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            text: 'Analyze this image of an artwork. Generate 5-7 relevant keywords or tags describing its style, subject, mood, and colors. The tags should be concise and useful for marketing.',
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A single descriptive tag for the artwork."
              }
            }
          }
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return result.tags || [];
  } catch (error) {
    console.error("Error generating tags:", error);
    throw new Error("Failed to generate tags from Gemini API.");
  }
}

export async function generateTextForTool(tool: Tool, tags: string[], imageFile?: File): Promise<string> {
  try {
    const formattedPrompt = tool.prompt.replace('[KEYWORDS]', tags.join(', '));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedPrompt
    });

    return response.text;
  } catch (error) {
    console.error(`Error generating text for ${tool.title}:`, error);
    throw new Error(`Failed to generate text for ${tool.title} from Gemini API.`);
  }
}

export async function editImageWithPrompt(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the response from Gemini API.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image with Gemini API.");
  }
}
