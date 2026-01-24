"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoOff, Box, Circle, Triangle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CodeCommandInterface from '@/components/anitch/CodeCommandInterface';
import PhysicalBuilder from '@/components/anitch/PhysicalBuilder';

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

// Component to render the created objects
const SceneObject = ({ object }) => {
  const icons = {
    cube: <Box className="w-full h-full" />,
    sphere: <Circle className="w-full h-full" />,
    pyramid: <Triangle className="w-full h-full" />,
  };

  return (
    <motion.div
      key={object.id}
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={springConfig}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      className="absolute w-24 h-24 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,217,255,0.7)]"
      style={{
        left: `${object.x}%`,
        top: `${object.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {icons[object.type] || <Sparkles className="w-full h-full" />}
    </motion.div>
  );
};

const CoherenceBar = ({ value }) => (
    <motion.div 
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-80 z-40"
    >
        <div className="text-center mb-1">
            <span className="font-mono text-sm text-[#00d9ff]" style={{textShadow: '0 0 5px rgba(0, 217, 255, 0.7)'}}>COHERENCE</span>
        </div>
        <div className="w-full bg-black/50 border border-cyan-500/30 rounded-full h-4 p-1">
            <motion.div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
         <div className="text-center mt-1">
            <span className="font-mono text-lg font-bold text-white">{value}%</span>
        </div>
    </motion.div>
);


export default function Home() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const [coherence, setCoherence] = useState(100);
  const [commandHistory, setCommandHistory] = useState<{command: string, timestamp: number}[]>([]);
  const [sceneObjects, setSceneObjects] = useState<any[]>([]);

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
          description: 'Please enable camera permissions to use the AR experience.',
        });
      }
    };
    getCameraPermission();
  }, [toast]);
  
  const handleCoherenceChange = useCallback((change: number) => {
    setCoherence(prev => Math.max(0, Math.min(100, prev + change)));
  }, []);

  const handleExecuteCommand = useCallback((command: string) => {
    setCommandHistory(prev => [...prev, { command, timestamp: Date.now() }]);
  }, []);

  const handleCreateObject = useCallback(({ type, coherenceCost }) => {
    if (coherence + coherenceCost < 0) {
      toast({
        title: "Insufficient Coherence",
        description: "Not enough coherence to manifest this object.",
        variant: "destructive",
      });
      return;
    }
    
    const newObject = {
      id: Date.now(),
      type,
      x: 20 + Math.random() * 60, // Random position on screen
      y: 20 + Math.random() * 60,
    };
    setSceneObjects(prev => [...prev, newObject]);
    handleCoherenceChange(coherenceCost);

    toast({
        title: "Object Manifested",
        description: `${type} appeared in reality.`,
    });

  }, [coherence, handleCoherenceChange, toast]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black font-mono">
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay muted playsInline />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      <main className="relative z-20 w-full h-screen">
        {hasCameraPermission === false && (
             <div className="w-full h-full flex items-center justify-center">
                <Card className="max-w-md bg-destructive/50 backdrop-blur-lg border-destructive text-destructive-foreground">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><VideoOff /> Camera Access Denied</CardTitle>
                        <CardDescription className="text-destructive-foreground/80">Please enable camera permissions in your browser settings to use the AR experience.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )}

        {hasCameraPermission && (
            <>
                <AnimatePresence>
                    {sceneObjects.map(obj => (
                        <SceneObject key={obj.id} object={obj} />
                    ))}
                </AnimatePresence>
                
                <CoherenceBar value={coherence} />

                <AnimatePresence>
                    {coherence >= 5 && <PhysicalBuilder onCreateObject={handleCreateObject} />}
                </AnimatePresence>
                
                <CodeCommandInterface 
                    onExecuteCommand={handleExecuteCommand}
                    commandHistory={commandHistory}
                    coherence={coherence}
                    onCoherenceChange={handleCoherenceChange}
                />
            </>
        )}
      </main>
    </div>
  );
}
