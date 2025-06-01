import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Monitor, Laptop, ArrowRightLeft } from "lucide-react";

export default function OSSelector({ sourceOS, targetOS, onSourceChange, onTargetChange }) {
  const osOptions = [
    { value: "windows", label: "Windows", icon: <Monitor className="w-4 h-4 mr-2" /> },
    { value: "macos", label: "macOS", icon: <Laptop className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="glass-effect-dark rounded-2xl p-6 border border-white/30">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5" />
        Conversion Direction
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6 items-end">
        {/* Source OS */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-600">From (Source OS)</Label>
          <Select value={sourceOS} onValueChange={onSourceChange}>
            <SelectTrigger className="glass-effect border-white/30 h-12 text-base">
              <SelectValue placeholder="Select source OS" />
            </SelectTrigger>
            <SelectContent>
              {osOptions.map(option => (
                <SelectItem key={`source-${option.value}`} value={option.value} className="text-base py-2">
                  <div className="flex items-center">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target OS */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-600">To (Target OS)</Label>
          <Select value={targetOS} onValueChange={onTargetChange}>
            <SelectTrigger className="glass-effect border-white/30 h-12 text-base">
              <SelectValue placeholder="Select target OS" />
            </SelectTrigger>
            <SelectContent>
              {osOptions.map(option => (
                <SelectItem key={`target-${option.value}`} value={option.value} className="text-base py-2">
                  <div className="flex items-center">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-center">
        Select the operating system of the original path and the desired target system.
      </p>
    </div>
  );
}