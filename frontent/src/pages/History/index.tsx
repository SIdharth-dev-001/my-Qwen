import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { formatConversationGroup, truncateText } from '../../utils/formatter';
import { Search, Star, Trash2, Edit2, Check, X, MessageSquare, Calendar, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pageTransition, staggerContainer } from '../../utils/animations';
import { toast } from 'sonner';

export function HistoryPage() {
  const {
    conversations,
    selectConversation,
    deleteChat,
    renameChat,
    toggleFavoriteChat,
    createNewChat
  } = useChat();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      await renameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavoriteChat(id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation from record history?')) {
      await deleteChat(id);
    }
  };

  const handleOpenChat = (id: string) => {
    selectConversation(id);
    navigate('/');
    toast.success('Conversation restored');
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full flex flex-col overflow-y-auto px-4 md:px-10 py-8 select-none bg-zinc-950/20"
    >
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Chat Archives
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Manage your historically generated threads and bookmarked notes.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search archived threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 text-white placeholder-zinc-500 text-xs rounded-lg border border-zinc-800/80 py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Content Lists */}
        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title={search ? 'No matches found' : 'No saved conversations'}
              description={search ? 'Try adjusting your search keywords' : 'Start a brand new chat thread to build history!'}
              actionLabel="Create First Chat"
              onAction={() => {
                createNewChat();
                navigate('/');
              }}
            />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 align-start"
          >
            <AnimatePresence>
              {filtered.map((conv, idx) => {
                const isEditing = conv.id === editingId;
                const dateGroup = formatConversationGroup(conv.updatedAt);

                return (
                  <motion.div
                    key={conv.id}
                    variants={{
                      initial: { opacity: 0, y: 15 },
                      animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: idx * 0.04 } }
                    }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <Card
                      hoverEffect
                      glow
                      onClick={() => !isEditing && handleOpenChat(conv.id)}
                      className="p-4 cursor-pointer border-zinc-900/80 bg-zinc-950/40 hover:border-primary/20 flex flex-col gap-3 min-h-[140px]"
                    >
                      {/* Card Row 1 */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono select-none">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span>{dateGroup}</span>
                        </div>
                        
                        {/* Bookmark controls */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleToggleFavorite(e, conv.id)}
                            className={`p-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer ${
                              conv.isFavorite ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'
                            }`}
                          >
                            <Star className={`h-4 w-4 ${conv.isFavorite && 'fill-current'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Card Title or Editing input */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="bg-zinc-900 text-white text-sm px-2.5 py-1 rounded-lg outline-none border border-primary/50 w-full"
                              autoFocus
                            />
                            <button
                              onClick={(e) => handleSaveRename(e, conv.id)}
                              className="p-1.5 bg-zinc-900 text-emerald-400 rounded-md hover:text-emerald-300 cursor-pointer"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(null);
                              }}
                              className="p-1.5 bg-zinc-900 text-zinc-400 rounded-md hover:text-white cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-display font-semibold text-white text-base truncate">
                            {conv.title}
                          </h3>
                        )}
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-1 leading-normal">
                          {conv.messages.length > 0 
                            ? truncateText(conv.messages[conv.messages.length - 1].content, 60)
                            : 'No messages yet.'}
                        </p>
                      </div>

                      {/* Card Row 3: Bottom stats & CTA */}
                      <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-1.5 select-none">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 uppercase">
                            {conv.model}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            {conv.messages.length} messages
                          </span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {!isEditing && (
                            <>
                              <button
                                onClick={(e) => handleStartRename(e, conv.id, conv.title)}
                                className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white cursor-pointer"
                                title="Rename archive"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, conv.id)}
                                className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-red-400 cursor-pointer"
                                title="Delete archive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenChat(conv.id)}
                            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-300 hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            <span>Restore</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default HistoryPage;
