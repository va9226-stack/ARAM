
"use client";

import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CoherenceMeter } from '@/components/anitch/CoherenceMeter';
import { SceneObject } from '@/components/anitch/SceneObject';
import CodeCommandInterface from '@/components/anitch/CodeCommandInterface';
import { HolographicFileDrop } from '@/components/anitch/HolographicFileDrop';
import { AnalysisPanel } from '@/components/anitch/AnalysisPanel';
import { AppIcon } from '@/components/anitch/AppIcon';
import { analyzeProject, type AnalyzeProjectOutput } from '@/ai/flows/analyze-project-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import MeditationMode from '@/components/anitch/MeditationMode';


type SceneObjectType = {
  id: string;
  type: 'cube' | 'sphere' | 'pyramid' | 'app';
};

type AppState = 'idle' | 'awaiting_files' | 'analyzing' | 'analysis_complete' | 'build_complete' | 'meditating';


export default function Home() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>('idle');

  const [coherence, setCoherence] = useState(100);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectType[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<{ command: string; timestamp: number }[]>([]);

  const [analysisResult, setAnalysisResult] = useState<AnalyzeProjectOutput | null>(null);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleCoherenceChange = useCallback((amount: number) => {
    setCoherence(prev => Math.max(0, Math.min(100, prev + amount)));
  }, []);

  const handleExecuteCommand = (command: string) => {
    setCommandHistory(prev => [...prev, { command, timestamp: Date.now() }]);
    
    if (/meditate|focus|restore/i.test(command)) {
      setAppState('meditating');
      return;
    }

    if (/analyze|build|construct/i.test(command)) {
        if (appState !== 'idle') return;
        handleCoherenceChange(-10);
        setAppState('awaiting_files');
    } else {
        handleCoherenceChange(-5);
    }
  };

  const handleFilesDropped = useCallback((files: File[]) => {
    setDroppedFiles(files);
    setAppState('analyzing');

    const readFiles = async () => {
        const fileContents = await Promise.all(
          files.map(file => new Promise<{ name: string; content: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, content: reader.result as string });
            reader.onerror = reject;
            reader.readAsText(file);
          }))
        );
        return fileContents;
    };

    readFiles().then(files => {
        analyzeProject({ files }).then(result => {
            setAnalysisResult(result);
            setAppState('analysis_complete');
            handleCoherenceChange(-20);
        }).catch(err => {
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'The AI core could not process the project files.',
            });
            console.error(err);
            resetState();
        });
    }).catch(err => {
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the dropped files.',
        });
        console.error(err);
        resetState();
    });
  }, [toast]);


  const handleBuildComplete = useCallback(() => {
    setAppState('build_complete');
    handleCoherenceChange(-30);
  }, []);

  const resetState = () => {
    setAppState('idle');
    setAnalysisResult(null);
    setDroppedFiles([]);
  };

  const handleExitMeditation = () => {
    setAppState('idle');
  };
  
  const CurrentView = useMemo(() => {
    switch (appState) {
        case 'awaiting_files':
            return <HolographicFileDrop onFilesDropped={handleFilesDropped} onCancel={resetState} />;
        case 'analyzing':
             return (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center gap-4 text-center">
                    <Loader className="w-16 h-16 animate-spin text-primary" />
                    <h2 className="text-2xl font-bold holographic-text">AI Core is Analyzing...</h2>
                    <p className="text-muted-foreground">Reading project architecture and dependencies.</p>
                </motion.div>
             );
        case 'analysis_complete':
            return analysisResult ? <AnalysisPanel analysis={analysisResult} onBuildComplete={handleBuildComplete} onReset={resetState} /> : null;
        case 'build_complete':
            return analysisResult ? <AppIcon analysis={analysisResult} onIconClick={resetState} /> : null;
        case 'meditating':
            return (
                <div className="w-full h-full cursor-pointer" onClick={handleExitMeditation} title="Click anywhere to exit meditation">
                    <MeditationMode coherence={coherence} onCoherenceChange={handleCoherenceChange} />
                </div>
            )
        default:
            return null;
    }
  }, [appState, analysisResult, handleFilesDropped, handleBuildComplete, coherence, handleCoherenceChange]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{
        maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)',
        backgroundSize: '40px 40px',
      }}></div>
      
      <CoherenceMeter coherence={coherence} />
      
      <main className="relative z-10 w-full h-screen flex items-center justify-center" onClick={(e) => {
        if ((e.target as HTMLElement).tagName === 'MAIN') {
          setSelectedObjectId(null)
        }
      }}>
        <AnimatePresence>
          {sceneObjects.map(obj => (
            <SceneObject
              key={obj.id}
              id={obj.id}
              type={obj.type}
              isSelected={selectedObjectId === obj.id}
              onSelect={setSelectedObjectId}
            />
          ))}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
            {CurrentView}
        </AnimatePresence>
      </main>
      
      <AnimatePresence>
        {appState === 'idle' && (
            <CodeCommandInterface
                onExecuteCommand={handleExecuteCommand}
                commandHistory={commandHistory}
                coherence={coherence}
                onCoherenceChange={handleCoherenceChange}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
