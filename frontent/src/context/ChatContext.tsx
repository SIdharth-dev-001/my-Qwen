import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Conversation } from '../types/conversation';
import { Message } from '../types/chat';
import { chatService } from '../services/chatService';
import { historyService } from '../services/historyService';
import { getLocalStorage, setLocalStorage, generateId } from '../utils/helpers';
import { STORAGE_KEYS, DEFAULT_MODEL, DEFAULT_API_URL } from '../utils/constants';
import { toast } from 'sonner';

export interface ChatContextProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  selectedModel: string;
  apiUrl: string;
  isLoading: boolean;
  isStreaming: boolean;
  sidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedModel: (model: string) => void;
  setSidebarOpen: (open: boolean) => void;
  createNewChat: (initialPrompt?: string) => Promise<string>;
  selectConversation: (id: string) => void;
  deleteChat: (id: string) => Promise<void>;
  renameChat: (id: string, title: string) => Promise<void>;
  toggleFavoriteChat: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearAllConversations: () => void;
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return getLocalStorage<string>(STORAGE_KEYS.MODEL, DEFAULT_MODEL);
  });
  const [apiUrl] = useState<string>(() => {
    return getLocalStorage<string>(STORAGE_KEYS.API_URL, DEFAULT_API_URL);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const history = await historyService.getHistory();
        setConversations(history);
        
        // Restore last active conversation if valid
        const lastActiveId = getLocalStorage<string | null>(STORAGE_KEYS.CURRENT_CONVERSATION, null);
        if (lastActiveId && history.some(c => c.id === lastActiveId)) {
          setCurrentConversationId(lastActiveId);
        } else if (history.length > 0) {
          setCurrentConversationId(history[0].id);
        }
      } catch (error) {
        toast.error('Failed to load chat history.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Save active conversation id
  useEffect(() => {
    if (currentConversationId) {
      setLocalStorage(STORAGE_KEYS.CURRENT_CONVERSATION, currentConversationId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    }
  }, [currentConversationId]);

  // Save selected model
  useEffect(() => {
    setLocalStorage(STORAGE_KEYS.MODEL, selectedModel);
  }, [selectedModel]);

  // Create new chat session
  const createNewChat = useCallback(async (initialPrompt?: string): Promise<string> => {
    setIsLoading(true);
    try {
      const title = initialPrompt 
        ? (initialPrompt.length > 25 ? initialPrompt.slice(0, 25) + '...' : initialPrompt) 
        : 'New Chat';
      const newConv = await chatService.createConversation(title, selectedModel);
      
      const updatedConversations = [newConv, ...conversations];
      setConversations(updatedConversations);
      setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
      setCurrentConversationId(newConv.id);

      if (initialPrompt) {
        // We will send the initial message. Wait to update state before triggering
        setTimeout(() => {
          sendMessageWithId(initialPrompt, newConv.id);
        }, 50);
      }

      return newConv.id;
    } catch (err) {
      toast.error('Error creating new conversation.');
      console.error(err);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [conversations, selectedModel]);

  // Switch conversation
  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  // Delete chat
  const deleteChat = useCallback(async (id: string) => {
    try {
      const updated = await historyService.deleteConversation(id, conversations);
      setConversations(updated);
      toast.success('Conversation deleted.');
      if (currentConversationId === id) {
        setCurrentConversationId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      toast.error('Failed to delete conversation.');
      console.error(err);
    }
  }, [conversations, currentConversationId]);

  // Rename chat
  const renameChat = useCallback(async (id: string, title: string) => {
    try {
      const updated = await historyService.renameConversation(id, title, conversations);
      setConversations(updated);
      toast.success('Conversation renamed.');
    } catch (err) {
      toast.error('Failed to rename conversation.');
      console.error(err);
    }
  }, [conversations]);

  // Toggle favorite chat
  const toggleFavoriteChat = useCallback(async (id: string) => {
    try {
      const updated = await historyService.toggleFavorite(id, conversations);
      setConversations(updated);
    } catch (err) {
      console.error(err);
    }
  }, [conversations]);

  // Send message on active chat
  const sendMessage = async (content: string) => {
    if (!currentConversationId) {
      await createNewChat(content);
      return;
    }
    await sendMessageWithId(content, currentConversationId);
  };

  // Internal implementation that can target a specific ID
  const sendMessageWithId = async (content: string, targetId: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `msg-${generateId()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    // Update state with user message
    let activeConv: Conversation | undefined;
    
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id === targetId) {
          const isFirstMessage = c.messages.length === 0;
          const newTitle = isFirstMessage 
            ? (content.length > 25 ? content.slice(0, 25) + '...' : content)
            : c.title;

          activeConv = {
            ...c,
            title: newTitle,
            messages: [...c.messages, userMessage],
            updatedAt: new Date().toISOString()
          };
          return activeConv;
        }
        return c;
      });
      setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);
      return updated;
    });

    setIsStreaming(true);

    // Add empty placeholder for assistant streaming
    const assistantPlaceholderId = `msg-${generateId()}`;
    const assistantPlaceholder: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id === targetId) {
          return {
            ...c,
            messages: [...c.messages, assistantPlaceholder]
          };
        }
        return c;
      });
      return updated;
    });

    try {
      // Send and stream
      await chatService.sendMessage(
        content,
        targetId,
        selectedModel,
        (streamedText) => {
          // Update the streaming message content in real time
          setConversations((prev) => {
            return prev.map((c) => {
              if (c.id === targetId) {
                return {
                  ...c,
                  messages: c.messages.map((m) => {
                    if (m.id === assistantPlaceholderId) {
                      return { ...m, content: streamedText };
                    }
                    return m;
                  })
                };
              }
              return c;
            });
          });
        }
      );

      // Finish streaming and clean up flags
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id === targetId) {
            return {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id === assistantPlaceholderId) {
                  return { ...m, isStreaming: false };
                }
                return m;
              })
            };
          }
          return c;
        });
        setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);
        return updated;
      });
    } catch (err) {
      toast.error('Failed to generate AI response.');
      console.error(err);
      
      // Remove the placeholder if it failed
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id === targetId) {
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== assistantPlaceholderId)
            };
          }
          return c;
        });
        setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    toast.success('All histories cleared successfully.');
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        selectedModel,
        apiUrl,
        isLoading,
        isStreaming,
        sidebarOpen,
        searchQuery,
        setSearchQuery,
        setSelectedModel,
        setSidebarOpen,
        createNewChat,
        selectConversation,
        deleteChat,
        renameChat,
        toggleFavoriteChat,
        sendMessage,
        clearAllConversations
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
