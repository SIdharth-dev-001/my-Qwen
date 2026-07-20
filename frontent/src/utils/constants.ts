import { SuggestedPrompt } from '../types/chat';

export const APP_VERSION = '1.0.0';
export const DEFAULT_MODEL = 'Qwen 2.5 Instruct';

export const AVAILABLE_MODELS = [
  { id: 'qwen-2.5-instruct', name: 'Qwen 2.5 Instruct', description: 'Highly competent at coding, math, and reasoning.', tier: 'Premium' },
  { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder', description: 'Specialized model fine-tuned for software engineering tasks.', tier: 'Advanced' },
  { id: 'qwen-2.5-math', name: 'Qwen 2.5 Math', description: 'Advanced mathematical problem solver.', tier: 'Advanced' },
  { id: 'qwen-max', name: 'Qwen Max', description: 'Large flagship model for extremely complex orchestration.', tier: 'Enterprise' }
];

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'explain-python',
    label: 'Explain Python decorators',
    prompt: 'Explain Python decorators in simple terms with a real-world example of logging execution time.',
    category: 'code',
    icon: 'Brain'
  },
  {
    id: 'generate-json',
    label: 'Generate User JSON Schema',
    prompt: 'Generate a rich JSON schema for a SaaS user profile, including tiers, billing history, and granular team roles.',
    category: 'analysis',
    icon: 'Database'
  },
  {
    id: 'write-email',
    label: 'Write launch announcement email',
    prompt: 'Write an engaging launch announcement email for My Qwen, a premium AI assistant with beautiful fluid mechanics and Dark Mode design.',
    category: 'writing',
    icon: 'Mail'
  },
  {
    id: 'summarize-csv',
    label: 'Summarize CSV statistics',
    prompt: 'Explain the mathematical process of analyzing variance (ANOVA) in tabular CSV datasets, and how to write a quick Pandas script for it.',
    category: 'analysis',
    icon: 'FileText'
  },
  {
    id: 'code-review',
    label: 'Perform a React code review',
    prompt: 'Perform a strict code review on a React component that runs heavy calculations inside the main render loop without memoization.',
    category: 'code',
    icon: 'Workflow'
  }
];

export const STORAGE_KEYS = {
  THEME: 'qwen_theme',
  CONVERSATIONS: 'qwen_conversations',
  CURRENT_CONVERSATION: 'qwen_current_conv_id',
  MODEL: 'qwen_selected_model',
  API_URL: 'qwen_api_url'
};

// export const DEFAULT_API_URL = 'http://localhost:8000';
export const DEFAULT_API_URL = '/api';
