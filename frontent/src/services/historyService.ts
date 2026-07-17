import { Conversation } from '../types/conversation';
import { MOCK_CONVERSATIONS } from '../mock/history';
import { getLocalStorage, setLocalStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * History service proxy layer.
 * Manages operations on standard conversations.
 */
export const historyService = {
  /**
   * Retrieves all conversations, falling back to mock datasets if local storage is empty
   */
  async getHistory(): Promise<Conversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cached = getLocalStorage<Conversation[] | null>(STORAGE_KEYS.CONVERSATIONS, null);
    if (!cached) {
      setLocalStorage(STORAGE_KEYS.CONVERSATIONS, MOCK_CONVERSATIONS);
      return MOCK_CONVERSATIONS;
    }
    return cached;
  },

  /**
   * Deletes a conversation from the listing
   */
  async deleteConversation(id: string, currentConversations: Conversation[]): Promise<Conversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const filtered = currentConversations.filter(c => c.id !== id);
    setLocalStorage(STORAGE_KEYS.CONVERSATIONS, filtered);
    return filtered;
  },

  /**
   * Renames a specific conversation title
   */
  async renameConversation(id: string, newTitle: string, currentConversations: Conversation[]): Promise<Conversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const updated = currentConversations.map(c => {
      if (c.id === id) {
        return {
          ...c,
          title: newTitle,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);
    return updated;
  },

  /**
   * Toggles bookmark/favorite status on a conversation
   */
  async toggleFavorite(id: string, currentConversations: Conversation[]): Promise<Conversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const updated = currentConversations.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isFavorite: !c.isFavorite
        };
      }
      return c;
    });
    setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);
    return updated;
  }
};
