import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Terminal, 
  Monitor, 
  Laptop, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsernameHelp() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(null);

  const handleCopyCommand = async (command, id) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  const CommandBlock = ({ command, description, os, commandId }) => (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">{description}</p>
      <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
        <code className="flex-1 text-sm font-mono text-green-400">
          {command}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopyCommand(command, commandId)}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {copiedCommand === commandId ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="glass-effect border-white/30">
      <CardHeader>
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            How to find your username
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Windows Instructions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-slate-800">Windows</h3>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      CMD / PowerShell
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <CommandBlock
                      command="echo %USERNAME%"
                      description="1. Open Command Prompt (cmd) and run:"
                      os="windows"
                      commandId="win-cmd"
                    />
                    
                    <CommandBlock
                      command="$env:USERNAME"
                      description="Or in PowerShell:"
                      os="windows"
                      commandId="win-ps"
                    />
                    
                    <CommandBlock
                      command="whoami"
                      description="Alternative command (shows domain\\username):"
                      os="windows"
                      commandId="win-whoami"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/50">
                    <p className="text-xs text-blue-700">
                      <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Win + R</kbd>, 
                      type <code>cmd</code>, then press Enter to open Command Prompt quickly.
                    </p>
                  </div>
                </div>

                {/* macOS Instructions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-slate-800">macOS</h3>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      Terminal
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <CommandBlock
                      command="whoami"
                      description="1. Open Terminal and run:"
                      os="macos"
                      commandId="mac-whoami"
                    />
                    
                    <CommandBlock
                      command="echo $USER"
                      description="Or alternatively:"
                      os="macos"
                      commandId="mac-user"
                    />
                    
                    <CommandBlock
                      command="id -un"
                      description="Another option:"
                      os="macos"
                      commandId="mac-id"
                    />
                  </div>

                  <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
                    <p className="text-xs text-gray-700">
                      <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Cmd + Space</kbd>, 
                      type <code>Terminal</code>, then press Enter to open Terminal quickly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Tips */}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-lg border border-indigo-200/50">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  Pro Tips
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Common Username Formats:</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• <code>john.smith</code> (most common)</li>
                      <li>• <code>jsmith</code> (abbreviated)</li>
                      <li>• <code>john</code> (first name only)</li>
                      <li>• <code>user123</code> (with numbers)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Path Examples:</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• Windows: <code>C:\Users\john.smith\</code></li>
                      <li>• macOS: <code>/Users/john.smith/</code></li>
                      <li>• Your username appears after <code>/Users/</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}