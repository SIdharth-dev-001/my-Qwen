import React from 'react';
import { useChat } from '../../hooks/useChat';
import { useSidebar } from '../../hooks/useSidebar';
import { ChatHistory } from '../chat/ChatHistory';
import { Button } from '../common/Button';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Plus, Settings, History, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export function Sidebar() {
  const { createNewChat, clearAllConversations, conversations } = useChat();
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();

  const handleNewChat = () => {
    createNewChat();
  };

  const navItems = [
    { label: 'Chat', path: '/', icon: MessageSquare },
    { label: 'History log', path: '/history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <motion.aside
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: { width: 280, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
        closed: { width: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }
      }}
      className={clsx(
        'h-screen flex flex-col bg-zinc-950 border-r border-zinc-900 overflow-hidden relative shrink-0 z-20 shadow-2xl md:shadow-none'
      )}
    >
      {/* Sidebar Header with Brand Logo */}
      <div className="h-16 flex items-center justify-between px-5.5 border-b border-zinc-900 select-none">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow shadow-primary/20 text-white border border-white/5 glow-border">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <span className="font-display font-semibold tracking-tight text-white text-base">
            My Qwen
          </span>
        </Link>
        
        {/* Collapse Button */}
        <button
          onClick={toggle}
          className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Primary Action Call: New Chat */}
      <div className="p-3.5 select-none">
        <Button
          onClick={handleNewChat}
          variant="primary"
          className="w-full justify-center text-xs py-2.5"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Chat
        </Button>
      </div>

      {/* Main Threads Navigation */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <ChatHistory />
      </div>

      {/* Bottom Settings Navigation */}
      <div className="p-3.5 border-t border-zinc-900 flex flex-col gap-1.5 select-none bg-zinc-950/40">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              )}
            >
              <Icon className={clsx('h-4 w-4', isActive ? 'text-primary' : 'text-zinc-500')} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {conversations.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to purge all conversational histories? This is irreversible.')) {
                clearAllConversations();
              }
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 mt-2 text-left cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            <span>Purge Threads</span>
          </button>
        )}
      </div>

    </motion.aside>
  );
}

export default Sidebar;
