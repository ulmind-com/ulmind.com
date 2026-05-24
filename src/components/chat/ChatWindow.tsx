'use client';

import { useEffect, useRef } from 'react';
import { RefreshCcw, PhoneCall } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

import { SuggestedQuestions } from './SuggestedQuestions';

export function ChatWindow() {
  const { messages, clearChat } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-[340px] sm:w-[380px] h-[500px] sm:h-[600px] max-h-[calc(100vh-200px)] flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-rose-900/20">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
        <div>
          <h3 className="text-white font-semibold text-base flex items-center gap-2">
            ASK AI
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h3>
          <p className="text-xs text-zinc-400">by ULMIND</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => window.open('https://wa.me/918537861040', '_blank')}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Escalate to Human"
          >
            <PhoneCall size={16} />
          </button>
          <button 
            onClick={clearChat}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Reset Chat"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {/* Render Suggested Questions ONLY when chat is empty (just the welcome message) */}
        {messages.length === 1 && <SuggestedQuestions />}
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
}
