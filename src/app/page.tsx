"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import CodeCommandInterface from '@/components/anitch/CodeCommandInterface';
import PhysicalBuilder from '@/components/anitch/PhysicalBuilder';
import { SceneObject } from '@/components/anitch/SceneObject';
import { CoherenceMeter } from '@/components/anitch/CoherenceMeter';

export default function Home() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);

  // State for the new interface
  const [coherence, setCoherence] = useState(100);
  const [commandHistory, setCommandHistory] = useState<{command: string, timestamp: number}[]>([]);
  const [sceneObjects, setSceneObjects] = useState<{id: string, type: string}[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

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

  const handleCoherenceChange = (amount: number) => {
    setCoherence(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  const handleExecuteCommand = (command: string) => {
    setCommandHistory(prev => [...prev, { command, timestamp: Date.now() }]);
  };

  const handleCreateObject = (object: { type: string, coherenceCost: number }) => {
    if (coherence + object.coherenceCost < 0) {
      toast({
        variant: "destructive",
        title: "Insufficient Coherence",
        description: "Cannot manifest object.",
      });
      return;
    }
    const newObject = {
      id: `obj_${Date.now()}`,
      type: object.type,
    };
    setSceneObjects(prev => [...prev, newObject]);
    handleCoherenceChange(object.coherenceCost);
    toast({
        title: "Object Manifested",
        description: `${object.type} created in the scene.`
    })
  };
  
  const handleObjectSelection = (id: string | null) => {
    setSelectedObject(id);
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black font-mono" onClick={(e) => {
        // Deselect if clicking on the background
        if (e.target === e.currentTarget) {
            handleObjectSelection(null);
        }
    }}>
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay muted playsInline />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />

      <main className="relative z-20 w-full h-screen">
        <AnimatePresence>
            {sceneObjects.map(obj => (
                <SceneObject 
                    key={obj.id} 
                    id={obj.id}
                    type={obj.type} 
                    isSelected={selectedObject === obj.id}
                    onSelect={handleObjectSelection}
                />
            ))}
        </AnimatePresence>
        
        {hasCameraPermission && (
            <>
                <CoherenceMeter coherence={coherence} />
                <PhysicalBuilder onCreateObject={handleCreateObject} />
                <CodeCommandInterface 
                    onExecuteCommand={handleExecuteCommand}
                    commandHistory={commandHistory}
                    coherence={coherence}
                    onCoherenceChange={handleCoherenceChange}
                />
            </>
        )}

        {!hasCameraPermission && (
             <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-md bg-destructive/50 backdrop-blur-lg border border-destructive text-destructive-foreground p-6 rounded-lg">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Video /> Camera Access Denied</h2>
                    <p className="text-destructive-foreground/80 mt-2">Please enable camera permissions in your browser settings to use the AR experience.</p>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
