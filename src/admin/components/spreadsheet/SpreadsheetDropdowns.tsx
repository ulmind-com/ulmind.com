import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Check, Type, Baseline, PaintBucket, Grid3X3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ArrowUpToLine, ArrowDownToLine, AlignVerticalSpaceAround,
  WrapText, ListFilter, Sigma
} from 'lucide-react';

// ==========================================
// Base Dropdown Wrapper
// ==========================================
export const BaseDropdown = ({ id, activeDropdown, setActiveDropdown, icon: Icon, label, currentVal, children, width = "w-48", w = "" }: any) => {
  const isOpen = activeDropdown === id;
  const btnRef = useRef<HTMLButtonElement>(null);
  
  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setActiveDropdown(isOpen ? null : id)}
        className={`flex h-7 items-center justify-between gap-1 rounded px-1.5 transition-all ${w ? w : 'min-w-fit'} ${
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
            className={`absolute top-full left-0 mt-1 ${width} rounded-xl border border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1 max-h-[400px] overflow-y-auto`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// Number Format Dropdown
// ==========================================
export const NumberFormatDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange, currentVal }: any) => {
  const items = [
    { label: 'Automatic', value: null, shortcut: '' },
    { label: 'Plain text', value: 'text', shortcut: '' },
    { divider: true },
    { label: 'Number', value: 'number', shortcut: '1,000.12' },
    { label: 'Percent', value: 'percent', shortcut: '10.12%' },
    { label: 'Scientific', value: 'scientific', shortcut: '1.01E+03' },
    { divider: true },
    { label: 'Accounting', value: 'accounting', shortcut: '₹(1,000.12)' },
    { label: 'Financial', value: 'financial', shortcut: '(1,000.12)' },
    { label: 'Currency', value: 'currency', shortcut: '₹1,000.12' },
    { label: 'Currency (rounded)', value: 'currency_rounded', shortcut: '₹1,000' },
    { divider: true },
    { label: 'Date', value: 'date', shortcut: '9/26/2008' },
    { label: 'Time', value: 'time', shortcut: '3:59:00 PM' },
    { label: 'Date time', value: 'datetime', shortcut: '9/26/2008 15:59:00' },
    { label: 'Duration', value: 'duration', shortcut: '24:01:00' }
  ];

  return (
    <BaseDropdown id="number_format" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} currentVal={currentVal || "123"} label="More formats" width="w-56">
      {items.map((item, i) => item.divider ? (
        <div key={i} className="h-px w-full bg-white/5 my-1" />
      ) : (
        <button
          key={i}
          onClick={() => { onFormatChange('numberFormat', item.value); setActiveDropdown(null); }}
          className="w-full px-3 py-1.5 text-left text-[13px] text-white/80 hover:bg-indigo-500/20 hover:text-white transition flex items-center justify-between group"
        >
          <span>{item.label}</span>
          {item.shortcut && <span className="text-[11px] text-white/30 group-hover:text-white/50">{item.shortcut}</span>}
        </button>
      ))}
    </BaseDropdown>
  );
};

// ==========================================
// Font Family Dropdown
// ==========================================
export const FontDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange, currentVal }: any) => {
  const FONT_FAMILIES = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Fira Code', value: '"Fira Code", monospace' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' }
  ];
  
  const [search, setSearch] = useState("");
  const filteredFonts = FONT_FAMILIES.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <BaseDropdown id="font_family" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} currentVal={currentVal} label="Font" width="w-48" w="w-24">
      <div className="px-2 py-1 pb-2">
        <input 
          type="text" 
          placeholder="Search fonts" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-500/50"
        />
      </div>
      <div className="h-px w-full bg-white/5 mb-1" />
      {filteredFonts.map((font, i) => (
        <button
          key={i}
          onClick={() => { onFormatChange('fontFamily', font.value); setActiveDropdown(null); }}
          className="w-full px-3 py-1.5 text-left text-[13px] text-white/80 hover:bg-indigo-500/20 hover:text-white transition flex items-center justify-between"
          style={{ fontFamily: font.value }}
        >
          {font.name}
        </button>
      ))}
    </BaseDropdown>
  );
};

// ==========================================
// Color Picker Dropdown (Fill & Text)
// ==========================================
export const ColorPickerDropdown = ({ id, icon: Icon, activeDropdown, setActiveDropdown, onFormatChange, formatKey }: any) => {
  const STANDARD_COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
    '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
    '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
  ];

  return (
    <BaseDropdown id={id} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} icon={Icon} label="Color Picker" width="w-64">
      <div className="p-2">
        <button
          onClick={() => { onFormatChange(formatKey, null); setActiveDropdown(null); }}
          className="w-full text-center py-1.5 text-xs text-white/70 hover:bg-white/10 rounded mb-2 border border-white/10"
        >
          Reset / Clear
        </button>
        <div className="grid grid-cols-10 gap-1">
          {STANDARD_COLORS.map(c => (
            <button
              key={c}
              onClick={() => { onFormatChange(formatKey, c); setActiveDropdown(null); }}
              className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </BaseDropdown>
  );
};

// ==========================================
// Border Picker Dropdown
// ==========================================
export const BorderPickerDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange }: any) => {
  const borderTypes = [
    { id: 'all', icon: Grid3X3 },
    { id: 'inner', icon: Grid3X3 },
    { id: 'horizontal', icon: Grid3X3 },
    { id: 'vertical', icon: Grid3X3 },
    { id: 'outer', icon: Grid3X3 },
    { id: 'left', icon: Grid3X3 },
    { id: 'top', icon: Grid3X3 },
    { id: 'right', icon: Grid3X3 },
    { id: 'bottom', icon: Grid3X3 },
    { id: 'none', icon: Grid3X3 },
  ];

  return (
    <BaseDropdown id="borders" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} icon={Grid3X3} label="Borders" width="w-40">
      <div className="p-2">
        <div className="grid grid-cols-5 gap-1 mb-2">
          {borderTypes.map(b => (
            <button
              key={b.id}
              onClick={() => { onFormatChange('border', b.id); setActiveDropdown(null); }}
              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center"
              title={b.id}
            >
              <b.icon size={16} />
            </button>
          ))}
        </div>
        <div className="h-px w-full bg-white/10 my-2" />
        <div className="text-[10px] uppercase text-white/40 mb-1 px-1">Border Color</div>
        <input type="color" className="w-full h-6 rounded cursor-pointer" onChange={(e) => onFormatChange('borderColor', e.target.value)} />
      </div>
    </BaseDropdown>
  );
};

// ==========================================
// Alignments
// ==========================================
export const AlignDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange, currentVal }: any) => {
  const items = [
    { label: 'Left', value: 'left', icon: AlignLeft },
    { label: 'Center', value: 'center', icon: AlignCenter },
    { label: 'Right', value: 'right', icon: AlignRight },
  ];
  const CurrentIcon = items.find(i => i.value === currentVal)?.icon || AlignLeft;

  return (
    <BaseDropdown id="align" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} icon={CurrentIcon} label="Horizontal Align" width="w-32">
      <div className="flex justify-around p-1">
        {items.map(item => (
          <button key={item.value} onClick={() => { onFormatChange('align', item.value); setActiveDropdown(null); }} className={`p-1.5 rounded hover:bg-white/10 ${currentVal === item.value ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/70'}`} title={item.label}>
            <item.icon size={16} />
          </button>
        ))}
      </div>
    </BaseDropdown>
  );
};

