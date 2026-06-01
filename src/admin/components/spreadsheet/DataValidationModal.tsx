import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Hash, Calendar, CheckSquare, List, X, ShieldAlert } from 'lucide-react';

const VALIDATION_TYPES = [
  { id: 'none', label: 'No Validation', icon: ShieldAlert },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'boolean', label: 'Checkbox', icon: CheckSquare },
  { id: 'select', label: 'Dropdown', icon: List },
];

interface DataValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (validation: any) => void;
  selectedRange?: string;
}

export function DataValidationModal({ isOpen, onClose, onApply, selectedRange }: DataValidationModalProps) {
  const [type, setType] = useState('select');
  const [options, setOptions] = useState('Option 1, Option 2');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      type,
      options: type === 'select' ? options.split(',').map(o => o.trim()) : undefined
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
            <h2 className="text-base font-bold text-white tracking-tight">Data Validation rules</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block">Apply to range</label>
              <div className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-[14px] text-white/70">
                {selectedRange || 'Selected Cells'}
              </div>
            </div>

            <div>
              <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block">Criteria</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {VALIDATION_TYPES.map(valType => {
                  const Icon = valType.icon;
                  const isSelected = type === valType.id;
                  return (
                    <button
                      key={valType.id}
                      onClick={() => setType(valType.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                          : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? "text-indigo-400" : "text-white/40"} />
                      <span>{valType.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {type === 'select' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block mt-4">Dropdown Options (Comma separated)</label>
                  <input
                    type="text"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-[14px] text-white placeholder-white/20 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/[0.02]"
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/[0.08] bg-white/[0.02] p-4 flex justify-between gap-3">
            <button
              onClick={() => onApply({ type: 'none' })}
              className="rounded-lg px-4 py-2 text-[13px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Remove validation
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="rounded-lg bg-indigo-500 px-5 py-2 text-[13px] font-bold text-white hover:bg-indigo-600 transition-all shadow-[0_2px_15px_rgba(99,102,241,0.2)]"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
