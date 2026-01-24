import React from 'react';
import { motion } from 'framer-motion';
import { Box, Circle, Triangle } from 'lucide-react';

const PhysicalBuilder = ({ onCreateObject }) => {
  const shapes = [
    { id: 'cube', icon: Box, label: 'Quantum Cube', cost: 5 },
    { id: 'sphere', icon: Circle, label: 'Void Sphere', cost: 8 },
    { id: 'pyramid', icon: Triangle, label: 'Prism', cost: 6 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-20 right-6 bg-[#1a1a3e]/90 backdrop-blur-md p-4 rounded-lg border border-[#d4af37]/30 w-48 z-30"
    >
      <h3 className="text-[#d4af37] font-serif mb-4 text-sm">Manifest Object</h3>
      <div className="space-y-2">
        {shapes.map(shape => (
          <button
            key={shape.id}
            onClick={() => onCreateObject({ type: shape.id, coherenceCost: -shape.cost })}
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-[#d4af37]/10 transition-colors text-left group"
          >
            <shape.icon size={16} className="text-gray-400 group-hover:text-[#d4af37]" />
            <div>
              <div className="text-xs text-gray-300 group-hover:text-white">{shape.label}</div>
              <div className="text-[10px] text-gray-500">Cost: {shape.cost}%</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default PhysicalBuilder;
