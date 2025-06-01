import React, { useState, useEffect } from "react";
import { PathConversion } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  History, 
  Copy, 
  Check, 
  Monitor, 
  Laptop, 
  ArrowRight,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoryPage() {
  const [conversions, setConversions] = useState([]);
  const [filteredConversions, setFilteredConversions] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOS, setFilterOS] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversions();
  }, []);

  useEffect(() => {
    filterConversions();
  }, [conversions, searchTerm, filterOS]);

  const loadConversions = async () => {
    try {
      const data = await PathConversion.list("-created_date", 50);
      setConversions(data);
    } catch (error) {
      console.error("Failed to load conversions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterConversions = () => {
    let filtered = conversions;

    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.original_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.converted_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.original_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.target_username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOS !== "all") {
      filtered = filtered.filter(conv => 
        conv.source_os === filterOS || conv.target_os === filterOS
      );
    }

    setFilteredConversions(filtered);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getOSIcon = (os) => {
    return os === "windows" ? <Monitor className="w-4 h-4" /> : <Laptop className="w-4 h-4" />;
  };

  const getOSColor = (os) => {
    return os === "windows" 
      ? "bg-blue-100 text-blue-700 border-blue-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading conversion history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Conversion History
          </h1>
          <p className="text-lg text-slate-600">
            Review and reuse your previous path conversions
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect-dark rounded-2xl p-6 border border-white/30 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search paths, usernames..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-effect border-white/30 focus:border-indigo-300"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={filterOS} onValueChange={setFilterOS}>
                <SelectTrigger className="glass-effect border-white/30">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            {filteredConversions.length} conversion{filteredConversions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Conversions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredConversions.length > 0 ? (
              filteredConversions.map((conversion, index) => (
                <motion.div
                  key={conversion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-effect border-white/30 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getOSColor(conversion.source_os)}>
                            {getOSIcon(conversion.source_os)}
                            <span className="ml-1">{conversion.source_os}</span>
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <Badge className={getOSColor(conversion.target_os)}>
                            {getOSIcon(conversion.target_os)}
                            <span className="ml-1">{conversion.target_os}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {format(new Date(conversion.created_date), "MMM d, yyyy 'at' HH:mm")}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Original Path */}
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Original Path</p>
                        <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                          <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                            {conversion.original_path}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(conversion.original_path, `orig-${conversion.id}`)}
                            className="flex-shrink-0 h-8 w-8"
                          >
                            {copiedId === `orig-${conversion.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Converted Path */}
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Converted Path</p>
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-lg border border-indigo-200/50">
                          <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                            {conversion.converted_path}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(conversion.converted_path, `conv-${conversion.id}`)}
                            className="flex-shrink-0 h-8 w-8"
                          >
                            {copiedId === `conv-${conversion.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Username Mapping */}
                      {(conversion.original_username || conversion.target_username) && (
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="font-medium">Username mapping:</span>
                          <code className="px-2 py-1 bg-slate-100 rounded text-xs">
                            {conversion.original_username || "N/A"}
                          </code>
                          <ArrowRight className="w-3 h-3" />
                          <code className="px-2 py-1 bg-slate-100 rounded text-xs">
                            {conversion.target_username || "N/A"}
                          </code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  {searchTerm || filterOS !== "all" ? "No matching conversions found" : "No conversions yet"}
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterOS !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Start converting paths to see your history here"
                  }
                </p>
                {(searchTerm || filterOS !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterOS("all");
                    }}
                    className="glass-effect border-white/30 hover:bg-white/60"
                  >
                    Clear Filters
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}