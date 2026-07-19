import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function ChatWindow() {
  const {
    conversations,
    currentConversationId,
    sendMessage,
    isStreaming,
    isLoading
  } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);

  // Retrieve active conversation
  const activeConversation = conversations.find((c) => c.id === currentConversationId);
  const messages = activeConversation?.messages || [];

  // Scroll to bottom on updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length, isStreaming]);

  const handleSelectSuggested = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 flex-1 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="glow-blob-purple top-1/4 right-1/4" />
      <div className="glow-blob-blue bottom-1/4 left-1/4" />

      {/* Message Window Frame */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col scrollbar-thin">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mb-3"
            />
            <span className="text-xs text-zinc-500 font-mono">Restoring threads...</span>
          </div>
        ) : messages.length === 0 ? (
          /* Welcome state */
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-12">
            
            {/* Animated Logo Frame */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative p-5 bg-gradient-to-tr from-primary to-primary-hover rounded-3xl shadow-xl shadow-primary/20 mb-5 border border-white/10 glow-border"
            >
              <Bot className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full border border-zinc-950 shadow">
                <Sparkles className="h-3 w-3 text-zinc-950" />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-2 text-center"
            >
              My Qwen
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-sm text-zinc-400 text-center font-medium max-w-md mb-10 select-none leading-relaxed"
            >
              Your premium personal AI assistant engineered for high-performance reasoning on a fluid canvas.
            </motion.p>

            {/* Suggestions cards layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full flex flex-col items-center gap-3 select-none"
            >
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Suggested Starters</span>
              </div>
              <SuggestedQuestions onSelect={handleSelectSuggested} />
            </motion.div>

          </div>
        ) : (
          /* Conversation stream log */
          <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col divide-y divide-zinc-900/40">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={() => {
                  // Re-send the last user message
                  const userMsgs = messages.filter(m => m.role === 'user');
                  if (userMsgs.length > 0) {
                    const lastUserMsg = userMsgs[userMsgs.length - 1];
                    sendMessage(lastUserMsg.content);
                  }
                }}
              />
            ))}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="py-4 md:py-6 border-t border-zinc-900/50 bg-zinc-950/60 backdrop-blur-md sticky bottom-0 z-10">
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </div>

    </div>
  );
}

export default ChatWindow;
