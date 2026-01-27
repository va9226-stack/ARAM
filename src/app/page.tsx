
"use client";

import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CoherenceMeter } from '@/components/anitch/CoherenceMeter';
import { SceneObject } from '@/components/anitch/SceneObject';
import CodeCommandInterface from '@/components/anitch/CodeCommandInterface';
import { HolographicFileDrop } from '@/components/anitch/HolographicFileDrop';
import { AnalysisPanel } from '@/components/anitch/AnalysisPanel';
import { AppIcon } from '@/components/anitch/AppIcon';
import { GeminiResponse } from '@/components/anitch/GeminiResponse';
import { analyzeProject } from '@/ai/flows/analyze-project-flow';
import { chatWithGemini } from '@/ai/flows/gemini-chat-flow';
import { type AnalyzeProjectOutput } from '@/ai/schemas/analyze-project';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader } from 'lucide-react';
import MeditationMode from '@/components/anitch/MeditationMode';
import { BridgeToggle } from '@/components/anitch/BridgeToggle';


type SceneObjectType = {
  id: string;
  type: 'cube' | 'sphere' | 'pyramid';
};

type AppState = 'idle' | 'awaiting_files' | 'analyzing' | 'analysis_complete' | 'build_complete' | 'meditating' | 'thinking_gemini' | 'displaying_gemini';