export const VerticalAlignDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange, currentVal }: any) => {
  const items = [
    { label: 'Top', value: 'top', icon: ArrowUpToLine },
    { label: 'Middle', value: 'middle', icon: AlignVerticalSpaceAround },
    { label: 'Bottom', value: 'bottom', icon: ArrowDownToLine },
  ];
  const CurrentIcon = items.find(i => i.value === currentVal)?.icon || ArrowDownToLine;

  return (
    <BaseDropdown id="valign" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} icon={CurrentIcon} label="Vertical Align" width="w-32">
      <div className="flex justify-around p-1">
        {items.map(item => (
          <button key={item.value} onClick={() => { onFormatChange('verticalAlign', item.value); setActiveDropdown(null); }} className={`p-1.5 rounded hover:bg-white/10 ${currentVal === item.value ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/70'}`} title={item.label}>
            <item.icon size={16} />
          </button>
        ))}
      </div>
    </BaseDropdown>
  );
};

// ==========================================
// Function Dropdown
// ==========================================
export const FunctionDropdown = ({ activeDropdown, setActiveDropdown, onFormatChange }: any) => {
  const FUNCTIONS = {
    'Math': ['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN', 'ABS', 'ROUND'],
    'Logical': ['IF', 'IFS', 'AND', 'OR', 'NOT'],
    'Lookup': ['VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'INDEX', 'MATCH', 'FILTER'],
    'Text': ['CONCATENATE', 'LEFT', 'RIGHT', 'MID', 'LEN', 'SPLIT'],
    'Date': ['TODAY', 'NOW', 'DATE', 'YEAR', 'MONTH', 'DAY']
  };

  return (
    <BaseDropdown id="functions" activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} icon={Sigma} label="Functions" width="w-48">
      {Object.entries(FUNCTIONS).map(([category, funcs]) => (
        <div key={category} className="mb-2">
          <div className="text-[10px] uppercase text-white/40 px-3 py-1 bg-white/5 font-bold">{category}</div>
          {funcs.map(f => (
            <button
              key={f}
              onClick={() => { onFormatChange('function', f); setActiveDropdown(null); }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-white/80 hover:bg-indigo-500/20 hover:text-white transition"
            >
              {f}
            </button>
          ))}
        </div>
      ))}
    </BaseDropdown>
  );
};
