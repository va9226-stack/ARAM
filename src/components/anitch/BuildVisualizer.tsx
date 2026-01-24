"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, CircleDashed, Loader, Package, Hammer, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'running' | 'completed';

const getIconForCommand = (command: string) => {
    if (command.includes('install')) return Package;
    if (command.includes('build') || command.includes('make')) return Hammer;
    if (command.includes('run') || command.includes('start')) return Play;
    return Hammer;
}

const BuildStep = ({ command, status }: { command: string, status: Status }) => {
    const Icon = getIconForCommand(command);

    const statusIcons: Record<Status, React.ReactNode> = {
        pending: <CircleDashed className="h-5 w-5 text-muted-foreground" />,
        running: <Loader className="h-5 w-5 text-primary animate-spin" />,
        completed: <CheckCircle className="h-5 w-5 text-success" />,
    };

    return (
        <div className={cn(
            "flex items-center gap-4 p-3 rounded-lg border transition-all duration-300",
            status === 'pending' && 'bg-secondary/30',
            status === 'running' && 'bg-primary/10 border-primary shadow-sm',
            status === 'completed' && 'bg-secondary/80 border-border'
        )}>
            <div className="flex-shrink-0">
                {statusIcons[status]}
            </div>
            <div className="flex-1 flex items-center gap-3">
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  status === 'pending' && 'text-muted-foreground/80',
                  status === 'running' && 'text-primary',
                  status === 'completed' && 'text-foreground'
                )} />
                <code className={cn(
                  "text-sm font-mono truncate",
                   status === 'pending' && 'text-muted-foreground/70',
                   status === 'running' && 'text-primary-foreground',
                   status === 'completed' && 'text-foreground'
                )}>
                    {command}
                </code>
            </div>
        </div>
    );
};

export const BuildVisualizer = ({ commands }: { commands: string[] }) => {
    const [currentStep, setCurrentStep] = useState(-1); // -1 means not started

    useEffect(() => {
        setCurrentStep(-1); // Reset on new commands
        if (commands.length > 0) {
            setCurrentStep(0);
        }
    }, [commands]);

    useEffect(() => {
        if (currentStep >= 0 && currentStep < commands.length) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 1500); // Simulate time for each step

            return () => clearTimeout(timer);
        }
    }, [currentStep, commands.length]);

    return (
        <div className="space-y-2 p-3 bg-secondary rounded-lg border">
            {commands.map((command, index) => {
                let status: Status = 'pending';
                if (index < currentStep) {
                    status = 'completed';
                } else if (index === currentStep) {
                    status = 'running';
                }
                return <BuildStep key={index} command={command} status={status} />;
            })}
        </div>
    );
};
