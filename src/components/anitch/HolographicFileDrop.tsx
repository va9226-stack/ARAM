
"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const HolographicFileDrop = ({ onFilesDropped, onCancel }: { onFilesDropped: (files: File[]) => void, onCancel: () => void }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
        onFilesDropped(acceptedFiles);
    }
  }, [onFilesDropped]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
      onDrop,
      noClick: true,
      noKeyboard: true 
    });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <Card {...getRootProps()} className="relative bg-card/80 backdrop-blur-lg border-primary/30 shadow-2xl shadow-primary/20">
        <input {...getInputProps()} />
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={onCancel}>
            <X />
        </Button>
        <CardContent className="p-8">
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border'
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <UploadCloud className="h-16 w-16 text-primary" />
              <p className="text-xl font-medium text-foreground">
                {isDragActive ? 'Release to Submit Files' : 'Drop Project Files Here'}
              </p>
              <p className="text-sm">The AI core will analyze the project structure.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={open}
            >
              <FileText className="mr-2 h-5 w-5" />
              Or Click to Select Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
