import React from 'react';
import { motion } from 'motion/react';
import { SUGGESTED_PROMPTS } from '../../utils/constants';
import { Card } from '../common/Card';
import { Brain, Database, Mail, FileText, Workflow, Sparkles } from 'lucide-react';
import { staggerContainer } from '../../utils/animations';

export interface SuggestedQuestionsProps {
  onSelect: (prompt: string) => void;
}

// Icon mapper for lucide-react strings
const ICON_MAP: Record<string, any> = {
  Brain: Brain,
  Database: Database,
  Mail: Mail,
  FileText: FileText,
  Workflow: Workflow
};

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full max-w-4xl px-4 mt-6 select-none"
    >
      {SUGGESTED_PROMPTS.map((item, index) => {
        const IconComponent = ICON_MAP[item.icon] || Sparkles;
        
        return (
          <motion.div
            key={item.id}
            variants={{
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: index * 0.05 } }
            }}
          >
            <Card
              hoverEffect
              glow
              onClick={() => onSelect(item.prompt)}
              className="p-4 cursor-pointer flex flex-col gap-2.5 min-h-[105px] border-zinc-800/60 bg-zinc-950/40 hover:border-primary/40 group hover:bg-zinc-900/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <IconComponent className="h-4 w-4 text-zinc-500 group-hover:text-primary transition-colors duration-300" />
              </div>
              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors duration-200">
                {item.label}
              </h4>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default SuggestedQuestions;
