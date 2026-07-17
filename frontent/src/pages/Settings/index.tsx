import React from 'react';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { APP_VERSION, AVAILABLE_MODELS } from '../../utils/constants';
import { motion } from 'motion/react';
import { pageTransition } from '../../utils/animations';
import { Settings, Moon, Sun, Monitor, Shield, Database, Sparkles, Check, HelpCircle, LogOut, Info } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { selectedModel, setSelectedModel, apiUrl, clearAllConversations } = useChat();
  const { theme, toggleTheme } = useTheme();

  const handleResetHistory = () => {
    if (window.confirm('This action will permanently wipe out all conversation histories from local cache. This is irreversible! Proceed?')) {
      clearAllConversations();
    }
  };

  const handleSaveSettings = () => {
    toast.success('Settings synced successfully.');
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full flex flex-col overflow-y-auto px-4 md:px-10 py-8 select-none bg-zinc-950/20"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Settings Dashboard
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Customize model preferences, core connections, and memory parameters.
          </p>
        </div>

        {/* Section 1: Preference Panels */}
        <div className="flex flex-col gap-4">
          
          {/* Card: Theme styling */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Settings className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-display font-semibold text-white text-sm">
                Visual Theme Settings
              </h2>
            </div>
            
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-1 select-none">
              <div>
                <span className="text-xs font-semibold text-zinc-200">Toggle Theme Color</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Toggle between high-contrast light and soft midnight canvases.</p>
              </div>
              
              <Button
                onClick={toggleTheme}
                variant="secondary"
                size="sm"
                leftIcon={theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </Card>

          {/* Card: Model Selection defaults */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-display font-semibold text-white text-sm">
                Default AI Model Selection
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 select-none">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = model.name === selectedModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.name);
                      toast.success(`Active model set to ${model.name}`);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary/5 border-primary text-white shadow-md shadow-primary/5'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{model.name}</span>
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-primary/20 text-primary font-bold' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {model.tier}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
                      {model.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Card: Integration endpoints (API Key is handled server-side / automatically by platform) */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Database className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-display font-semibold text-white text-sm">
                Gateway & Endpoints
              </h2>
            </div>

            <div className="flex flex-col gap-3 mt-1 select-none">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-300">Core API URL</span>
                  <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded">READ ONLY</span>
                </div>
                <input
                  type="text"
                  value={apiUrl}
                  disabled
                  className="w-full bg-zinc-900/40 text-zinc-500 placeholder-zinc-500 text-xs rounded-lg border border-zinc-800/80 py-2.5 px-3.5 outline-none cursor-not-allowed select-all"
                />
                <p className="text-[9px] text-zinc-600 leading-normal">
                  The active routing endpoint used to proxy Qwen inference requests. This is isolated within the Express service tier.
                </p>
              </div>
            </div>
          </Card>

          {/* Card: Danger Zone / Reset */}
          <Card className="p-5 flex flex-col gap-4 border-red-500/15">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4.5 w-4.5 text-red-400" />
              <h2 className="font-display font-semibold text-white text-sm">
                Maintenance & Safety
              </h2>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-1 select-none">
              <div>
                <span className="text-xs font-semibold text-zinc-200">Wipe Local Threads Cache</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Purges every saved conversation archive from this device's memory.</p>
              </div>
              <Button
                onClick={handleResetHistory}
                variant="danger"
                size="sm"
              >
                Reset Cache
              </Button>
            </div>
          </Card>

          {/* Card: About My Qwen */}
          <Card className="p-5 bg-gradient-to-br from-zinc-950 to-zinc-900 border-zinc-800/80 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-display font-semibold text-white text-sm">
                About My Qwen
              </h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              **My Qwen** is an exploratory, high-fidelity conversational client fine-tuned for the Qwen-2.5 series language model architecture. Engineered with responsive glassmorphism layers, fluid drag animations, synchronized conversation memory states, and real-time Markdown styling with instant clipboard copy blocks.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 border-t border-zinc-900 pt-3.5 mt-2">
              <span>Client Version: {APP_VERSION}</span>
              <span>Architecture: React + TypeScript + Vite</span>
            </div>
          </Card>

        </div>

      </div>
    </motion.div>
  );
}

export default SettingsPage;
