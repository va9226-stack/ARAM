"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const CoherenceMeter = ({ coherence }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-6 left-6 z-30"
    >
      <div className="bg-[#1a1a3e]/80 backdrop-blur-md border border-[#00d9ff]/30 rounded-lg p-3 flex items-center gap-3">
        <Sparkles className="text-[#00d9ff]" />
        <div className="w-40">
          <p className="text-xs text-[#00d9ff] font-mono mb-1">COHERENCE</p>
          <div className="w-full bg-[#00d9ff]/20 rounded-full h-2.5">
            <motion.div
              className="bg-gradient-to-r from-[#00d9ff] to-[#d4af37] h-2.5 rounded-full"
              style={{ width: `${coherence}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
        <span className="text-xl font-mono font-bold text-white">{coherence}%</span>
      </div>
    </motion.div>
  );
};
