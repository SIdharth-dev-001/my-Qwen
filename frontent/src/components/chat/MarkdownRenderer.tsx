import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Terminal } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';
import { toast } from 'sonner';

export interface MarkdownRendererProps {
  content: string;
}

function MarkdownRendererComponent({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body select-text text-zinc-100 text-sm leading-relaxed max-w-none">
      <ReactMarkdown
        components={{
          // Override code elements for custom highlighting and copy buttons
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && language) {
              return <CodeBlockWrapper language={language} code={codeString} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlockWrapper({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="relative group/code border border-zinc-800/80 rounded-lg overflow-hidden my-3 bg-zinc-950/80">
      {/* Code header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800/80 text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-1.5 font-mono">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4 font-mono text-xs text-zinc-300 leading-normal scrollbar-thin scrollbar-thumb-zinc-800">
        <pre className="m-0 bg-transparent p-0 border-none select-all">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export const MarkdownRenderer = React.memo(MarkdownRendererComponent);
export default MarkdownRenderer;