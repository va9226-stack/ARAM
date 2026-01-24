"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Circle, Triangle } from 'lucide-react';

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

const shapeComponents = {
  cube: Box,
  sphere: Circle,
  pyramid: Triangle,
};

export const SceneObject = ({ id, type, onSelect, isSelected }) => {
  const Icon = shapeComponents[type] || Box;

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
          : 'bg-[#1a1a3e]/80 backdrop-blur-sm border border-[#00d9ff]/30'
      }`}
      style={{
        boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.5)' : '0 0 10px rgba(0, 217, 255, 0.2)',
      }}
    >
      <Icon className={`w-full h-full transition-colors ${isSelected ? 'text-[#d4af37]' : 'text-[#00d9ff]'}`} strokeWidth={1} />
    </motion.div>
  );
};
