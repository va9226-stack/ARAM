"use client";

import { useState, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeProject } from '@/ai/flows/analyze-project-flow';
import type { AnalyzeProjectOutput } from '@/ai/schemas/analyze-project';
import { UploadCloud, File, BrainCircuit, Bot, Wand2, Hammer, Terminal, Package, Languages, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BuildPipeline } from '@/components/anitch/BuildPipeline';

type FileData = {
  name: string;
  content: string;
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  </div>
);


export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [analysis, setAnalysis] = useState<AnalyzeProjectOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownloadScript = useCallback(() => {
    if (!analysis) return;

    const scriptContent = `#!/bin/bash
# AI-generated build script for ${analysis.projectName}

echo "--- Installing Dependencies and Building Project ---"
${analysis.buildCommands.join('\n')}

echo "\\n--- Build Complete ---"
echo "To run the application, execute the following command:"
echo "${analysis.runCommand}"
`;

    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
        title: "Script Downloaded",
        description: "build.sh has been downloaded successfully.",
    });
  }, [analysis, toast]);

  const readFileAsText = (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ name: file.name, content: reader.result as string });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileSelection = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    try {
      const fileDataArray = await Promise.all(
        Array.from(selectedFiles).map(file => readFileAsText(file))
      );
      
      setUploadedFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        const newFiles = fileDataArray.filter(f => !existingFileNames.has(f.name));
        return [...prevFiles, ...newFiles];
      });

      setAnalysis(null);
      setError(null);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read one or more files.",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };
  
  const runAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files",
        description: "Please upload files to analyze.",
      });
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeProject({ files: uploadedFiles });
      setAnalysis(result);
    } catch (e: any) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: e.message || "An unknown error occurred.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const AnalysisResultView = useMemo(() => {
    if (!analysis) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <InfoItem icon={Package} label="Project Name" value={analysis.projectName} />
        <InfoItem icon={Languages} label="Primary Language" value={<Badge variant="outline">{analysis.language}</Badge>} />
        
        <InfoItem 
          icon={Hammer} 
          label="Build Tool" 
          value={<Badge variant="secondary">{analysis.buildTool}</Badge>} 
        />

        {analysis.dependencies.length > 0 && (
          <InfoItem 
            icon={Package} 
            label="Key Dependencies" 
            value={<div className="flex flex-wrap gap-2 pt-1">{analysis.dependencies.map(dep => <Badge key={dep}>{dep}</Badge>)}</div>}
          />
        )}
        
        {(analysis.buildCommands.length > 0 || analysis.runCommand) && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground flex items-center"><Terminal className="h-5 w-5 mr-3 text-primary"/>AR Build Pipeline</p>
              <Button onClick={handleDownloadScript} size="sm" variant="outline">
                 <Download className="mr-2 h-4 w-4" />
                 Download Script
              </Button>
            </div>
            <BuildPipeline commands={analysis.buildCommands} runCommand={analysis.runCommand} />
          </div>
        )}
        
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground flex items-center"><Bot className="h-5 w-5 mr-3 text-primary"/>AI Summary</p>
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border bg-background">
                    <AvatarFallback>
                        <Bot className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-secondary/50 p-3 rounded-lg border rounded-tl-none text-sm text-foreground">
                    {analysis.analysisSummary}
                </div>
            </div>
        </div>
      </div>
    );
  }, [analysis, handleDownloadScript]);


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">Project Analyzer</h1>
          <p className="text-muted-foreground mt-1">Drop your project files and get an AI-powered build plan.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card 
              className="transition-all"
              onDragEnter={() => setIsDragging(true)}
            >
              <CardHeader>
                <CardTitle className="font-headline">Your Project Files</CardTitle>
                <CardDescription>Drop files here, or click to select them.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <UploadCloud className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Drag & drop files here</p>
                  <p className="text-xs text-muted-foreground/80">or</p>
                  <Button variant="link" onClick={() => fileInputRef.current?.click()}>
                    select files from your computer
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelection(e.target.files)}
                  />
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                       <p className="text-sm text-muted-foreground">Ready to be analyzed.</p>
                    </div>
                    <ScrollArea className="h-40 w-full">
                       <div className="space-y-2 pr-4">
                        {uploadedFiles.map(file => (
                          <div key={file.name} className="flex items-center gap-3 text-sm p-2 bg-secondary/50 rounded-md border">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-foreground flex-1 truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => { setUploadedFiles([]); setAnalysis(null); setError(null); }} disabled={uploadedFiles.length === 0}>
                    Clear Files
                  </Button>
                  <Button onClick={runAnalysis} disabled={isAnalyzing || uploadedFiles.length === 0} className="font-headline">
                    {isAnalyzing ? <><BrainCircuit className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Wand2 className="mr-2 h-4 w-4" />Analyze Project</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Analysis & Build Plan</CardTitle>
                <CardDescription>AI-generated suggestions for your project.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-96 flex items-center justify-center">
                {isAnalyzing && (
                   <div className="flex flex-col items-center text-muted-foreground animate-in fade-in duration-500">
                    <BrainCircuit className="h-10 w-10 mb-4 animate-pulse" />
                    <p className="font-medium">AI is analyzing your files...</p>
                    <p className="text-sm">This may take a moment.</p>
                  </div>
                )}
                
                {error && (
                  <div className="text-center text-destructive">
                    <p className="font-bold">Analysis Failed</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!isAnalyzing && !error && analysis && AnalysisResultView}

                {!isAnalyzing && !error && !analysis && (
                  <div className="text-center text-muted-foreground">
                    <Bot className="h-10 w-10 mx-auto mb-4" />
                    <p className="font-medium">Awaiting analysis</p>
                    <p className="text-sm">Upload your project files and click "Analyze Project" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
