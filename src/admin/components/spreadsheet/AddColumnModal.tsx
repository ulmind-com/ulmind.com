import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Hash, Calendar, CheckSquare, List, User, Link, X } from 'lucide-react';

const COLUMN_TYPES = [
  { id: 'text', label: 'Single Line Text', icon: Type },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'boolean', label: 'Checkbox', icon: CheckSquare },
  { id: 'select', label: 'Single Select', icon: List },
  { id: 'user', label: 'User', icon: User },
  { id: 'url', label: 'URL', icon: Link },
];

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (column: any) => void;
}

export function AddColumnModal({ isOpen, onClose, onAdd }: AddColumnModalProps) {
  const [headerName, setHeaderName] = useState('');
  const [type, setType] = useState('text');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!headerName) return;
    const fieldName = headerName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    onAdd({
      field: fieldName,
      headerName,
      type,
      editable: true,
      width: 200,
    });
    
    setHeaderName('');
    setType('text');
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
            <h2 className="text-base font-bold text-white tracking-tight">Add New Column</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block">Column Name</label>
              <input
                type="text"
                placeholder="e.g. Revenue, Due Date"
                value={headerName}
                onChange={(e) => setHeaderName(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-[14px] text-white placeholder-white/20 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/[0.02]"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block">Field Type</label>
              <div className="grid grid-cols-2 gap-2">
                {COLUMN_TYPES.map(colType => {
                  const Icon = colType.icon;
                  const isSelected = type === colType.id;
                  return (
                    <button
                      key={colType.id}
                      onClick={() => setType(colType.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                          : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? "text-indigo-400" : "text-white/40"} />
                      <span>{colType.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/[0.08] bg-white/[0.02] p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-indigo-500 px-5 py-2 text-[13px] font-bold text-white hover:bg-indigo-600 transition-all shadow-[0_2px_15px_rgba(99,102,241,0.2)]"
            >
              Add Column
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
