import {genkit} from 'genkit';
import {ollama} from 'genkitx-ollama';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    ollama({
      models: [{name: 'mixtral'}],
      serverAddress: 'http://127.0.0.1:11434',
    }),
    googleAI(),
  ],
  model: 'ollama/mixtral',
});
