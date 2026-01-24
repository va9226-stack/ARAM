"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeBlockProps {
  content: string;
  language: string;
}

export default function CodeBlock({ content, language }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setHasCopied(true);
      toast({
        title: "Copied!",
        description: "Script content copied to clipboard.",
      });
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy content.",
      });
    });
  };

  return (
    <div className="relative group">
      <ScrollArea className="h-72 w-full">
        <pre className="p-4 bg-secondary rounded-md border text-sm text-gray-300 overflow-x-auto">
          <code className={`language-${language} font-code`}>{content}</code>
        </pre>
      </ScrollArea>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
        aria-label="Copy code to clipboard"
      >
        {hasCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
