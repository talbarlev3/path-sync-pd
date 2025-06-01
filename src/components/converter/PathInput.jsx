import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Monitor, Laptop } from "lucide-react";

export default function PathInput({ value, onChange, currentSourceOS, placeholder }) {
  const getOSIcon = () => {
    if (currentSourceOS === "windows") return <Monitor className="w-4 h-4" />;
    if (currentSourceOS === "macos") return <Laptop className="w-4 h-4" />;
    return <FolderOpen className="w-4 h-4" />; 
  };

  const getOSLabel = () => {
    if (currentSourceOS === "windows") return "Windows Path (Source)";
    if (currentSourceOS === "macos") return "macOS Path (Source)";
    return "Path (Source OS selected above)";
  };

  const getOSColor = () => {
    if (currentSourceOS === "windows") return "bg-blue-100 text-blue-700 border-blue-200";
    if (currentSourceOS === "macos") return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">Original File Path (Input)</Label>
        <Badge className={`${getOSColor()} border font-medium`}>
          {getOSIcon()}
          <span className="ml-1">{getOSLabel()}</span>
        </Badge>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none glass-effect border-white/30 focus:border-indigo-300 focus:ring-indigo-200 text-sm font-mono leading-relaxed"
        // No specific validation attributes like pattern or required, allowing free-form input
      />
      <p className="text-xs text-slate-500 mt-1">
        Enter the full file or folder path you want to convert.
      </p>
    </div>
  );
}