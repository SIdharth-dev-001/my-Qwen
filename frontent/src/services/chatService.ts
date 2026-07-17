import { Conversation } from '../types/conversation';
import { Message } from '../types/chat';
import { generateId } from '../utils/helpers';
import { generateMockResponse } from '../mock/chat';

/**
 * Chat service proxy layer.
 * Future integration can swap this with an Axios or Fetch instance:
 * import axios from 'axios';
 * const API_URL = process.env.VITE_API_URL || 'https://api.myqwen.ai/v1';
 */
export const chatService = {
  /**
   * Sends a user message to the AI, returning an assistant response.
   * Leverages a short setTimeout to mimic actual streaming delays.
   */
  async sendMessage(
    messageContent: string,
    conversationId: string,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<Message> {
    // Simulate API network round-trip delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const replyContent = generateMockResponse(messageContent);
    
    // If a chunk handler is provided, stream the response in short intervals
    if (onChunk) {
      const words = replyContent.split(' ');
      let currentString = '';
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15)); // simulate fluid typing
        currentString += (i === 0 ? '' : ' ') + words[i];
        onChunk(currentString);
      }
    }

    return {
      id: `msg-${generateId()}`,
      role: 'assistant',
      content: replyContent,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Creates a brand new conversation shell
   */
  async createConversation(title: string, model: string): Promise<Conversation> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const now = new Date().toISOString();
    return {
      id: `conv-${generateId()}`,
      title: title || 'New Conversation',
      model,
      messages: [],
      createdAt: now,
      updatedAt: now,
      isFavorite: false
    };
  },

  /**
   * Retrieves a single conversation by ID
   */
  async getConversation(id: string, conversations: Conversation[]): Promise<Conversation | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const conv = conversations.find(c => c.id === id);
    return conv || null;
  }
};
