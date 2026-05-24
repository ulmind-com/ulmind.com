'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { streamChat } from '@/services/chatApi';
import { MessageSquarePlus } from 'lucide-react';

export function SuggestedQuestions() {
  const { sessionId, addMessage, updateLastMessage, isTyping, setIsTyping } = useChatStore();

  const suggestions = [
    "What services does ULMIND offer?",
    "How much does a mobile app cost?",
    "Can you build an e-commerce website?",
    "What is your tech stack?"
  ];

  const handleSuggestionClick = async (question: string) => {
    if (isTyping) return;

    // 1. Optimistic UI update
    addMessage({ role: 'user', content: question });
    setIsTyping(true);

    try {
      // 2. Add empty assistant message that we will stream into
      addMessage({ role: 'assistant', content: '' });
      
      let fullResponse = '';
      await streamChat(question, sessionId, (chunk) => {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      });
    } catch (error) {
      console.error('Failed to send suggestion:', error);
      updateLastMessage('Sorry, I encountered an error connecting to the server. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-4 mb-2">
      <div className="text-xs text-zinc-500 font-medium px-2 mb-1 flex items-center gap-1.5">
        <MessageSquarePlus size={14} />
        Suggested Questions
      </div>
      <div className="flex flex-wrap gap-2 px-1">
        {suggestions.map((q, idx) => (
          <motion.button
            key={q}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleSuggestionClick(q)}
            disabled={isTyping}
            className="text-left text-xs bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-300 hover:text-white px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
