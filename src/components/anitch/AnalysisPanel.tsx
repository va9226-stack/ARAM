"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, Code, Layers, FileText, Download, ArrowLeft } from 'lucide-react';
import { type AnalyzeProjectOutput } from '@/ai/flows/analyze-project-flow';
import { BuildPipeline } from '@/components/anitch/BuildPipeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AnalysisPanel = ({ analysis, onBuildComplete, onReset }: { analysis: AnalyzeProjectOutput, onBuildComplete: () => void, onReset: () => void }) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
        opacity: 0,
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
      className="w-full max-w-4xl p-4 md:p-6"
    >
        <Card className="bg-black/40 backdrop-blur-xl border-white/20 text-white w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <motion.div variants={itemVariants} className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10" onClick={onReset}>
                                <ArrowLeft />
                             </Button>
                            <CardTitle className="text-2xl md:text-3xl font-bold holographic-text">
                                {analysis.projectName}
                            </CardTitle>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-white/70 mt-2">Analysis complete. Build pipeline is ready.</motion.p>
                    </div>
                    <motion.div variants={itemVariants}>
                        <Badge variant="outline" className="border-primary text-primary">{analysis.language}</Badge>
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-3"><Bot size={20} /> AI Summary</h3>
                    <div className="p-4 rounded-lg bg-black/30 border border-white/10 text-white/80 text-sm">
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
                        {analysis.dependencies.length > 0 ? analysis.dependencies.map(dep => (
                            <Badge key={dep} variant="secondary">{dep}</Badge>
                        )) : <p className="text-sm text-white/60">No key dependencies identified.</p>}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
