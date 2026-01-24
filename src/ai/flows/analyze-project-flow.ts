'use server';
/**
 * @fileOverview An AI flow to analyze project files and suggest a build plan.
 *
 * - analyzeProject - A function that handles the project analysis.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeProjectInputSchema,
  AnalyzeProjectOutputSchema,
  type AnalyzeProjectInput,
  type AnalyzeProjectOutput,
} from '@/ai/schemas/analyze-project';

// The wrapper function to be called from the frontend
export async function analyzeProject(input: AnalyzeProjectInput): Promise<AnalyzeProjectOutput> {
  return analyzeProjectFlow(input);
}


// The prompt for the AI
const analyzeProjectPrompt = ai.definePrompt({
  name: 'analyzeProjectPrompt',
  input: {schema: AnalyzeProjectInputSchema},
  output: {schema: AnalyzeProjectOutputSchema},
  prompt: `You are a build engineer expert. Your task is to analyze a set of project files and determine the best way to build and run the project.

Your goal is to be efficient and insightful. Prioritize your analysis on manifest and configuration files (like package.json, requirements.txt, pyproject.toml, setup.py, Makefile, etc.). These files are the skeleton of the project. Use them to form your primary hypothesis about the build process. Treat other source files as secondary confirmation or for detail, especially if the total amount of code is very large.

Analyze the following files:
{{#each files}}
File: {{{name}}}
Content:
\'\'\'
{{{content}}}
\'\'\'
---
{{/each}}

Based on the files provided:
1.  Determine a suitable project name.
2.  Identify the primary programming language.
3.  List the key dependencies. If there's a dependency file (like requirements.txt or package.json), use it.
4.  Identify the primary build tool (like pip, npm, yarn, or py2app).
5.  Provide the necessary shell commands to install dependencies and build the project.
6.  Provide the command to run the application.
7.  Write a short summary explaining your analysis and the steps.

If a known build file like 'setup.py' (for py2app), 'package.json' (with scripts), or a 'Makefile' is present, prioritize its instructions for the build commands.
For Python projects, your top priority is to provide commands that do not require administrative ('sudo') privileges. Therefore, you must always recommend creating and using a virtual environment (e.g., with 'python -m venv venv'). The build commands should include creating the virtual environment, activating it, and then installing dependencies inside it.
For Node.js projects, prefer 'npm' unless 'yarn.lock' is present.
The final output should be a JSON object matching the provided schema.`,
});


// The Genkit Flow
const analyzeProjectFlow = ai.defineFlow(
  {
    name: 'analyzeProjectFlow',
    inputSchema: AnalyzeProjectInputSchema,
    outputSchema: AnalyzeProjectOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeProjectPrompt(input);
    return output!;
  }
);
