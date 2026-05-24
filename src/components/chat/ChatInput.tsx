'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { streamChat } from '@/services/chatApi';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { sessionId, addMessage, updateLastMessage, isTyping, setIsTyping } = useChatStore();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    // Optimistic UI update for user message
    addMessage({ role: 'user', content: userMessage });
    setIsTyping(true);

    try {
      // Add empty assistant message that we will stream into
      addMessage({ role: 'assistant', content: '' });
      
      let fullResponse = '';
      await streamChat(userMessage, sessionId, (chunk) => {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      updateLastMessage('Sorry, I encountered an error connecting to the server. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <form 
      onSubmit={handleSend}
      className="p-4 border-t border-white/10 bg-white/5"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ULMIND services..."
          className="w-full bg-black/40 border border-white/10 rounded-full px-4 py-3 pr-12 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="absolute right-1.5 p-2 rounded-full bg-rose-600 text-white disabled:opacity-50 disabled:bg-zinc-700 transition-colors"
        >
          {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </form>
  );
}
