'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, useChatStore } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { User, MessageCirclePlus } from 'lucide-react';
import { SupportCards } from './SupportCards';
import { FeedbackUI } from './FeedbackUI';
import { streamChat } from '@/services/chatApi';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { sessionId, addMessage, updateLastMessage, isTyping, setIsTyping } = useChatStore();
  
  // Detect escalation tag and clean it from the display text
  const hasEscalation = message.content.includes('[ESCALATE_TO_HUMAN]');
  let displayContent = message.content.replace(/\[ESCALATE_TO_HUMAN\]/g, '').trim();

  // Extract Dynamic Follow-up Suggestions: [FOLLOW_UP: q1 | q2 | q3]
  let followUps: string[] = [];
  const followUpMatch = displayContent.match(/\[FOLLOW_UP:(.*?)\]/);
  if (followUpMatch && followUpMatch[1]) {
    followUps = followUpMatch[1].split('|').map(q => q.trim()).filter(q => q);
    // Remove the tag from the text
    displayContent = displayContent.replace(/\[FOLLOW_UP:.*?\]/, '').trim();
  }

  const handleFollowUpClick = async (question: string) => {
    if (isTyping) return;
    addMessage({ role: 'user', content: question });
    setIsTyping(true);
    try {
      addMessage({ role: 'assistant', content: '' });
      let fullResponse = '';
      await streamChat(question, sessionId, (chunk) => {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      });
    } catch (error) {
      console.error(error);
      updateLastMessage('Sorry, I encountered an error connecting to the server. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={cn("flex w-full mt-4 space-x-3 max-w-full", isUser ? "justify-end" : "justify-start")}>
      
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center mt-1 overflow-hidden bg-zinc-900 shadow-sm">
          <img 
            src="/Untitled%20design.png" 
            alt="ULMIND AI" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Message Area */}
      <div className={cn("flex flex-col w-full max-w-[85%]", isUser ? "items-end" : "items-start")}>
        
        {/* Loading Animation (Typing Indicator) */}
        {!isUser && !displayContent && (
          <div className="px-4 py-3.5 rounded-2xl bg-[#18181b] rounded-tl-none border border-white/10 shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}

        {/* Text Bubble */}
        {displayContent && (
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm prose prose-sm break-words shadow-sm",
              isUser 
                ? "bg-rose-600 text-white rounded-tr-none prose-invert" 
                : "bg-[#18181b] text-zinc-200 rounded-tl-none border border-white/10 prose-invert"
            )}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 underline font-medium" />
              }}
            >
              {displayContent}
            </ReactMarkdown>

            {/* Dynamic Follow-Up Questions rendering inside the bubble */}
            {!isUser && followUps.length > 0 && !isTyping && (
               <div className="mt-4 pt-3 border-t border-white/5">
                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
                   <MessageCirclePlus size={12} /> Related Questions
                 </div>
                 <div className="flex flex-col gap-1.5">
                   {followUps.map((q, idx) => (
                     <button
                       key={idx}
                       onClick={() => handleFollowUpClick(q)}
                       className="text-left text-xs bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-300 px-3 py-2 rounded-lg transition-colors border border-white/5 hover:border-rose-500/20"
                     >
                       {q}
                     </button>
                   ))}
                 </div>
               </div>
            )}

            {/* Feedback UI inside the bubble */}
            {!isUser && message.id !== 'welcome-msg' && message.id !== 'welcome-msg-new' && displayContent.length > 10 && !isTyping && (
              <FeedbackUI messageId={message.id} feedback={message.feedback} />
            )}
          </div>
        )}
        
        {/* Escalation Cards (if explicitly triggered by [ESCALATE_TO_HUMAN]) */}
        {!isUser && hasEscalation && (
          <SupportCards />
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mt-1">
          <User size={16} className="text-zinc-400" />
        </div>
      )}

    </div>
  );
}
