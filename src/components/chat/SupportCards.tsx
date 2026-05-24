'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

export function SupportCards() {
  const supportOptions = [
    {
      title: 'WhatsApp Chat',
      description: 'Instant replies within 5 mins',
      icon: MessageCircle,
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      link: 'https://wa.me/918537861040',
    },
    {
      title: 'Phone Call',
      description: 'Speak directly with our team',
      icon: Phone,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      link: `tel:+918537861040`,
    },
    {
      title: 'Email Support',
      description: 'Detailed project inquiries',
      icon: Mail,
      color: 'bg-rose-500',
      hoverColor: 'hover:bg-rose-600',
      link: `mailto:contact@ulmind.com`,
    }
  ];

  return (
    <div className="w-full flex flex-col gap-3 mt-4">
      <div className="text-sm text-zinc-400 mb-2">Please select your preferred contact method:</div>
      {supportOptions.map((option, idx) => (
        <motion.a
          key={option.title}
          href={option.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <div className="flex items-center gap-4 z-10">
            <div className={`p-3 rounded-full text-white transition-colors ${option.color} ${option.hoverColor}`}>
              <option.icon size={20} />
            </div>
            <div>
              <div className="text-white font-medium text-sm">{option.title}</div>
              <div className="text-zinc-400 text-xs">{option.description}</div>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors z-10" />
          
          {/* Hover gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </motion.a>
      ))}
    </div>
  );
}
