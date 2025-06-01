import React, { useState, useEffect } from "react";
import { PathConversion } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, CheckCircle2, Zap } from "lucide-react";

import PathInput from "../components/converter/PathInput";
import PathOutput from "../components/converter/PathOutput";
import OSSelector from "../components/converter/OSSelector";
import UsernameInput from "../components/converter/UsernameInput"; // UsernameInput now only takes targetUsername
import { PathConverter } from "../components/utils/pathConverter";

export default function ConverterPage() {
  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [sourceOS, setSourceOS] = useState("windows");
  const [targetOS, setTargetOS] = useState("macos");
  // originalUsername will be extracted inside performConversion, not kept as separate state
  const [targetUsername, setTargetUsername] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadUserSettings();
  }, []);

  // This effect now primarily clears output and alerts if input is empty
  useEffect(() => {
    if (!inputPath.trim()) {
      setOutputPath("");
      setAlert(null);
    }
    // Auto-detection of source OS can still be useful for user convenience
    const autoDetectedOS = PathConverter.detectOS(inputPath);
    if (autoDetectedOS && autoDetectedOS !== sourceOS) {
      // Suggests to the user or auto-updates if desired
      // For now, let's auto-update sourceOS if it changes and user hasn't manually set it
      // This avoids needing a separate 'detectedOS' state for display
      setSourceOS(autoDetectedOS);
      // Smartly update targetOS if source changes
      if (autoDetectedOS === "windows" && targetOS === "windows") setTargetOS("macos");
      if (autoDetectedOS === "macos" && targetOS === "macos") setTargetOS("windows");
    }
  }, [inputPath]);


  const loadUserSettings = async () => {
    try {
      const user = await User.me();
      if (user.default_username) {
        setTargetUsername(user.default_username);
      }
      if (user.default_source_os) {
        setSourceOS(user.default_source_os);
      }
      if (user.default_target_os) {
        setTargetOS(user.default_target_os);
      }
    } catch (error) {
      // console.error("Failed to load user settings:", error); // Optional: log for dev
    }
  };

  const saveUserSettings = async () => {
    try {
      await User.updateMyUserData({ 
        default_username: targetUsername,
        default_source_os: sourceOS,
        default_target_os: targetOS
      });
    } catch (error) {
      // console.error("Failed to save user settings:", error); // Optional: log for dev
    }
  };

  const performConversion = () => {
    if (!inputPath.trim()) {
      setAlert({ type: "error", message: "Please enter a path to convert." });
      return;
    }

    setIsConverting(true);
    setAlert(null);

    setTimeout(() => {
      try {
        const validation = PathConverter.validatePath(inputPath); // Basic validation
        if (!validation.isValid) {
          setAlert({ type: "error", message: validation.error });
          setOutputPath("");
          setIsConverting(false);
          return;
        }

        // Extract original username here, based on the selected sourceOS
        const extractedOriginalUsername = PathConverter.extractUsername(inputPath, sourceOS);

        const converted = PathConverter.convertPath(
          inputPath,
          sourceOS,
          targetOS,
          extractedOriginalUsername, // Pass the freshly extracted username
          targetUsername
        );
        
        setOutputPath(converted);
        
        if (converted === inputPath) {
          setAlert({ type: "info", message: "Path is already in the correct format or no changes were needed." });
        } else {
          setAlert({ type: "success", message: "Path converted successfully!" });
          saveConversionToHistory(converted, extractedOriginalUsername);
        }

      } catch (error) {
        console.error("Conversion error:", error);
        setAlert({ type: "error", message: "An error occurred during conversion." });
        setOutputPath("");
      } finally {
        setIsConverting(false);
      }
    }, 200);
  };

  const saveConversionToHistory = async (convertedPath, originalUsernameForHistory) => {
    try {
      await PathConversion.create({
        original_path: inputPath,
        converted_path: convertedPath,
        source_os: sourceOS,
        target_os: targetOS,
        original_username: originalUsernameForHistory, // Save the username that was part of the conversion
        target_username: targetUsername
      });
    } catch (error) {
      // console.error("Failed to save conversion:", error); // Optional: log for dev
    }
  };

  const handleLoadSavedUsername = async () => {
    try {
      const user = await User.me();
      if (user.default_username) {
        setTargetUsername(user.default_username);
        setAlert({ type: "success", message: "Loaded saved username from settings." });
      } else {
        setAlert({ 
          type: "info", 
          message: "No saved username found in settings. Please enter your username manually." 
        });
      }
    } catch (error) {
      setAlert({ 
        type: "info", 
        message: "Could not load settings. Please enter username manually." 
      });
    }
  };

  const clearAll = () => {
    setInputPath("");
    setOutputPath("");
    // Target username might be a preference, so don't clear it automatically
    // setTargetUsername(""); 
    setAlert(null);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Path Converter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Seamlessly convert file paths between Windows and macOS. Perfect for OneDrive sharing across different operating systems.
          </p>
        </motion.div>

        {/* Alert */}
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
            >
              <Alert className={`glass-effect border ${
                alert.type === "error" 
                  ? "border-red-200 bg-red-50/80" 
                  : alert.type === "success"
                  ? "border-green-200 bg-green-50/80"
                  : "border-blue-200 bg-blue-50/80"
              }`}>
                {alert.type === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : alert.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-blue-500" />
                )}
                <AlertDescription className="font-medium">{alert.message}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {/* OS Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <OSSelector
              sourceOS={sourceOS}
              targetOS={targetOS}
              onSourceChange={setSourceOS}
              onTargetChange={setTargetOS}
            />
          </motion.div>
          
          {/* Username Configuration - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UsernameInput
              targetUsername={targetUsername}
              onTargetUsernameChange={setTargetUsername}
              onLoadSavedUsername={handleLoadSavedUsername}
            />
          </motion.div>

          {/* Path Conversion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-dark rounded-2xl p-8 border border-white/30"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <PathInput
                value={inputPath}
                onChange={setInputPath}
                currentSourceOS={sourceOS} // Display based on selection
                placeholder={`Enter path here...
e.g., ${sourceOS === "windows" 
  ? "C:\\Users\\your.name\\OneDrive..." 
  : "/Users/your.name/OneDrive..."
}`}
              />

              <PathOutput
                value={outputPath}
                targetOS={targetOS} // Display based on selection
              />
            </div>

            {/* Convert Button */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => {
                  performConversion();
                  saveUserSettings(); // Save preferences on convert click
                }}
                disabled={isConverting}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 px-8 py-3 h-auto text-lg font-semibold"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    Convert Path
                  </>
                )}
              </Button>
              
              <Button
                onClick={clearAll}
                variant="outline"
                className="glass-effect border-white/30 hover:bg-white/60 px-6 text-base"
              >
                Clear
              </Button>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-6 border border-white/30"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">For Best Results:</h4>
                <ul className="space-y-1">
                  <li>• Select correct source and target operating systems using dropdowns.</li>
                  <li>• Enter your target username to ensure paths match your system.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Understanding Paths:</h4>
                <ul className="space-y-1">
                  <li>• Windows: Typically <code>C:\Users\YourUsername\...</code></li>
                  <li>• macOS: Typically <code>/Users/YourUsername/...</code></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}