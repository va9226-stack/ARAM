"use client";

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AppIcon({ projectName, onDrop }: { projectName: string; onDrop: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -200 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 200 }}
            drag
            onDragEnd={(event, info) => {
              // Heuristic to check if it was "dropped" downwards, simulating a drag to desktop
              if (info.point.y > window.innerHeight * 0.6) {
                onDrop();
              }
            }}
            dragElastic={0.1}
            className="absolute z-50 flex cursor-grab flex-col items-center gap-2"
            whileTap={{ cursor: 'grabbing' }}
          >
            <div className="relative">
                <motion.div 
                    className="absolute -inset-2 rounded-full bg-primary/50" 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/50 bg-black/50 backdrop-blur-lg shadow-2xl shadow-primary/50">
                    <Package className="h-12 w-12 text-primary" />
                </div>
            </div>
            <p className="text-sm font-medium text-white drop-shadow-lg">{projectName}</p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-black/50 text-white border-primary/50">
          <p>Drag me to your "desktop" (bottom of screen) to download the build script!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
