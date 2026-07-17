import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useChat } from '../../hooks/useChat';

export interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow heights on value modifications
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || isStreaming) return;
    onSend(text.trim());
    setText('');
    
    // Reset heights
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full relative px-4 md:px-0 select-none">
      <div className="glow-border max-w-4xl mx-auto bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40 transition-all duration-300">
        
        {/* Input box */}
        <div className="flex items-end gap-2.5 p-3.5 pl-4">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask My Qwen anything... (Shift+Enter for newline)"
            className="flex-1 bg-transparent text-white border-none outline-none text-sm placeholder-zinc-500 max-h-[180px] py-1 resize-none scrollbar-thin select-text"
            disabled={isStreaming}
          />

          {/* Action Send Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!text.trim() || isStreaming}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              text.trim() && !isStreaming
                ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
            }`}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Footer info label */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-900 bg-zinc-950/20 rounded-b-2xl">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span>Qwen 2.5 series answers in premium dark canvas.</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-zinc-600">
            <AlertCircle className="h-3 w-3" />
            <span>AI responses are simulated for styling.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
