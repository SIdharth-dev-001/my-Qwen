import { Message } from './chat';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  model: string;
  isFavorite?: boolean;
}