export default function Home() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>('idle');
  const [isBridgeConnected, setIsBridgeConnected] = useState(false);

  const [coherence, setCoherence] = useState(100);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectType[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<{ command: string; timestamp: number }[]>([]);

  const [analysisResult, setAnalysisResult] = useState<AnalyzeProjectOutput | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleCoherenceChange = useCallback((amount: number) => {
    setCoherence(prev => Math.max(0, Math.min(100, prev + amount)));
  }, []);

  const resetState = () => {
    setAppState('idle');
    setAnalysisResult(null);
    setGeminiResponse(null);
    setDroppedFiles([]);
    setIsBridgeConnected(false);
  };

  const handleBridgeToggle = useCallback(() => {
    if (isBridgeConnected) {
        // Disconnect
        setIsBridgeConnected(false);
        toast({ title: "Bridge Disconnected", description: "The secure connection has been terminated." });
        return;
    }

    if (appState === 'idle' || appState === 'meditating') {
        // Connect
        if (coherence < 25) {
            toast({ title: "Insufficient Coherence", description: "Need at least 25% coherence to establish a bridge.", variant: "destructive" });
            return;
        }
        handleCoherenceChange(-25);
        setIsBridgeConnected(true);
        toast({ title: "Bridge Connected", description: "Secure connection is now active." });
    }
  }, [isBridgeConnected, appState, coherence, handleCoherenceChange, toast]);

  const handleExecuteCommand = (command: string) => {
    if (appState !== 'idle' && !/meditate|focus|restore/i.test(command)) return;

    setCommandHistory(prev => [...prev, { command, timestamp: Date.now() }]);

    const lowerCmd = command.toLowerCase();

    // Meditate command
    if (/meditate|focus|restore/i.test(lowerCmd)) {
      setAppState('meditating');
      toast({
          title: "Entering Meditation",
          description: "Focusing energy to restore coherence."
      });
      return;
    }
    
    // Analyze command
    if (/analyze|build|construct/i.test(lowerCmd)) {
        handleCoherenceChange(-15);
        setAppState('awaiting_files');
        toast({
            title: "Analysis Protocol Initiated",
            description: "Awaiting project file submission."
        });
        return;
    }

    // Bridge command
    if (/connect bridge|disconnect bridge/i.test(lowerCmd)) {
      handleBridgeToggle();
      return;
    }

    // Gemini command
    const geminiMatch = lowerCmd.match(/^(?:gemini|ask)\s+(.+)/i);
    if (geminiMatch) {
      const prompt = geminiMatch[1];
      if (coherence < 10) {
        toast({ title: "Insufficient Coherence", description: "Need at least 10% coherence to consult Gemini.", variant: "destructive" });
        return;
      }
      handleCoherenceChange(-10);
      setAppState('thinking_gemini');
      chatWithGemini(prompt).then(response => {
        setGeminiResponse(response);
        setAppState('displaying_gemini');
        toast({ title: "Gemini Responded", description: "Holographic response panel materialized." });
      }).catch(err => {
        toast({
            variant: 'destructive',
            title: 'Gemini Interface Error',
            description: 'The connection to the AI core was unstable. Coherence lost.',
        });
        console.error(err);
        handleCoherenceChange(-15);
        resetState();
      });
      return;
    }


    // Manifest command
    const manifestMatch = lowerCmd.match(/manifest (a |an )?(cube|sphere|pyramid)/i);
    if (manifestMatch) {
        const type = manifestMatch[2] as 'cube' | 'sphere' | 'pyramid';
        if (coherence < 20) {
            toast({ title: "Insufficient Coherence", description: "Need at least 20% coherence to manifest objects.", variant: "destructive" });
            return;
        }
        
        const newObject: SceneObjectType = {
            id: `obj-${Date.now()}-${Math.random()}`,
            type,
        };
        setSceneObjects(prev => [...prev, newObject]);
        handleCoherenceChange(-20);
        toast({
            title: "Manifestation Successful",
            description: `A ${type} has been materialized in the scene.`,
        });
        return;
    }
    
    // Unknown command
    handleCoherenceChange(-5);
    toast({
        title: "Command Unrecognized",
        description: "The reality matrix did not resolve the command. Coherence lost.",
        variant: 'destructive',
    });
  };

  const handleFilesDropped = useCallback((files: File[]) => {
    setDroppedFiles(files);
    setAppState('analyzing');
    handleCoherenceChange(-5); // Small cost for file processing

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
            toast({ title: "Analysis Complete", description: "Build pipeline has been constructed." });
        }).catch(err => {
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'The AI core could not process the project files. Coherence destabilized.',
            });
            console.error(err);
            handleCoherenceChange(-25);
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
  }, [toast, handleCoherenceChange]);


  const handleBuildComplete = useCallback(() => {
    setAppState('build_complete');
    handleCoherenceChange(-30);
    toast({ title: "Build Simulation Complete", description: "Application artifact has been manifested." });
  }, [handleCoherenceChange, toast]);

  const handleExitMeditation = () => {
    setAppState('idle');
    toast({ title: "Meditation Complete", description: "You feel refreshed and coherent." });
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
        case 'thinking_gemini':
            return (
               <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center gap-4 text-center">
                   <Bot className="w-16 h-16 animate-pulse text-primary" />
                   <h2 className="text-2xl font-bold holographic-text">Contacting Gemini...</h2>
                   <p className="text-muted-foreground">The AI oracle is contemplating your query.</p>
               </motion.div>
            );
        case 'analysis_complete':
            return analysisResult ? <AnalysisPanel analysis={analysisResult} onBuildComplete={handleBuildComplete} onReset={resetState} /> : null;
        case 'build_complete':
            return analysisResult ? <AppIcon analysis={analysisResult} onIconClick={resetState} /> : null;
        case 'displaying_gemini':
            return geminiResponse ? <GeminiResponse response={geminiResponse} onClose={resetState} /> : null;
        case 'meditating':
            return (
                <div className="w-full h-full cursor-pointer" onClick={handleExitMeditation} title="Click anywhere to exit meditation">
                    <MeditationMode coherence={coherence} onCoherenceChange={handleCoherenceChange} />
                </div>
            )
        default:
            return null;
    }
  }, [appState, analysisResult, geminiResponse, handleFilesDropped, handleBuildComplete, coherence, handleCoherenceChange, handleExitMeditation]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{
        maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)',
        backgroundSize: '40px 40px',
      }}></div>
      
      <CoherenceMeter coherence={coherence} />
      <BridgeToggle
          isConnected={isBridgeConnected}
          onToggle={handleBridgeToggle}
          coherence={coherence}
      />
      
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
        {(appState === 'idle' || appState === 'meditating') && (
            <CodeCommandInterface
                onExecuteCommand={handleExecuteCommand}
                commandHistory={commandHistory}
                coherence={coherence}
                disabled={appState === 'meditating'}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
