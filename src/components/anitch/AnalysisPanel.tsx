"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, Layers, ArrowLeft } from 'lucide-react';
import { type AnalyzeProjectOutput } from '@/ai/schemas/analyze-project';
import { BuildPipeline } from '@/components/anitch/BuildPipeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AnalysisPanel = ({ analysis, onBuildComplete, onReset }: { analysis: AnalyzeProjectOutput, onBuildComplete: () => void, onReset: () => void }) => {

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
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <motion.div variants={itemVariants} className="flex items-center gap-3">
                             <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onReset}>
                                <ArrowLeft />
                             </Button>
                             <div>
                                <CardTitle className="text-2xl md:text-3xl font-bold">
                                    {analysis.projectName}
                                </CardTitle>
                                <CardDescription className="mt-1">Analysis complete. Build pipeline is ready.</CardDescription>
                             </div>
                        </motion.div>
                    </div>
                    <motion.div variants={itemVariants}>
                        <Badge variant="secondary">{analysis.language}</Badge>
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-3"><Bot size={20} /> AI Summary</h3>
                    <div className="p-4 rounded-lg bg-muted/50 border text-sm">
                        <p>{analysis.analysisSummary}</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-3"><Cpu size={20} /> Build Pipeline</h3>
                    <BuildPipeline 
                        commands={analysis.buildCommands} 
                        runCommand={analysis.runCommand}
                        onBuildComplete={onBuildComplete} 
                    />
                </motion.div>
                
                 <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-3"><Layers size={20} /> Key Dependencies</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.dependencies.length > 0 ? analysis.dependencies.map((dep: string) => (
                            <Badge key={dep} variant="secondary">{dep}</Badge>
                        )) : <p className="text-sm text-muted-foreground">No key dependencies identified.</p>}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
