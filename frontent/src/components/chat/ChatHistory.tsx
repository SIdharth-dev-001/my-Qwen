import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { Conversation } from '../../types/conversation';
import { formatConversationGroup, truncateText } from '../../utils/formatter';
import { MessageSquare, Trash2, Edit2, Check, Star, X, Search, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export function ChatHistory() {
  const {
    conversations,
    currentConversationId,
    selectConversation,
    deleteChat,
    renameChat,
    toggleFavoriteChat,
    createNewChat,
    searchQuery,
    setSearchQuery
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      await renameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteChat(id);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavoriteChat(id);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(q);
    const msgMatch = c.messages.some((m) => m.content.toLowerCase().includes(q));
    return titleMatch || msgMatch;
  });

  // Group conversations by date
  const groups: Record<string, Conversation[]> = {};
  filteredConversations.forEach((conv) => {
    const groupKey = formatConversationGroup(conv.updatedAt);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(conv);
  });

  return (
    <div className="flex flex-col h-full bg-transparent select-none">
      {/* Search Bar */}
      <div className="px-3.5 mb-3.5 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 text-zinc-200 placeholder-zinc-500 text-xs rounded-lg border border-zinc-800/60 py-2 pl-9 pr-7 outline-none focus:border-primary/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation Thread Groups */}
      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-5.5 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-xs text-zinc-600">No chats matching query</span>
          </div>
        ) : (
          Object.entries(groups).map(([groupTitle, list]) => (
            <div key={groupTitle} className="flex flex-col gap-1.5">
              <h5 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 select-none">
                {groupTitle}
              </h5>
              <div className="flex flex-col gap-0.5">
                <AnimatePresence initial={false}>
                  {list.map((conv) => {
                    const isActive = conv.id === currentConversationId;
                    const isEditing = conv.id === editingId;

                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={() => !isEditing && selectConversation(conv.id)}
                        className={clsx(
                          'group relative flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-all duration-150',
                          isActive
                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-white border-l-2 border-primary'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                        )}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-6">
                          <MessageSquare className={clsx('h-3.5 w-3.5 shrink-0', isActive ? 'text-primary' : 'text-zinc-500')} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(e as any, conv.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="bg-zinc-800 text-white text-xs px-1.5 py-0.5 rounded outline-none border border-primary/50 w-full"
                              autoFocus
                            />
                          ) : (
                            <span className="text-xs font-medium truncate select-none">
                              {conv.title}
                            </span>
                          )}
                        </div>

                        {/* Action buttons on hover */}
                        {!isEditing && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent">
                            <button
                              onClick={(e) => handleToggleFavorite(e, conv.id)}
                              className={clsx(
                                'p-0.5 rounded hover:bg-zinc-800 text-zinc-500 cursor-pointer',
                                conv.isFavorite ? 'text-amber-400 opacity-100' : 'hover:text-amber-400'
                              )}
                              title="Bookmark thread"
                            >
                              <Star className={clsx('h-3 w-3', conv.isFavorite && 'fill-current')} />
                            </button>
                            <button
                              onClick={(e) => handleStartRename(e, conv)}
                              className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white cursor-pointer"
                              title="Rename thread"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, conv.id)}
                              className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 cursor-pointer"
                              title="Delete thread"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        {isEditing && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-transparent">
                            <button
                              onClick={(e) => handleSaveRename(e, conv.id)}
                              className="p-0.5 rounded bg-zinc-800 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(null);
                              }}
                              className="p-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatHistory;
