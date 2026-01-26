"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';

export const GeminiResponse = ({ response, onClose }: { response: string, onClose: () => void }) => {

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
        opacity: 0,
        y: -20,
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-4xl"
    >
        <Card className="w-full bg-card/80 backdrop-blur-lg border-primary/30 shadow-2xl shadow-primary/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                         <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}>
                            <ArrowLeft />
                         </Button>
                         <div>
                            <CardTitle className="text-2xl md:text-3xl font-bold holographic-text">
                                Gemini Response
                            </CardTitle>
                            <CardDescription className="mt-1">A message from the AI oracle.</CardDescription>
                         </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Bot className="w-8 h-8 text-primary" />
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent>
                <motion.div variants={itemVariants}>
                    <ScrollArea className="h-96">
                        <div className="p-4 rounded-lg bg-muted/50 border text-sm whitespace-pre-wrap">
                            <p>{response}</p>
                        </div>
                    </ScrollArea>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
