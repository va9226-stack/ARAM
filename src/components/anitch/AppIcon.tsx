"use client";

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
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
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border bg-card shadow-md">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">{projectName}</p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Click to download the build script!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
