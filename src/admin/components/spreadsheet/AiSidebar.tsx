import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId: str | null;
}

export function AiSidebar({ isOpen, onClose, sheetId }: AiSidebarProps) {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi! I'm your ULMIND Spreadsheet AI. I can analyze your data, generate reports, or find specific records. How can I help you with this sheet?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !sheetId) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/v1/ai/${sheetId}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "Sorry, I couldn't process that." 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error connecting to AI service. Ensure OpenRouter API key is configured." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-80 border-l border-white/[0.08] bg-[#111111]/95 backdrop-blur-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles size={14} />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">ULMIND AI</span>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-1 ${
                  msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/70'
                }`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed max-w-[240px] ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500 text-white rounded-tr-sm' 
                      : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/[0.05] prose prose-invert prose-p:my-1 prose-headings:my-2 prose-sm max-w-none'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-1 bg-white/10 text-white/70">
                  <Bot size={12} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/[0.05] px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-indigo-400" />
                  <span className="text-xs text-white/50">Analyzing data...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/[0.08] bg-black/20">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about this sheet..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-4 pr-10 py-3 text-[13px] text-white placeholder-white/30 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 bottom-2 flex w-8 items-center justify-center rounded-lg bg-indigo-500 text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 text-center text-[10px] text-white/30">
              AI can make mistakes. Verify important data.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
