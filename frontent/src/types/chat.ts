export type MessageRole = 'user' | 'assistant' | 'system';

export interface CodeBlock {
  language: string;
  code: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  isLoading?: boolean; 
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'code' | 'writing' | 'analysis' | 'general';
  icon: string;
}
