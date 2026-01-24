"use client";

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CameraView } from '@/components/anitch/CameraView';
import { CoherenceMeter } from '@/components/anitch/CoherenceMeter';
import { SceneObject } from '@/components/anitch/SceneObject';
import CodeCommandInterface from '@/components/anitch/CodeCommandInterface';
import PhysicalBuilder from '@/components/anitch/PhysicalBuilder';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';


type SceneObjectType = {
  id: string;
  type: 'cube' | 'sphere' | 'pyramid';
};

export default function Home() {
  const [coherence, setCoherence] = useState(100);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectType[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<{ command: string; timestamp: number }[]>([]);
  const [showBuilder, setShowBuilder] = useState(true);
  const [showCLI, setShowCLI] = useState(true);

  const handleCoherenceChange = (amount: number) => {
    setCoherence(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  const handleCreateObject = useCallback((obj: { type: 'cube' | 'sphere' | 'pyramid', coherenceCost: number }) => {
    if (coherence + obj.coherenceCost < 0) return;
    
    const newObject: SceneObjectType = {
      id: `obj-${Date.now()}`,
      type: obj.type,
    };
    setSceneObjects(prev => [...prev, newObject]);
    handleCoherenceChange(obj.coherenceCost);
  }, [coherence]);

  const handleExecuteCommand = (command: string) => {
    setCommandHistory(prev => [...prev, { command, timestamp: Date.now() }]);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0a0e27]">
      <CameraView />
      <div className="absolute inset-0 bg-black/30" />
      
      <CoherenceMeter coherence={coherence} />
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-30 flex gap-2"
      >
        <button 
          onClick={() => setShowBuilder(!showBuilder)} 
          className="p-2 rounded-lg bg-[#1a1a3e]/80 backdrop-blur-md border border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/20"
        >
          <SlidersHorizontal size={20} />
        </button>
      </motion.div>


      <main className="relative z-10 w-full h-screen" onClick={(e) => {
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
      </main>

      <AnimatePresence>
        {showBuilder && <PhysicalBuilder onCreateObject={handleCreateObject} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {showCLI && (
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
