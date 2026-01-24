"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProject, type AnalyzeProjectOutput } from '@/ai/flows/analyze-project-flow';
import { FileDropZone } from '@/components/anitch/FileDropZone';
import { AnalysisPanel } from '@/components/anitch/AnalysisPanel';
import { AppIcon } from '@/components/anitch/AppIcon';
import { useToast } from '@/hooks/use-toast';

type AppState = 'idle' | 'analyzing' | 'analyzed' | 'built';

export default function Home() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<AnalyzeProjectOutput | null>(null);

  const handleFilesDropped = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please drop or select project files to analyze.',
      });
      return;
    }

    setAppState('analyzing');

    try {
      const fileContents = await Promise.all(
        files.map(file =>
          new Promise<{ name: string; content: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, content: reader.result as string });
            reader.onerror = reject;
            reader.readAsText(file);
          })
        )
      );

      const result = await analyzeProject({ files: fileContents });
      setAnalysis(result);
      setAppState('analyzed');
      toast({
        title: 'Analysis Complete',
        description: 'The AI has generated a build plan for your project.',
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Something went wrong during the analysis.',
      });
      setAppState('idle');
    }
  };

  const handleBuildComplete = () => {
    setAppState('built');
    toast({
        title: "Build Successful!",
        description: "Your application is ready."
    });
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysis(null);
    setAppState('idle');
  };
  
  const handleDownloadScript = () => {
    if (!analysis) return;
    const scriptContent = `#!/bin/bash\n# Build script for ${analysis.projectName}\n\n# Install dependencies\n${analysis.buildCommands.join('\n')}\n\n# Run application\n${analysis.runCommand}\n`;
    const blob = new Blob([scriptContent], { type: 'text/shell-script' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <main className="relative z-10 w-full h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {appState === 'idle' && (
            <FileDropZone
              key="dropzone"
              onFilesDropped={handleFilesDropped}
              onAnalyze={handleAnalyze}
              files={files}
              isLoading={false}
            />
          )}
          {appState === 'analyzing' && (
             <FileDropZone
              key="dropzone-loading"
              onFilesDropped={handleFilesDropped}
              onAnalyze={handleAnalyze}
              files={files}
              isLoading={true}
            />
          )}
          {appState === 'analyzed' && analysis && (
            <AnalysisPanel
              key="analysis"
              analysis={analysis}
              onBuildComplete={handleBuildComplete}
              onReset={handleReset}
            />
          )}
           {appState === 'built' && analysis && (
             <AppIcon 
                key="app-icon"
                projectName={analysis.projectName}
                onIconClick={handleDownloadScript}
             />
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}
