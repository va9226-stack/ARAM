
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Network, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type BridgeConfig = {
  dashboardId: string;
  protocol: string;
  handshakeToken: string;
};

export const BridgePanel = ({ config, onClose }: { config: BridgeConfig, onClose: () => void }) => {

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, x: 100 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
        <Card className="w-full bg-card/80 backdrop-blur-lg border-success/30 shadow-2xl shadow-success/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                         <div>
                            <CardTitle className="text-2xl md:text-3xl font-bold holographic-text" style={{textShadow: '0 0 5px #0f0, 0 0 10px #0f0, 0 0 20px #0f0'}}>
                                Bridge Established
                            </CardTitle>
                            <CardDescription className="mt-1">Secure connection to external dashboard.</CardDescription>
                         </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}>
                            <X />
                         </Button>
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <motion.div variants={itemVariants} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                    <Network className="w-5 h-5 text-success" />
                    <p className="font-mono text-success text-sm">STATUS: CONNECTED</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Dashboard ID:</span>
                        <span className="text-foreground">{config.dashboardId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Protocol:</span>
                        <span className="text-foreground">{config.protocol}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Token:</span>
                        <span className="text-foreground font-mono text-xs break-all">{config.handshakeToken}</span>
                    </div>
                </motion.div>

                 <motion.div variants={itemVariants} className="flex justify-center pt-4">
                     <Button variant="destructive" onClick={onClose}>
                        Disconnect Bridge
                     </Button>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
