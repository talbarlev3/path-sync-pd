import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Wand2 } from "lucide-react";
import UsernameHelp from "./UsernameHelp"; // Keep the help component available

export default function UsernameInput({ 
  targetUsername, 
  onTargetUsernameChange, 
  onLoadSavedUsername 
}) {
  return (
    <div className="space-y-6">
      <div className="glass-effect-dark rounded-2xl p-6 border border-white/30">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Target Username
        </h3>
        
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-600">Your Username for Converted Path</Label>
          <div className="flex gap-2">
            <Input
              value={targetUsername}
              onChange={(e) => onTargetUsernameChange(e.target.value)}
              className="glass-effect border-white/30 focus:border-indigo-300 focus:ring-indigo-200 font-mono text-base h-12"
              placeholder="Enter your system username"
            />
            <Button
              onClick={onLoadSavedUsername}
              variant="outline"
              size="icon"
              className="glass-effect border-white/30 hover:bg-white/60 h-12 w-12"
              title="Load saved username from settings"
            >
              <Wand2 className="w-5 h-5" />
            </Button>
          </div>
           <p className="text-xs text-slate-500 mt-2">
            This username will replace any detected username from the original path to match your system.
            If the original path doesn't contain a recognizable user folder (e.g., <code>/Users/name</code> or <code>C:\Users\name</code>), this might not be used.
          </p>
        </div>
      </div>

      <UsernameHelp /> {/* Users might still want to know how to find their username */}
    </div>
  );
}