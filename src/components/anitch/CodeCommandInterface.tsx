
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock } from 'lucide-react';

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

const CodeCommandInterface = ({ onExecuteCommand, commandHistory, coherence, disabled = false }) => {
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      // Small delay to ensure animation complete before focus
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  const handleExecute = useCallback(() => {
    if (!input.trim() || isExecuting) return;

    setIsExecuting(true);
    onExecuteCommand(input);

    // Simulate execution time for visual feedback on the button
    setTimeout(() => {
      setInput('');
      setIsExecuting(false);
      inputRef.current?.focus();
    }, 1000);
  }, [input, isExecuting, onExecuteCommand]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 300, transition: { duration: 0.3 } }}
      transition={springConfig}
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e27] to-[#0a0e27]/95 backdrop-blur-md border-t border-[#00d9ff]/20 p-6 z-30"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-serif text-[#d4af37] mb-4 holographic-text"
        >
          Reality Command Interface
        </motion.h2>

        <div className="mb-4 max-h-32 overflow-y-auto space-y-2">
          <AnimatePresence>
            {commandHistory.slice(-3).map((cmd, idx) => (
              <motion.div
                key={cmd.timestamp + idx}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="text-sm font-mono text-gray-400 flex items-start gap-2 overflow-hidden"
              >
                <Clock size={14} className="mt-0.5 text-[#00d9ff]" />
                <span className="flex-1">{cmd.command}</span>
                <span className="text-xs text-gray-600">
                  {new Date(cmd.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div className="flex gap-3">
            <motion.div 
              className="flex-1 relative rounded-lg"
              animate={{
                boxShadow: focus ? '0 0 15px rgba(0, 217, 255, 0.2)' : '0 0 0 rgba(0,0,0,0)',
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onKeyPress={handleKeyPress}
                placeholder="Enter reality command... (e.g., 'gemini what is reality?')"
                className="w-full bg-[#1a1a3e] text-white font-mono text-sm p-4 pr-12 rounded-lg border border-[#00d9ff]/30 focus:border-[#00d9ff] focus:outline-none resize-none h-24 transition-colors"
                style={{
                  textShadow: '0 0 5px rgba(0, 217, 255, 0.3)',
                }}
                disabled={isExecuting || disabled}
              />
              
              {isExecuting && (
                 <motion.div 
                   className="absolute inset-0 bg-[#00d9ff]/10 rounded-lg"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 >
                    <motion.div 
                        className="h-[2px] bg-[#00d9ff] absolute bottom-0 left-0"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                 </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={handleExecute}
              disabled={!input.trim() || isExecuting || disabled}
              className={`px-6 py-4 rounded-lg border transition-all flex items-center gap-2 ${
                input.trim() && !isExecuting && !disabled
                  ? 'bg-[#d4af37]/10 border-[#d4af37] hover:bg-[#d4af37]/20'
                  : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
              }`}
              whileHover={input.trim() && !isExecuting ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isExecuting ? { scale: 0.95 } : {}}
            >
              {isExecuting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Send className="text-[#d4af37]" size={20} />
                  </motion.div>
              ) : (
                <>
                  <Send className="text-[#d4af37]" size={20} />
                  <span className="font-mono text-sm hidden sm:inline">Execute</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-mono text-gray-500">
            <span>Coherence: {coherence}%</span>
            {coherence < 10 && (
              <span className="text-yellow-400 font-bold">(Gemini requires 10%)</span>
            )}
            {coherence < 20 && coherence >= 10 && (
              <span className="text-red-400 font-bold">(Manifestation requires 20%)</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 font-mono mb-2">Example Commands:</p>
          <div className="flex flex-wrap gap-2">
            {[
                'analyze project',
                'manifest sphere',
                'gemini what is the matrix?',
                'meditate',
                'connect bridge'
            ].map((cmd: string, idx: number) => (
              <motion.button
                key={idx}
                onClick={() => {
                    setInput(cmd);
                    inputRef.current?.focus();
                }}
                className="px-3 py-1 bg-[#1a1a3e]/50 border border-[#00d9ff]/20 rounded-full text-xs font-mono text-[#00d9ff] hover:border-[#00d9ff] transition-all"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 217, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                disabled={disabled}
              >
                {cmd}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CodeCommandInterface);
