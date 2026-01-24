
"use client";

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AppIcon({ projectName, onIconClick }: { projectName: string; onIconClick: () => void; }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            onClick={onIconClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex cursor-pointer flex-col items-center gap-4 p-8 rounded-2xl bg-card/50 border border-primary/30"
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/20">
              <Rocket className="h-20 w-20 text-primary" />
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-foreground">{projectName}</p>
                <p className="text-sm text-muted-foreground">Build Complete</p>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Click to reset simulation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
