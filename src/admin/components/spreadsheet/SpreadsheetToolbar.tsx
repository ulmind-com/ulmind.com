import React from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, PaintBucket, Type, Link2, Undo2, Redo2, ChevronDown 
} from 'lucide-react';

interface SpreadsheetToolbarProps {
  onFormatChange: (format: string, value?: any) => void;
  activeFormats: Record<string, any>;
  selectedCell: { rowId: str | null, colId: str | null } | null;
}

export function SpreadsheetToolbar({ onFormatChange, activeFormats, selectedCell }: SpreadsheetToolbarProps) {
  
  const ToolbarButton = ({ icon: Icon, format, label, active = false, forceValue }: any) => (
    <button
      title={label}
      onClick={() => onFormatChange(format, forceValue !== undefined ? (active ? null : forceValue) : !active)}
      className={`flex h-7 w-7 items-center justify-center rounded transition-all ${
        active 
          ? 'bg-indigo-500/20 text-indigo-400' 
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={14} />
    </button>
  );

  const currentFontSize = activeFormats.fontSize || 13;

  return (
    <div className="flex h-12 w-full shrink-0 items-center gap-1 border-b border-white/[0.08] bg-[#0A0A0A] px-4 shadow-sm z-10">
      
      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 pr-3 border-r border-white/10">
        <button className="flex h-7 w-7 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white transition"><Undo2 size={14}/></button>
        <button className="flex h-7 w-7 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white transition"><Redo2 size={14}/></button>
      </div>

      {/* Font & Size */}
      <div className="flex items-center gap-2 px-3 border-r border-white/10">
        <button className="flex h-7 items-center justify-between gap-2 rounded px-2 text-xs font-medium text-white/70 hover:bg-white/10 transition">
          Inter <ChevronDown size={12} className="text-white/40"/>
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onFormatChange('fontSize', Math.max(8, currentFontSize - 1))}
            className="flex h-7 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            -
          </button>
          <span className="text-xs text-white/80 w-4 text-center">{currentFontSize}</span>
          <button 
            onClick={() => onFormatChange('fontSize', Math.min(72, currentFontSize + 1))}
            className="flex h-7 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-0.5 px-3 border-r border-white/10">
        <ToolbarButton icon={Bold} format="bold" label="Bold" active={activeFormats.bold} />
        <ToolbarButton icon={Italic} format="italic" label="Italic" active={activeFormats.italic} />
        <ToolbarButton icon={Strikethrough} format="strikethrough" label="Strikethrough" active={activeFormats.strikethrough} />
        <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white transition" title="Text Color">
          <Type size={14} />
          <input type="color" className="hidden" value={activeFormats.color || '#E5E5E5'} onChange={e => onFormatChange('color', e.target.value)} />
        </label>
        <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white transition" title="Fill Color">
          <PaintBucket size={14} />
          <input type="color" className="hidden" value={activeFormats.backgroundColor || '#0A0A0A'} onChange={e => onFormatChange('backgroundColor', e.target.value)} />
        </label>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-3 border-r border-white/10">
        <ToolbarButton icon={AlignLeft} format="align" label="Align Left" active={activeFormats.align === 'left'} forceValue="left" />
        <ToolbarButton icon={AlignCenter} format="align" label="Align Center" active={activeFormats.align === 'center'} forceValue="center" />
        <ToolbarButton icon={AlignRight} format="align" label="Align Right" active={activeFormats.align === 'right'} forceValue="right" />
      </div>

      <div className="flex items-center gap-0.5 px-3">
        <ToolbarButton icon={Link2} format="link" label="Insert Link" />
      </div>
      
      <div className="flex-1"></div>
      
      {/* Selected Cell Indicator */}
      <div className="text-[11px] font-mono text-white/30 tracking-wider">
        {selectedCell?.rowId && selectedCell?.colId 
          ? `CELL: ${selectedCell.colId.toUpperCase()}` 
          : 'NO SELECTION'}
      </div>

    </div>
  );
}
