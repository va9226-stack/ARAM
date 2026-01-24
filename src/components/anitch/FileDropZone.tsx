"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Loader, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const FileDropZone = ({ onFilesDropped, onAnalyze, files, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesDropped(acceptedFiles);
  }, [onFilesDropped]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl"
    >
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="h-12 w-12" />
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop the files here...' : 'Drag & drop project files here, or click to select'}
              </p>
              <p className="text-sm">All files will be analyzed by an AI to determine build steps.</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 text-left w-full">
              <h3 className="text-lg font-semibold text-foreground mb-2">Selected Files:</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto p-3 bg-muted/50 rounded-lg border">
                {files.map((file, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>{file.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={onAnalyze}
              disabled={isLoading || files.length === 0}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};
