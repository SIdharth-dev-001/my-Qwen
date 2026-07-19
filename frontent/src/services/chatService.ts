import { Conversation } from '../types/conversation';
import { Message } from '../types/chat';
import { generateId } from '../utils/helpers';
// import { generateMockResponse } from '../mock/chat';
import { DEFAULT_API_URL } from '../utils/constants';

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
    conversationId: string | null,
    model: string,
    onChunk?: (chunk: string, conversationId: string) => void
  ): Promise<{
    conversationId: string | null;
    message: Message;
  }> {

  const response = await fetch(`${DEFAULT_API_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message: messageContent,
    }),
  });

  const backendConversationId =
  response.headers.get("X-Conversation-Id");
  console.log(response.headers.get("X-Conversation-Id"));
  console.log(response.headers.get("x-conversation-id"));

  if (!backendConversationId) {
    throw new Error("Backend did not return a conversation ID");
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Readable stream not available");
  }

  const decoder = new TextDecoder();

  let fullResponse = "";
  let latestResponse = "";
  let animationFrame: number | null = null;

  const flush = () => {
    animationFrame = null;

    if (onChunk) {
      onChunk(latestResponse, backendConversationId);
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    fullResponse += chunk;
    latestResponse = fullResponse;

    if (animationFrame === null) {
      animationFrame = requestAnimationFrame(flush);
    }
  }

  // Flush any remaining text
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }

  if (onChunk) {
    onChunk(fullResponse, backendConversationId);
  }

  return {
    conversationId: backendConversationId,
    message: {
      id: `msg-${generateId()}`,
      role: "assistant",
      content: fullResponse,
      timestamp: new Date().toISOString(),
    }
  };
  },
  /**
   * Creates a brand new conversation shell
   */
  // async createConversation(title: string, model: string): Promise<Conversation> {
  //   console.log("🚀 chatService.createConversation() called");
  //   await new Promise((resolve) => setTimeout(resolve, 150));
  //   const now = new Date().toISOString();
  //   return {
  //     id: `conv-${generateId()}`,
  //     title: title || 'New Conversation',
  //     model,
  //     messages: [],
  //     createdAt: now,
  //     updatedAt: now,
  //     isFavorite: false
  //   };
  // },

  /**
   * Retrieves a single conversation by ID
   */
  async getConversation(id: string, conversations: Conversation[]): Promise<Conversation | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const conv = conversations.find(c => c.id === id);
    return conv || null;
  }
};
