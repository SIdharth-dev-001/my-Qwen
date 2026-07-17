import { useContext } from 'react';
import { ChatContext, ChatContextProps } from '../context/ChatContext';

export function useChat(): ChatContextProps {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
