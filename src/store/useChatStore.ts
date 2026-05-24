import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number; 
  feedback?: 'yes' | 'no' | null;
};

interface ChatState {
  sessionId: string;
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  setFeedback: (messageId: string, feedback: 'yes' | 'no') => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: uuidv4(),
      messages: [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: 'Hello! I am the **ULMIND Support AI**. How can I help you accelerate your digital growth today?',
          timestamp: Date.now()
        }
      ],
      isOpen: true,
      isTyping: false,
      addMessage: (msg) => set((state) => ({
        messages: [
          ...state.messages,
          { ...msg, id: uuidv4(), timestamp: Date.now() }
        ]
      })),
      updateLastMessage: (content) => set((state) => {
        const newMessages = [...state.messages];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = content;
        }
        return { messages: newMessages };
      }),
      setFeedback: (messageId, feedback) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId ? { ...msg, feedback } : msg
        )
      })),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsTyping: (isTyping) => set({ isTyping }),
      clearChat: () => set({ 
        messages: [{
          id: 'welcome-msg-new',
          role: 'assistant',
          content: 'Hello! I am the **ULMIND Support AI**. How can I help you accelerate your digital growth today?',
          timestamp: Date.now()
        }], 
        sessionId: uuidv4() 
      }),
    }),
    {
      name: 'ulmind-ask-ai-storage',
    }
  )
);
