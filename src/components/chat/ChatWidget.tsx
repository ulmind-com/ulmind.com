'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Lottie from 'lottie-react';
import { useLocation } from 'react-router-dom';
import { useChatStore } from '@/store/useChatStore';
import { ChatWindow } from './ChatWindow';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const location = useLocation();
  const { isOpen, setIsOpen } = useChatStore();
  const [robotAnimData, setRobotAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/Jason/AI%20Robot.json')
      .then(res => res.json())
      .then(data => setRobotAnimData(data))
      .catch(err => console.error("Error loading Lottie", err));
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin") || (typeof window !== "undefined" && window.location.hostname.startsWith("admin."));
  if (isAdminRoute) return null;

  return (
    <div className={cn("fixed right-4 sm:right-6 z-[10000] flex flex-col items-center transition-all duration-300", isOpen ? "bottom-4 sm:bottom-6" : "bottom-[168px]")}>
      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-4"
          >
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          isOpen ? "w-14 h-14 rounded-full shadow-2xl bg-zinc-800 hover:bg-zinc-700 text-white" : "w-24 h-24 bg-transparent"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {robotAnimData ? (
                <Lottie animationData={robotAnimData} loop autoplay className="w-24 h-24 drop-shadow-xl" />
              ) : (
                <MessageCircle size={24} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
