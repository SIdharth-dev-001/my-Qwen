import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { Bot, HelpCircle, ArrowLeft } from 'lucide-react';
import { pageTransition } from '../../utils/animations';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-zinc-950 select-none"
    >
      <div className="glow-blob-purple top-1/3 left-1/3" />

      <div className="relative p-4 bg-zinc-900 rounded-3xl border border-zinc-800 mb-6 shadow-xl">
        <Bot className="h-12 w-12 text-primary" />
        <div className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full border border-zinc-950">
          <HelpCircle className="h-3 w-3 text-white" />
        </div>
      </div>

      <h1 className="text-5xl font-display font-bold text-white mb-2">
        404
      </h1>
      <h2 className="text-lg font-semibold text-zinc-300 mb-2">
        Thread Out of Context
      </h2>
      <p className="text-sm text-zinc-500 max-w-sm mb-8 leading-relaxed">
        The conversational branch or settings view you are searching for does not exist on this canvas.
      </p>

      <Button
        onClick={() => navigate('/')}
        variant="primary"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Return to Chat
      </Button>
    </motion.div>
  );
}

export default NotFoundPage;
