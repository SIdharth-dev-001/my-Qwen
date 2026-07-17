import React, { useState } from 'react';
import { Message } from '../../types/chat';
import { Avatar } from '../common/Avatar';
import { ChatBubble } from './ChatBubble';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TypingIndicator } from './TypingIndicator';
import { formatMessageTime } from '../../utils/formatter';
import { copyToClipboard } from '../../utils/helpers';
import { Copy, Check, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      toast.success('Message content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`flex gap-3 w-full py-4 px-2 hover:bg-zinc-900/10 group rounded-xl transition-all duration-300 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Profile Avatar Column */}
      <Avatar role={message.role} size="md" />

      {/* Main Message Body & Actions */}
      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Username/Role & Time */}
        <div className="flex items-center gap-2 px-1 select-none">
          <span className="text-xs font-medium text-zinc-400">
            {isUser ? 'You' : 'My Qwen'}
          </span>
          <span className="text-[10px] text-zinc-600">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>

        {/* Content bubble */}
        <ChatBubble role={message.role}>
          {message.isStreaming && !message.content ? (
            <TypingIndicator />
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </ChatBubble>

        {/* Bubble Actions - Display on Hover */}
        {!message.isStreaming && (
          <div
            className={`flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-1.5 select-none ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {/* Regenerate Button (AI messages only) */}
            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
                title="Regenerate response (UI trigger)"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
