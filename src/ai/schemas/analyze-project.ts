import {z} from 'zod';

const FileSchema = z.object({
  name: z.string().describe('The name of the file.'),
  content: z.string().describe('The content of the file.'),
});

export const AnalyzeProjectInputSchema = z.object({
  files: z.array(FileSchema).describe("An array of files from the user's project."),
});
export type AnalyzeProjectInput = z.infer<typeof AnalyzeProjectInputSchema>;

export const AnalyzeProjectOutputSchema = z.object({
  projectName: z.string().describe('A suitable name for the project based on its files.'),
  language: z.string().describe('The primary programming language detected (e.g., Python, TypeScript, JavaScript).'),
  dependencies: z.array(z.string()).describe('A list of key dependencies or libraries used.'),
  buildTool: z.string().describe('The recommended build tool or package manager (e.g., pip, npm, yarn).'),
  buildCommands: z.array(z.string()).describe('A sequence of shell commands to build and run the project.'),
  runCommand: z.string().describe('The command to run the application after building.'),
  analysisSummary: z.string().describe('A brief, one-paragraph summary of the project and the suggested build plan.'),
});
export type AnalyzeProjectOutput = z.infer<typeof AnalyzeProjectOutputSchema>;
