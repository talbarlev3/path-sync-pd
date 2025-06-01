import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Monitor, Laptop } from "lucide-react";

export default function PathOutput({ value, targetOS }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getOSIcon = () => {
    if (targetOS === "windows") return <Monitor className="w-4 h-4" />;
    if (targetOS === "macos") return <Laptop className="w-4 h-4" />;
    return null;
  };

  const getOSLabel = () => {
    if (targetOS === "windows") return "Windows Path";
    if (targetOS === "macos") return "macOS Path";
    return "Converted Path";
  };

  const getOSColor = () => {
    if (targetOS === "windows") return "bg-blue-100 text-blue-700 border-blue-200";
    if (targetOS === "macos") return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">Converted Path (Output)</Label>
        <Badge className={`${getOSColor()} border font-medium`}>
          {getOSIcon()}
          <span className="ml-1">{getOSLabel()}</span>
        </Badge>
      </div>
      <div className="relative">
        <Textarea
          value={value}
          readOnly
          className="min-h-[120px] resize-none glass-effect-dark border-white/40 text-sm font-mono leading-relaxed pr-12 bg-gradient-to-br from-white/80 to-white/60"
        />
        {value && (
          <Button
            onClick={handleCopy}
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 hover:bg-white/80 transition-all duration-200"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}