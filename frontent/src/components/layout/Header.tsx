import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useSidebar } from '../../hooks/useSidebar';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../common/Avatar';
import { PanelLeft, ChevronDown, Sparkles, Moon, Sun, Check, Laptop } from 'lucide-react';
import { AVAILABLE_MODELS } from '../../utils/constants';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export function Header() {
  const { selectedModel, setSelectedModel } = useChat();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const activeModel = AVAILABLE_MODELS.find(m => m.name === selectedModel) || AVAILABLE_MODELS[0];

  const handleSelectModel = (modelName: string) => {
    setSelectedModel(modelName);
    setModelDropdownOpen(false);
  };

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between px-5 z-30 select-none">
      
      {/* Left controls */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}

        {/* Dynamic Model Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{selectedModel}</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {modelDropdownOpen && (
              <>
                {/* Click backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setModelDropdownOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5"
                >
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900">
                    Switch AI Model Engine
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {AVAILABLE_MODELS.map((model) => {
                      const isSelected = model.name === selectedModel;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleSelectModel(model.name)}
                          className={clsx(
                            'w-full text-left px-3.5 py-2.5 flex flex-col gap-0.5 hover:bg-zinc-900/60 transition-colors border-b border-zinc-900/30 last:border-none cursor-pointer',
                            isSelected && 'bg-primary/5'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={clsx('text-xs font-semibold', isSelected ? 'text-primary' : 'text-white')}>
                              {model.name}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 line-clamp-1">
                            {model.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        
        {/* Theme toggler */}
        <button
          onClick={toggleTheme}
          className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-zinc-900" />

        {/* Quick User Badge */}
        <div className="flex items-center gap-2 px-1">
          <Avatar role="user" size="sm" />
          <span className="text-xs font-semibold text-zinc-300 hidden sm:inline-block">
            Member
          </span>
        </div>
      </div>

    </header>
  );
}

export default Header;
