'use server';
/**
 * @fileOverview A flow to interact with the Gemini model.
 *
 * - chatWithGemini - A function that sends a prompt to Gemini and gets a response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

// The wrapper function to be called from the frontend
export async function chatWithGemini(promptText: string): Promise<string> {
  return geminiChatFlow(promptText);
}

// The Genkit Flow
const geminiChatFlow = ai.defineFlow(
  {
    name: 'geminiChatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      model: 'google/gemini-1.5-flash-latest',
      prompt: prompt,
    });

    return llmResponse.text;
  }
);
