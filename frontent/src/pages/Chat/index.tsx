import React from 'react';
import { motion } from 'motion/react';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { pageTransition } from '../../utils/animations';

export function ChatPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full flex flex-col"
    >
      <ChatWindow />
    </motion.div>
  );
}

export default ChatPage;
