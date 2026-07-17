import { Conversation } from './conversation';
import { Message } from './chat';

export interface ChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
}

export interface ChatResponse {
  message: Message;
  conversationId: string;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
