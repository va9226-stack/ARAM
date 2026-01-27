"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface BridgeToggleProps {
    isConnected: boolean;
    onToggle: () => void;
    coherence: number;
}

export const BridgeToggle = ({ isConnected, onToggle, coherence }: BridgeToggleProps) => {
    const canToggleOn = coherence >= 25;
    const isDisabled = !isConnected && !canToggleOn;

    const tooltipText = isDisabled ? `Need ${25 - coherence}% more coherence` : isConnected ? 'Disconnect Bridge' : 'Connect Bridge';

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 right-6 z-30"
                    >
                        <div
                            className={cn("bg-[#1a1a3e]/80 backdrop-blur-md border border-[#00d9ff]/30 rounded-lg p-3 flex items-center gap-3 transition-opacity", {
                                'border-success/50': isConnected,
                                'opacity-50 cursor-not-allowed': isDisabled,
                                'cursor-pointer': !isDisabled,
                            })}
                            onClick={isDisabled ? undefined : onToggle}
                        >
                            <Network className={cn("transition-colors", isConnected ? "text-success" : "text-muted-foreground")} />
                            <Label htmlFor="bridge-toggle" className={cn("text-sm font-mono transition-colors", isConnected ? "text-white" : "text-muted-foreground", { 'cursor-not-allowed': isDisabled, 'cursor-pointer': !isDisabled })}>
                                Bridge
                            </Label>
                            <Switch
                                id="bridge-toggle"
                                checked={isConnected}
                                onCheckedChange={onToggle}
                                disabled={isDisabled}
                                aria-readonly
                            />
                        </div>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
