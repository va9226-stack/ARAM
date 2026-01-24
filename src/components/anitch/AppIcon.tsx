"use client";

import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AppIcon({ projectName, onIconClick, icon = "🚀" }: { projectName: string; onIconClick: () => void; icon?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -200 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 200 }}
            onClick={onIconClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute z-50 flex cursor-pointer flex-col items-center gap-2"
          >
            <div className="relative">
                <motion.div 
                    className="absolute -inset-2 rounded-full bg-primary/50" 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/50 bg-black/50 backdrop-blur-lg shadow-2xl shadow-primary/50">
                    <span className="text-5xl">{icon}</span>
                </div>
            </div>
            <p className="text-sm font-medium text-white drop-shadow-lg">{projectName}</p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-black/50 text-white border-primary/50">
          <p>Click to download the build script!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
