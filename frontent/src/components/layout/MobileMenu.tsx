import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import { Sidebar } from './Sidebar';
import { PanelLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MobileMenu() {
  const { isOpen, close, toggle } = useSidebar();

  return (
    <div className="md:hidden select-none">
      {/* Floating Menu button on mobile */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="fixed bottom-4 right-4 z-40 p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      )}

      {/* Slide drawer container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop opacity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar Slide Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative h-full z-10 flex"
            >
              <Sidebar />
              
              {/* Close float button */}
              <button
                onClick={close}
                className="absolute top-4 -right-12 p-2 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileMenu;
