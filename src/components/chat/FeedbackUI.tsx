'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { SupportCards } from './SupportCards';

interface FeedbackUIProps {
  messageId: string;
  feedback: 'yes' | 'no' | null | undefined;
}

export function FeedbackUI({ messageId, feedback }: FeedbackUIProps) {
  const { setFeedback } = useChatStore();

  if (feedback === 'yes') {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-medium"
      >
        <CheckCircle2 size={16} />
        Thank you! Glad we could fix your problem! 🎉
      </motion.div>
    );
  }

  if (feedback === 'no') {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-3"
      >
        <div className="text-xs text-rose-400 font-medium mb-2">
          I&apos;m sorry I couldn&apos;t help. Please connect with our human agents:
        </div>
        <SupportCards />
      </motion.div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 pt-3 border-t border-white/5">
      <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
        Did this solve your problem?
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setFeedback(messageId, 'yes')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-400 text-xs font-medium border border-white/5 hover:border-emerald-500/30 transition-all"
        >
          <ThumbsUp size={12} /> Yes
        </button>
        <button
          onClick={() => setFeedback(messageId, 'no')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 text-xs font-medium border border-white/5 hover:border-rose-500/30 transition-all"
        >
          <ThumbsDown size={12} /> No
        </button>
      </div>
    </div>
  );
}
