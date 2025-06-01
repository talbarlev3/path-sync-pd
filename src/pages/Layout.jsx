
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRightLeft, History, Settings, Zap } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --primary: #4f46e5;
          --primary-dark: #3730a3;
          --secondary: #1a1d3a;
          --accent: #06b6d4;
          --surface: rgba(255, 255, 255, 0.9);
          --surface-dark: rgba(255, 255, 255, 0.95);
        }
        
        body {
          font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.02em;
        }
        
        .glass-effect {
          background: var(--surface);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-effect-dark {
          background: var(--surface-dark);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Converter")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">PathSync</h1>
                <p className="text-xs text-slate-500 font-medium">Cross-Platform Path Converter</p>
              </div>
            </Link>
            
            <nav className="flex items-center gap-2">
              <Link 
                to={createPageUrl("Converter")} 
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === createPageUrl("Converter")
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
                }`}
              >
                <ArrowRightLeft className="w-4 h-4 inline mr-2" />
                Convert
              </Link>
              <Link 
                to={createPageUrl("History")} 
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === createPageUrl("History")
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
                }`}
              >
                <History className="w-4 h-4 inline mr-2" />
                History
              </Link>
              <Link 
                to={createPageUrl("Settings")} 
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === createPageUrl("Settings")
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Built for seamless cross-platform file sharing • OneDrive optimized
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
