"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, CircleDashed, Loader, Package, Hammer, Play, Wrench, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type Status = 'pending' | 'running' | 'completed';
type Stage = 'Setup' | 'Dependencies' | 'Build' | 'Run';

interface ParsedCommand {
    command: string;
    stage: Stage;
}

const STAGE_CONFIG: Record<Stage, { icon: React.ElementType, title: string }> = {
    'Setup': { icon: Wrench, title: 'Setup' },
    'Dependencies': { icon: Package, title: 'Dependencies' },
    'Build': { icon: Hammer, title: 'Build' },
    'Run': { icon: Play, title: 'Run Simulation' },
};

const getStageForCommand = (command: string): Stage => {
    if (command.includes('venv') || command.includes('source')) return 'Setup';
    if (command.includes('install')) return 'Dependencies';
    if (command.includes('build') || command.includes('make') || command.includes('py2app')) return 'Build';
    return 'Run'; // Default, though run command is separate
}

const PipelineStage = ({ title, icon: Icon, commands, status }: { title: string, icon: React.ElementType, commands: string[], status: Status }) => {
    const statusIcons: Record<Status, React.ReactNode> = {
        pending: <CircleDashed className="h-5 w-5 text-muted-foreground" />,
        running: <Loader className="h-5 w-5 text-primary animate-spin" />,
        completed: <CheckCircle className="h-5 w-5 text-success" />,
    };

    return (
        <Card className={cn(
            "w-64 flex-shrink-0 transition-all duration-300",
            status === 'pending' && 'bg-secondary/30 border-dashed',
            status === 'running' && 'bg-primary/10 border-primary shadow-lg scale-105',
            status === 'completed' && 'bg-secondary/80 border-border'
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon className={cn(
                        "h-4 w-4",
                        status === 'running' ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    {title}
                </CardTitle>
                {statusIcons[status]}
            </CardHeader>
            <CardContent>
                {commands.length > 0 ? (
                    <ScrollArea className="h-24">
                        <div className="space-y-1 pr-4">
                            {commands.map((cmd, i) => (
                                <code key={i} className={cn(
                                    "text-xs font-mono block truncate p-1 rounded",
                                    status === 'running' ? 'text-primary-foreground' : 'text-muted-foreground'
                                )}>
                                    {cmd}
                                </code>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-24 flex items-center justify-center">
                         <p className="text-xs text-muted-foreground">No commands for this stage.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
};


export const BuildPipeline = ({ commands, runCommand }: { commands: string[], runCommand: string }) => {
    const [currentStageIndex, setCurrentStageIndex] = useState(-1);

    const pipelineStages = useMemo<{ stage: Stage; commands: string[] }[]>(() => {
        const stageMap: Record<Stage, string[]> = {
            'Setup': [],
            'Dependencies': [],
            'Build': [],
            'Run': [],
        };
        
        commands.forEach(cmd => {
            const stage = getStageForCommand(cmd);
            stageMap[stage].push(cmd);
        });

        // Add the run command to its stage
        if (runCommand) {
            stageMap['Run'].push(runCommand);
        }

        return (Object.keys(stageMap) as Stage[])
            .filter(stage => stageMap[stage].length > 0)
            .map(stage => ({
                stage,
                commands: stageMap[stage]
            }));

    }, [commands, runCommand]);

    useEffect(() => {
        setCurrentStageIndex(-1); // Reset on new commands
        if (pipelineStages.length > 0) {
            setCurrentStageIndex(0);
        }
    }, [pipelineStages]);

    useEffect(() => {
        if (currentStageIndex >= 0 && currentStageIndex < pipelineStages.length) {
            const timer = setTimeout(() => {
                setCurrentStageIndex(currentStageIndex + 1);
            }, 2500); // Simulate time for each stage

            return () => clearTimeout(timer);
        }
    }, [currentStageIndex, pipelineStages.length]);

    if (pipelineStages.length === 0) {
        return (
             <div className="p-3 bg-secondary rounded-lg border flex items-center justify-center min-h-[168px]">
                <p className="text-sm text-muted-foreground">No build steps were identified.</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {pipelineStages.map(({ stage, commands }, index) => {
                let status: Status = 'pending';
                if (index < currentStageIndex) {
                    status = 'completed';
                } else if (index === currentStageIndex) {
                    status = 'running';
                }
                const config = STAGE_CONFIG[stage];

                return (
                    <React.Fragment key={stage}>
                        <PipelineStage 
                            title={config.title}
                            icon={config.icon}
                            commands={commands}
                            status={status} 
                        />
                        {index < pipelineStages.length - 1 && (
                            <ChevronRight className={cn(
                                "h-8 w-8 text-muted-foreground/30 transition-colors",
                                status === 'completed' && "text-success"
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
