"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MeditationMode = ({ onCoherenceChange, coherence }) => {
  const [meditationTime, setMeditationTime] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  const philosophicalQuotes = [
    {
      text: "In stillness, reality crystallizes.",
      author: "Quantum Observer"
    },
    {
      text: "To create is to observe the unmanifest becoming manifest.",
      author: "The Architect's Codex"
    },
    {
      text: "Coherence flows through contemplation, chaos through haste.",
      author: "Divine Blueprint"
    },
    {
      text: "Every particle remembers the whole; every creation echoes eternity.",
      author: "Lattice Wisdom"
    },
    {
      text: "The void is not empty—it awaits your intention.",
      author: "Reality Sage"
    },
  ];

  useEffect(() => {
    const coherenceInterval = setInterval(() => {
      onCoherenceChange(2); // The parent handles not going over 100
    }, 1000);

    const timeInterval = setInterval(() => {
      setMeditationTime(prev => prev + 1);
    }, 1000);

    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % philosophicalQuotes.length);
    }, 8000);

    return () => {
      clearInterval(coherenceInterval);
      clearInterval(timeInterval);
      clearInterval(quoteInterval);
    };
  }, [onCoherenceChange]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto text-center p-8">
        {/* Breathing circle */}
        <div className="relative w-64 h-64 mx-auto mb-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#00d9ff]/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#d4af37]/30"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="text-[#d4af37]" size={48} />
            </motion.div>
          </div>

          {/* Particle orbit */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00d9ff] rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 100,
                y: Math.sin(i * 30 * Math.PI / 180) * 100,
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Philosophical quote */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <p className="text-2xl font-serif text-white mb-4 italic">
            "{philosophicalQuotes[currentQuote].text}"
          </p>
          <p className="text-sm font-mono text-[#d4af37]">
            — {philosophicalQuotes[currentQuote].author}
          </p>
        </motion.div>

        {/* Meditation stats */}
        <div className="bg-[#1a1a3e]/50 backdrop-blur-sm rounded-lg p-6 border border-[#00d9ff]/20">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-mono text-gray-400 mb-2">Time Elapsed</p>
              <p className="text-3xl font-mono text-[#00d9ff]">{formatTime(meditationTime)}</p>
            </div>
            <div>
              <p className="text-sm font-mono text-gray-400 mb-2">Coherence Restored</p>
              <p className="text-3xl font-mono text-[#d4af37]">+{meditationTime * 2}%</p>
            </div>
          </div>
        </div>

        {/* Breathing instruction */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mt-8"
        >
          <p className="text-sm font-mono text-gray-400">
            Breathe in... Hold... Breathe out...
          </p>
        </motion.div>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [-20, -100],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MeditationMode;
