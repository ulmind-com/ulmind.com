import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Share2, FolderOpen, Printer, Plus, Edit2, Move, Trash2, 
  Undo, Redo, Scissors, Copy, ClipboardPaste, Search, 
  ZoomIn, Maximize, PanelTop, PanelLeft, 
  TableProperties, LayoutGrid, Image as ImageIcon, LineChart, Link2, CheckSquare, 
  Type, AlignLeft, WrapText, PaintBucket,
  ChevronRight, Sparkles,
  ArrowUpDown, Filter, Rows, SlidersHorizontal, Lock, Tag, Sigma, Shuffle, 
  BarChart2, ListChecks, Wand2, Columns, Database, FilePlus, SpellCheck, Bell, Accessibility
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SpreadsheetMenuBarProps {
  onAction: (action: string, payload?: any) => void;
}

export function SpreadsheetMenuBar({ onAction }: SpreadsheetMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (activeMenu) {
      setActiveMenu(menuName);
    }
  };

  const handleAction = (action: string, payload?: any) => {
    setActiveMenu(null);
    onAction(action, payload);
  };

  const MenuDropdown = ({ name, label, children }: { name: string, label: string, children: React.ReactNode }) => {
    const isOpen = activeMenu === name;
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter(name)}
      >
        <button
          onClick={() => setActiveMenu(isOpen ? null : name)}
          className={`px-3 py-1 text-[13px] font-medium rounded-md transition-colors ${
            isOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          {label}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MenuItem = ({ icon: Icon, label, shortcut, action, hasSubmenu, divider }: any) => {
    if (divider) return <div className="h-px w-full bg-white/5 my-1" />;
    
    return (
      <button 
        onClick={() => !hasSubmenu && handleAction(action)}
        className="w-full px-4 py-1.5 flex items-center justify-between text-[13px] text-white/80 hover:bg-indigo-500/10 hover:text-indigo-400 group transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon ? <Icon size={14} className="text-white/40 group-hover:text-indigo-400 transition-colors" /> : <div className="w-3.5" />}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-[11px] font-mono">
          {shortcut && <span>{shortcut}</span>}
          {hasSubmenu && <ChevronRight size={12} />}
        </div>
      </button>
    );
  };

  return (
    <div ref={menuRef} className="flex h-8 items-center gap-1 px-4 bg-[#0A0A0A] select-none pb-1 no-print">
      <MenuDropdown name="file" label="File">
        <MenuItem icon={Plus} label="New" action="file_new" shortcut="⌘N" />
        <MenuItem divider />
        <MenuItem icon={Download} label="Download" action="file_download" />
        <MenuItem divider />
        <MenuItem icon={Printer} label="Print" action="file_print" shortcut="⌘P" />
      </MenuDropdown>

      <MenuDropdown name="edit" label="Edit">
        <MenuItem icon={Undo} label="Undo" action="edit_undo" shortcut="⌘Z" />
        <MenuItem icon={Redo} label="Redo" action="edit_redo" shortcut="⌘Y" />
        <MenuItem divider />
        <MenuItem icon={Scissors} label="Cut" action="edit_cut" shortcut="⌘X" />
        <MenuItem icon={Copy} label="Copy" action="edit_copy" shortcut="⌘C" />
        <MenuItem icon={ClipboardPaste} label="Paste" action="edit_paste" shortcut="⌘V" />
        <MenuItem divider />
        <MenuItem icon={Search} label="Find and replace" action="edit_find" shortcut="⌘⇧H" />
      </MenuDropdown>

      <MenuDropdown name="view" label="View">
        <MenuItem icon={PanelTop} label="Freeze rows" action="view_freeze_rows" hasSubmenu />
        <MenuItem icon={PanelLeft} label="Freeze columns" action="view_freeze_cols" hasSubmenu />
        <MenuItem divider />
        <MenuItem icon={ZoomIn} label="Zoom" action="view_zoom" hasSubmenu />
        <MenuItem icon={Maximize} label="Full screen" action="view_fullscreen" />
      </MenuDropdown>

      <MenuDropdown name="insert" label="Insert">
        <MenuItem icon={LayoutGrid} label="Rows" action="insert_rows" />
        <MenuItem icon={LayoutGrid} label="Columns" action="insert_columns" />
      </MenuDropdown>

      <MenuDropdown name="format" label="Format">
        <MenuItem label="Clear formatting" action="format_clear" shortcut="⌘\\" />
      </MenuDropdown>

      <MenuDropdown name="data" label="Data">
        <MenuItem icon={ArrowUpDown} label="Sort sheet A to Z" action="data_sort_sheet_asc" />
        <MenuItem icon={ArrowUpDown} label="Sort sheet Z to A" action="data_sort_sheet_desc" />
        <MenuItem divider />
        <MenuItem icon={Filter} label="Create a filter" action="data_create_filter" />
        <MenuItem divider />
        <MenuItem icon={Lock} label="Protect sheets and ranges" action="data_protect" />
        <MenuItem divider />
        <MenuItem icon={ListChecks} label="Data validation" action="data_validation" />
      </MenuDropdown>
    </div>
  );
}
