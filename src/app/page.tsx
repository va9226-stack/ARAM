"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeProject } from '@/ai/flows/analyze-project-flow';
import type { AnalyzeProjectOutput } from '@/ai/schemas/analyze-project';
import { UploadCloud, File, BrainCircuit, Bot, Wand2, Hammer, Terminal, Package, Languages, Download, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BuildPipeline } from '@/components/anitch/BuildPipeline';
import { cn } from '@/lib/utils';

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
        <p className="text-sm text-primary-foreground/80">{label}</p>
        <div className="text-primary-foreground font-medium">{value}</div>
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use the AR view.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

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
        <Card className="bg-black/30 backdrop-blur-xl border-white/20 text-primary-foreground animate-in fade-in-0 duration-500">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{analysis.projectName}</CardTitle>
                <CardDescription className="text-primary-foreground/80">{analysis.language}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                      <p className="text-sm text-primary-foreground/80 flex items-center"><Terminal className="h-5 w-5 mr-3 text-primary"/>AR Build Pipeline</p>
                      <Button onClick={handleDownloadScript} size="sm" variant="outline" className="bg-transparent text-primary-foreground hover:bg-white/10 hover:text-white">
                         <Download className="mr-2 h-4 w-4" />
                         Download Script
                      </Button>
                    </div>
                    <BuildPipeline commands={analysis.buildCommands} runCommand={analysis.runCommand} />
                  </div>
                )}
                
                <div className="space-y-4">
                    <p className="text-sm text-primary-foreground/80 flex items-center"><Bot className="h-5 w-5 mr-3 text-primary"/>AI Summary</p>
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border bg-background">
                            <AvatarFallback>
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/20 rounded-tl-none text-sm text-primary-foreground">
                            {analysis.analysisSummary}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }, [analysis, handleDownloadScript]);


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay muted playsInline />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      <main className="relative z-20 w-full h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        {hasCameraPermission === false && (
             <Card className="max-w-md bg-destructive/50 backdrop-blur-lg border-destructive text-destructive-foreground">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><VideoOff /> Camera Access Denied</CardTitle>
                    <CardDescription className="text-destructive-foreground/80">Please enable camera permissions in your browser settings to use the AR experience.</CardDescription>
                </CardHeader>
            </Card>
        )}

        {hasCameraPermission && (
            <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center gap-8">
                <div className={cn(
                    "w-full lg:w-1/2 h-full flex flex-col justify-center transition-all duration-500 ease-in-out",
                    (isAnalyzing || analysis) && "lg:w-1/3"
                )}>
                    <div
                      className={cn(
                        `flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300`,
                        isDragging ? 'border-primary bg-primary/20' : 'border-white/30 bg-black/20 backdrop-blur-lg',
                        'text-white'
                      )}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <UploadCloud className="h-12 w-12 text-white/70" />
                      <p className="mt-4">Drop project files here</p>
                      <p className="text-xs text-white/60">or</p>
                      <Button variant="link" onClick={() => fileInputRef.current?.click()} className="text-primary">
                        select from your computer
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
                        <div className="mt-6 p-4 bg-black/20 backdrop-blur-lg border border-white/20 rounded-xl space-y-4">
                            <div>
                            <h3 className="font-medium text-white">Uploaded Files ({uploadedFiles.length})</h3>
                            <p className="text-sm text-white/70">Ready for analysis.</p>
                            </div>
                            <ScrollArea className="h-40 w-full">
                            <div className="space-y-2 pr-4">
                                {uploadedFiles.map(file => (
                                <div key={file.name} className="flex items-center gap-3 text-sm p-2 bg-white/5 rounded-md border border-white/10">
                                    <File className="h-4 w-4 text-white/70" />
                                    <span className="font-mono text-white flex-1 truncate">{file.name}</span>
                                </div>
                                ))}
                            </div>
                            </ScrollArea>
                            <div className="flex justify-end gap-4 pt-2">
                                <Button variant="outline" onClick={() => { setUploadedFiles([]); setAnalysis(null); setError(null); }} disabled={uploadedFiles.length === 0} className="bg-transparent text-white hover:bg-white/10">
                                    Clear
                                </Button>
                                <Button onClick={runAnalysis} disabled={isAnalyzing || uploadedFiles.length === 0} className="font-headline bg-primary text-primary-foreground">
                                    {isAnalyzing ? <><BrainCircuit className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Wand2 className="mr-2 h-4 w-4" />Analyze Project</>}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={cn(
                    "w-0 lg:w-2/3 h-full flex flex-col justify-center transition-all duration-500 ease-in-out opacity-0",
                    (isAnalyzing || analysis || error) && "w-full lg:w-2/3 opacity-100"
                )}>
                   <ScrollArea className="h-full py-8">
                        {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center h-full text-white/80 animate-in fade-in-0 duration-500">
                                <BrainCircuit className="h-16 w-16 mb-4 animate-pulse text-primary" />
                                <p className="font-medium text-xl">AI is building your reality...</p>
                                <p className="text-md">This may take a moment.</p>
                            </div>
                        )}
                        
                        {error && (
                            <Card className="bg-destructive/50 backdrop-blur-lg border-destructive text-destructive-foreground">
                                <CardHeader>
                                    <CardTitle>Analysis Failed</CardTitle>
                                    <CardDescription className="text-destructive-foreground/80">{error}</CardDescription>
                                </CardHeader>
                            </Card>
                        )}

                        {!isAnalyzing && !error && analysis && AnalysisResultView}
                   </ScrollArea>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
