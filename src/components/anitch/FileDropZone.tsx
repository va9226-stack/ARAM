"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Loader, Bot, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FileDropZone = ({ onFilesDropped, onAnalyze, files, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesDropped(acceptedFiles);
  }, [onFilesDropped]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="w-full max-w-2xl text-center flex flex-col items-center"
    >
      <div
        {...getRootProps()}
        className="relative cursor-pointer transition-all duration-300 flex items-center justify-center w-[400px] h-[250px]"
      >
        <input {...getInputProps()} />
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
        >
            <Cloud 
                className={`w-full h-full transition-colors duration-300 ${isDragActive ? 'text-primary/30' : 'text-white/20'}`} 
                strokeWidth={1}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDragActive ? 'active' : 'inactive'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-2"
                >
                  {isDragActive ? (
                    <>
                      <UploadCloud className="w-16 h-16 text-primary" />
                      <p className="text-xl font-semibold text-primary">Drop to build</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-semibold">Drop files into the cloud</p>
                      <p className="text-sm text-white/60 mt-1">or click to select</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
        </motion.div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 text-left w-full max-w-md">
          <h3 className="text-lg font-semibold text-white mb-2">Dropped Files:</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto p-3 bg-black/20 rounded-lg border border-white/10">
            {files.map((file, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                <FileText className="w-4 h-4 text-primary" />
                <span>{file.name}</span>
                <span className="ml-auto text-xs text-white/50">{(file.size / 1024).toFixed(2)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <Button 
            size="lg"
            onClick={onAnalyze} 
            disabled={isLoading || files.length === 0}
            className="bg-primary/80 hover:bg-primary text-white font-bold text-lg"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-5 w-5" />
              Analyze Project
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
