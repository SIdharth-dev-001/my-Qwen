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
  const createNewChat = useCallback(async (): Promise<string> => {
    console.log("🔥 createNewChat() called");

    // Clear the currently selected conversation.
    // The next message will be sent with conversation_id = null,
    // allowing the backend to create the conversation.
    setCurrentConversationId(null);

    return "";
  }, []);

  // Switch conversation
  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  // Delete chat
  const deleteChat = useCallback(async (id: string) => {
    try {
      const updated = await historyService.deleteConversation(id, conversations);
      setConversations(updated);
      toast.success("Conversation deleted.");

      if (currentConversationId === id) {
        setCurrentConversationId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      toast.error("Failed to delete conversation.");
      console.error(err);
    }
  }, [conversations, currentConversationId]);

  // Rename chat
  const renameChat = useCallback(async (id: string, title: string) => {
    try {
      const updated = await historyService.renameConversation(id, title, conversations);
      setConversations(updated);
      toast.success("Conversation renamed.");
    } catch (err) {
      toast.error("Failed to rename conversation.");
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
    console.log("currentConversationId:", currentConversationId);

    // If no conversation is selected, start a new backend conversation.
    if (!currentConversationId) {
      console.log("🆕 Starting backend conversation...");
      await sendMessageWithId(content, null);
      return;
    }

    // Existing conversation
    await sendMessageWithId(content, currentConversationId);
  };

  const sendMessageWithId = async (
  content: string,
  targetId: string | null
) => {
  if (!content.trim() || isStreaming) return;

  setIsStreaming(true);

  const userMessage: Message = {
    id: `msg-${generateId()}`,
    role: "user",
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };

  const assistantPlaceholderId = `msg-${generateId()}`;

  const assistantPlaceholder: Message = {
    id: assistantPlaceholderId,
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString(),
    isStreaming: true,
    isLoading: true,
  };

  try {
    if (!targetId) {
      const tempId = `temp-${generateId()}`;

      setCurrentConversationId(tempId);

      setConversations(prev => [
        {
          id: tempId,
          title:
            content.length > 25
              ? content.slice(0, 25) + "..."
              : content,
          model: selectedModel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false,
          messages: [
            userMessage,
            assistantPlaceholder,
          ],
        },
        ...prev,
      ]);
    }
    const result = await chatService.sendMessage(
      content,
      targetId,
      selectedModel,
      (streamedText, backendId) => {
        // Existing conversation
        if (targetId) {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== targetId) return c;

              const hasUserMessage = c.messages.some(
                (m) => m.id === userMessage.id
              );

              let messages = [...c.messages];

              if (!hasUserMessage) {
                messages.push(userMessage);
              }

              const assistantIndex = messages.findIndex(
                (m) => m.id === assistantPlaceholderId
              );

              if (assistantIndex === -1) {
                messages.push({
                  id: assistantPlaceholderId,
                  role: "assistant",
                  content: streamedText,
                  timestamp: new Date().toISOString(),
                  isStreaming: true,
                });
              } else {
                messages[assistantIndex] = {
                  ...messages[assistantIndex],
                  content: streamedText,
                };
              }

              return {
                ...c,
                title:
                  c.messages.length === 0
                    ? content.length > 25
                      ? content.slice(0, 25) + "..."
                      : content
                    : c.title,
                messages,
                updatedAt: new Date().toISOString(),
              };
            })
          );
        }

        // Brand new conversation
        else {

          if (!backendId) return;

          setConversations((prev) => {
            const existing =
            prev.find(c => c.id === backendId) ||
            prev.find(c => c.id.startsWith("temp-"));

            if (existing) {
              return prev.map((c) => {
                if (
                    c.id !== backendId &&
                    !c.id.startsWith("temp-")
                ) {
                    return c;
                }

                const assistantIndex = c.messages.findIndex(
                  (m) => m.id === assistantPlaceholderId
                );

                let messages = [...c.messages];

                if (assistantIndex === -1) {
                  messages.push({
                    id: assistantPlaceholderId,
                    role: "assistant",
                    content: streamedText,
                    timestamp: new Date().toISOString(),
                    isStreaming: true,
                  });
                } else {
                  messages[assistantIndex] = {
                    ...messages[assistantIndex],
                    content: streamedText,
                  };
                }

                return {
                  ...c,
                  id: backendId,
                  messages,
                  updatedAt: new Date().toISOString(),
                };
              });
            }

            return [
            {
              id: backendId,
              title:
                content.length > 25
                  ? content.slice(0, 25) + "..."
                  : content,
              model: selectedModel,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isFavorite: false,
              messages: [
                userMessage,
                {
                  ...assistantPlaceholder,
                  content: streamedText,
                  isLoading: false,
                },
              ],
            },
            ...prev,
          ];
          });

          setCurrentConversationId(backendId);
        }
      }
    );

    const backendId = result.conversationId ?? targetId;

    if (!backendId) return;

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== backendId) return c;

        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === assistantPlaceholderId
              ? { ...m, isStreaming: false }
              : m
          ),
        };
      });

      setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);

      return updated;
    });

    if (!targetId && result.conversationId) {
      setCurrentConversationId(result.conversationId);
    }
  } catch (err) {
    toast.error("Failed to generate AI response.");
    console.error(err);

    if (targetId) {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== targetId) return c;

          return {
            ...c,
            messages: c.messages.filter(
              (m) => m.id !== assistantPlaceholderId
            ),
          };
        });

        setLocalStorage(STORAGE_KEYS.CONVERSATIONS, updated);

        return updated;
      });
    }
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
