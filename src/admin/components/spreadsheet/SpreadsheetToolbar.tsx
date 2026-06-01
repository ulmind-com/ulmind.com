import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Undo2, Redo2, Printer, PaintRoller, 
  PoundSterling, Percent, Hash, ArrowLeftToLine, ArrowRightToLine,
  ChevronDown, Bold, Italic, Strikethrough, Underline, Type, PaintBucket,
  Grid3X3, Merge, AlignLeft, AlignCenter, AlignRight,
  WrapText, Link2, MessageSquarePlus, LineChart, Filter, Sigma, ListFilter,
  Check, FlipVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NumberFormatDropdown,
  FontDropdown,
  ColorPickerDropdown,
  BorderPickerDropdown,
  AlignDropdown,
  VerticalAlignDropdown,
  FunctionDropdown
} from './SpreadsheetDropdowns';

interface SpreadsheetToolbarProps {
  onFormatChange: (format: string, value?: any) => void;
  activeFormats: Record<string, any>;
  selectedCell: { rowId: string | null, colId: string | null } | null;
}

export function SpreadsheetToolbar({ onFormatChange, activeFormats, selectedCell }: SpreadsheetToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const currentFontSize = activeFormats.fontSize || 10;
  const currentFontFamily = activeFormats.fontFamily || 'Arial';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const FONT_FAMILIES = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Fira Code', value: '"Fira Code", monospace' },
  ];

  // Utility Component: Button
  const TBtn = ({ icon: Icon, children, format, label, active, forceValue, onClick, w = "w-7" }: any) => {
    const isActive = active || (format && activeFormats[format] === (forceValue !== undefined ? forceValue : true));
    return (
      <button
        title={label}
        onClick={onClick ? onClick : () => {
          if (format) onFormatChange(format, forceValue !== undefined ? (isActive ? null : forceValue) : !isActive);
        }}
        className={`flex h-7 ${w} items-center justify-center rounded transition-all ${
          isActive 
            ? 'bg-indigo-500/20 text-indigo-400' 
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        {Icon ? <Icon size={14} /> : children}
      </button>
    );
  };

  // Utility Component: Divider
  const Div = () => <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />;

  // Utility Component: Dropdown
  const TDropdown = ({ id, icon: Icon, label, children, width = "w-48", currentVal }: any) => {
    const isOpen = activeDropdown === id;
    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={`flex h-7 items-center justify-between gap-1 rounded px-1.5 transition-all min-w-fit ${
            isOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
          title={label}
        >
          {Icon ? <Icon size={14} /> : <span className="text-[13px] font-medium">{currentVal}</span>}
          <ChevronDown size={11} className="text-white/40 ml-1" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.1 }}
              className={`absolute top-full left-0 mt-1 ${width} rounded-xl border border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1 max-h-80 overflow-y-auto`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const DItem = ({ label, icon: Icon, onClick, active, shortcut }: any) => (
    <button 
      onClick={() => { onClick(); setActiveDropdown(null); }}
      className={`w-full px-4 py-1.5 flex items-center justify-between text-[13px] transition-colors ${
        active ? 'bg-indigo-500/10 text-indigo-400' : 'text-white/80 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon ? <Icon size={14} className={active ? 'text-indigo-400' : 'text-white/40'} /> : (active ? <Check size={14} className="text-indigo-400"/> : <div className="w-3.5"/>)}
        <span>{label}</span>
      </div>
      {shortcut && <span className="text-white/30 text-[11px] font-mono">{shortcut}</span>}
    </button>
  );

  return (
    <div className="px-3 py-1 bg-[#0A0A0A] no-print">
      <div ref={toolbarRef} className="flex min-h-[36px] flex-wrap shrink-0 items-center px-3 bg-[#1A1A1A] rounded-2xl border border-white/[0.08] shadow-sm z-10 select-none gap-0.5 mx-2 py-1">
      
      {/* 1. Actions */}
      <TBtn icon={Search} label="Search" onClick={() => onFormatChange('action', 'search')} />
      <TBtn icon={Undo2} label="Undo (Cmd+Z)" onClick={() => onFormatChange('action', 'undo')} />
      <TBtn icon={Redo2} label="Redo (Cmd+Y)" onClick={() => onFormatChange('action', 'redo')} />
      <TBtn icon={Printer} label="Print" onClick={() => onFormatChange('action', 'print')} />
      <TBtn icon={PaintRoller} label="Paint format" onClick={() => onFormatChange('action', 'paint_format')} />
      
      <Div />

      {/* 2. Zoom Removed - Moved to footer */}

      {/* 3. Formats */}
      <TBtn icon={PoundSterling} label="Format as currency" onClick={() => onFormatChange('numberFormat', 'currency')} />
      <TBtn icon={Percent} label="Format as percent" onClick={() => onFormatChange('numberFormat', 'percent')} />
      <TBtn icon={ArrowLeftToLine} label="Decrease decimal" onClick={() => onFormatChange('action', 'decrease_decimal')} />
      <TBtn icon={ArrowRightToLine} label="Increase decimal" onClick={() => onFormatChange('action', 'increase_decimal')} />
      
      <Div />

      <NumberFormatDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
      />

      <Div />

      {/* 4. Font & Size */}
      <FontDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange}
        currentVal={FONT_FAMILIES.find(f => f.value === currentFontFamily)?.name || 'Default'}
      />

      <Div />

      <div className="flex items-center gap-0.5">
        <TBtn label="Decrease font size" w="w-5" onClick={() => onFormatChange('fontSize', Math.max(6, currentFontSize - 1))}>
          <span className="text-sm">-</span>
        </TBtn>
        <span className="text-xs text-white/80 w-6 text-center font-medium border border-white/10 rounded mx-0.5 py-0.5">{currentFontSize}</span>
        <TBtn label="Increase font size" w="w-5" onClick={() => onFormatChange('fontSize', Math.min(72, currentFontSize + 1))}>
          <span className="text-sm">+</span>
        </TBtn>
      </div>

      <Div />

      {/* 5. Text Styles */}
      <TBtn icon={Bold} format="bold" label="Bold (Cmd+B)" />
      <TBtn icon={Italic} format="italic" label="Italic (Cmd+I)" />
      <TBtn icon={Underline} format="underline" label="Underline (Cmd+U)" />
      <TBtn icon={Strikethrough} format="strikethrough" label="Strikethrough (Option+Shift+5)" />
      
      <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-white/70 hover:bg-white/10 hover:text-white transition relative group" title="Text Color">
        <Type size={14} className="group-hover:-translate-y-0.5 transition-transform" />
        <div className="absolute bottom-1 left-1.5 right-1.5 h-0.5 bg-current" style={{ color: activeFormats.color || '#ffffff' }} />
        <input type="color" className="hidden" value={activeFormats.color || '#ffffff'} onChange={e => onFormatChange('color', e.target.value)} />
      </label>

      <Div />

      {/* 6. Fill Color, Borders, Merge */}
      <ColorPickerDropdown 
        id="fill_color" 
        icon={PaintBucket} 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
        formatKey="backgroundColor" 
      />

      <BorderPickerDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
      />

      <TDropdown id="merge" icon={Merge} label="Merge cells" width="w-48">
        <DItem label="Merge all" onClick={() => onFormatChange('merge', 'all')} />
        <DItem label="Merge horizontally" onClick={() => onFormatChange('merge', 'horizontal')} />
        <DItem label="Merge vertically" onClick={() => onFormatChange('merge', 'vertical')} />
        <DItem label="Unmerge" onClick={() => onFormatChange('merge', null)} />
      </TDropdown>

      <Div />

      {/* 7. Alignment & Wrapping */}
      <AlignDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
        currentVal={activeFormats.align} 
      />

      <VerticalAlignDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
        currentVal={activeFormats.verticalAlign} 
      />

      <TDropdown id="wrap" icon={WrapText} label="Text wrapping" width="w-32">
        <DItem label="Overflow" active={activeFormats.wrapText === 'overflow'} onClick={() => onFormatChange('wrapText', 'overflow')} />
        <DItem label="Wrap" active={activeFormats.wrapText === 'wrap'} onClick={() => onFormatChange('wrapText', 'wrap')} />
        <DItem label="Clip" active={activeFormats.wrapText === 'clip'} onClick={() => onFormatChange('wrapText', 'clip')} />
      </TDropdown>
      
      <TDropdown id="rotation" icon={FlipVertical} label="Text rotation" width="w-40">
        <DItem label="None" onClick={() => onFormatChange('textRotation', null)} />
        <DItem label="Tilt up" onClick={() => onFormatChange('textRotation', 'tilt-up')} />
        <DItem label="Tilt down" onClick={() => onFormatChange('textRotation', 'tilt-down')} />
        <DItem label="Stack vertically" onClick={() => onFormatChange('textRotation', 'stack')} />
        <DItem label="Rotate up" onClick={() => onFormatChange('textRotation', 'rotate-up')} />
        <DItem label="Rotate down" onClick={() => onFormatChange('textRotation', 'rotate-down')} />
      </TDropdown>

      <Div />

      {/* 8. Inserts & Tools */}
      <TBtn icon={Link2} label="Insert link (Cmd+K)" onClick={() => onFormatChange('action', 'insert_link')} />
      <TBtn icon={MessageSquarePlus} label="Insert comment (Cmd+Option+M)" onClick={() => onFormatChange('action', 'insert_comment')} />
      <TBtn icon={LineChart} label="Insert chart" onClick={() => onFormatChange('action', 'insert_chart')} />
      <TBtn icon={Filter} label="Create a filter" onClick={() => onFormatChange('action', 'create_filter')} />
      <TDropdown id="filter_views" icon={ListFilter} label="Filter views" width="w-40">
        <DItem label="Create new filter view" onClick={() => onFormatChange('action', 'save_filter')} />
        <DItem label="Delete all filter views" onClick={() => onFormatChange('action', 'delete_filters')} />
      </TDropdown>

      <FunctionDropdown 
        activeDropdown={activeDropdown} 
        setActiveDropdown={setActiveDropdown} 
        onFormatChange={onFormatChange} 
      />
      
    </div>
    </div>
  );
}
