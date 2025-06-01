import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Settings, Save, User as UserIcon, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [defaultSourceOS, setDefaultSourceOS] = useState("windows");
  const [defaultTargetOS, setDefaultTargetOS] = useState("macos");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setUsername(userData.default_username || "");
      setDefaultSourceOS(userData.default_source_os || "windows");
      setDefaultTargetOS(userData.default_target_os || "macos");
    } catch (error) {
      console.error("Failed to load user settings:", error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({
        default_username: username,
        default_source_os: defaultSourceOS,
        default_target_os: defaultTargetOS
      });
      
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-lg text-slate-600">
            Customize your path conversion preferences
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Alert className="glass-effect border-green-200 bg-green-50/80">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="font-medium text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-effect-dark border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Name</Label>
                    <Input
                      value={user?.full_name || ""}
                      readOnly
                      className="glass-effect border-white/30 bg-slate-50/50 text-slate-600"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Email</Label>
                    <Input
                      value={user?.email || ""}
                      readOnly
                      className="glass-effect border-white/30 bg-slate-50/50 text-slate-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conversion Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect-dark border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Conversion Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-3 block">
                    Default Username
                  </Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your system username"
                    className="glass-effect border-white/30 focus:border-indigo-300 focus:ring-indigo-200 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    This will be used automatically when converting paths. Usually your system login name.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 mb-3 block">
                      Default Source OS
                    </Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-white/30 cursor-pointer hover:bg-white/60 transition-colors">
                        <input
                          type="radio"
                          name="sourceOS"
                          value="windows"
                          checked={defaultSourceOS === "windows"}
                          onChange={(e) => setDefaultSourceOS(e.target.value)}
                          className="text-indigo-500"
                        />
                        <span className="font-medium">Windows</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-white/30 cursor-pointer hover:bg-white/60 transition-colors">
                        <input
                          type="radio"
                          name="sourceOS"
                          value="macos"
                          checked={defaultSourceOS === "macos"}
                          onChange={(e) => setDefaultSourceOS(e.target.value)}
                          className="text-indigo-500"
                        />
                        <span className="font-medium">macOS</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-600 mb-3 block">
                      Default Target OS
                    </Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-white/30 cursor-pointer hover:bg-white/60 transition-colors">
                        <input
                          type="radio"
                          name="targetOS"
                          value="windows"
                          checked={defaultTargetOS === "windows"}
                          onChange={(e) => setDefaultTargetOS(e.target.value)}
                          className="text-indigo-500"
                        />
                        <span className="font-medium">Windows</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-white/30 cursor-pointer hover:bg-white/60 transition-colors">
                        <input
                          type="radio"
                          name="targetOS"
                          value="macos"
                          checked={defaultTargetOS === "macos"}
                          onChange={(e) => setDefaultTargetOS(e.target.value)}
                          className="text-indigo-500"
                        />
                        <span className="font-medium">macOS</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 h-12"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 border border-white/30"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              💡 Tips for Better Conversions
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700">Username:</span>
                <span>Use your exact system username for accurate path conversion</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700">OneDrive:</span>
                <span>OneDrive paths work best for cross-platform file sharing</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700">Defaults:</span>
                <span>Set your preferred conversion direction to speed up the process</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}