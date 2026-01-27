
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Circle, Triangle, Rocket } from 'lucide-react';

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

const shapeComponents = {
  cube: Box,
  sphere: Circle,
  pyramid: Triangle,
  app: Rocket,
};

interface SceneObjectProps {
  id: string;
  type: keyof typeof shapeComponents;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const SceneObject = ({ id, type, onSelect, isSelected }: SceneObjectProps) => {
  const Icon = shapeComponents[type] || Box;

  const isApp = type === 'app';

  return (
    <motion.div
      layoutId={id}
      drag
      dragMomentum={false}
      onTap={() => onSelect(id)}
      initial={{ opacity: 0, scale: 0.5, x: '45vw', y: '40vh' }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={springConfig}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      whileHover={{ scale: 1.1 }}
      className={`absolute cursor-grab active:cursor-grabbing w-24 h-24 p-4 rounded-lg flex items-center justify-center transition-colors ${
        isSelected
          ? 'bg-[#d4af37]/30 border-2 border-[#d4af37]'
          : isApp
          ? 'bg-primary/20 border-primary'
          : 'bg-[#1a1a3e]/80 backdrop-blur-sm border border-[#00d9ff]/30'
      }`}
      style={{
        boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.5)' : isApp ? '0 0 20px rgba(91, 155, 240, 0.5)' : '0 0 10px rgba(0, 217, 255, 0.2)',
      }}
    >
      <Icon className={`w-full h-full transition-colors ${isSelected ? 'text-[#d4af37]' : isApp ? 'text-primary' : 'text-[#00d9ff]'}`} strokeWidth={1} />
    </motion.div>
  );
};
