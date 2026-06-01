import React, { useState, useEffect } from 'react';
import { X, Printer, Download, LayoutTemplate, File, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PrintSettings {
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  scale: string;
  margin: string;
  showGridlines: boolean;
  showHeaders: boolean;
}

interface SpreadsheetPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (settings: PrintSettings) => void;
  totalPages?: number;
  calculatedScale?: number;
}

export function SpreadsheetPrintModal({ 
  isOpen, 
  onClose, 
  onPrint,
  totalPages = 1,
  calculatedScale = 100
}: SpreadsheetPrintModalProps) {
  const [settings, setSettings] = useState<PrintSettings>({
    paperSize: 'A4',
    orientation: 'landscape',
    scale: 'fit_width',
    margin: 'normal',
    showGridlines: true,
    showHeaders: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex">
      {/* LEFT PANEL - PREVIEW AREA */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-8 relative">
        <div className="absolute top-6 left-6 text-white/50 text-sm font-medium flex items-center gap-2">
          <Printer size={16} />
          Print Settings
        </div>
        
        {/* Mock Preview Canvas */}
        <div 
          className="bg-white rounded shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
          style={{
            width: settings.orientation === 'portrait' ? '400px' : '560px',
            height: settings.orientation === 'portrait' ? '560px' : '400px',
            padding: settings.margin === 'narrow' ? '12px' : settings.margin === 'wide' ? '40px' : '24px'
          }}
        >
          {/* Header Mock */}
          <div className="w-full h-8 border-b border-gray-200 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-24 h-2 bg-gray-100 rounded"></div>
          </div>
          
          {/* Grid Mock */}
          <div className="flex-1 border border-gray-200 rounded grid grid-cols-4 grid-rows-6 gap-px bg-gray-200 overflow-hidden relative">
             {Array.from({ length: 24 }).map((_, i) => (
               <div key={i} className="bg-white"></div>
             ))}
             
             {/* Center Descriptive Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
                <File size={24} className="text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium text-[13px]">Layout Preview</p>
                <p className="text-gray-400 text-[11px] mt-1 text-center px-6">Click <strong>Next</strong> to generate the high-fidelity print preview with your actual spreadsheet data.</p>
             </div>
             
             {/* Overlay overlay for scale text */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/90">
                <div className="bg-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  Scale: {settings.scale === 'fit_width' ? 'Auto-Fit' : '100%'} ({Math.round(calculatedScale)}%)
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-4 right-4 text-gray-400 text-[10px]">Page 1 of {totalPages}</div>
        </div>
        
        <div className="mt-8 flex items-center gap-6 text-white/40 text-xs">
          <div className="flex items-center gap-1.5">
            <LayoutTemplate size={14} />
            Calculated Scale: {Math.round(calculatedScale)}%
          </div>
          <div className="flex items-center gap-1.5">
            <File size={14} />
            Estimated Pages: {totalPages}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - SETTINGS */}
      <div className="w-[340px] bg-[#111111] border-l border-white/10 flex flex-col h-full shadow-2xl">
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <h2 className="text-[15px] font-semibold text-white">Print</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Paper Size */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Paper size</label>
            <select 
              value={settings.paperSize}
              onChange={(e) => setSettings({...settings, paperSize: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="A4">A4 (210mm x 297mm)</option>
              <option value="A3">A3 (297mm x 420mm)</option>
              <option value="Letter">Letter (8.5" x 11")</option>
              <option value="Legal">Legal (8.5" x 14")</option>
            </select>
          </div>

          {/* Orientation */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Page orientation</label>
            <select 
              value={settings.orientation}
              onChange={(e) => setSettings({...settings, orientation: e.target.value as any})}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>

          {/* Scale */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Scale</label>
            <select 
              value={settings.scale}
              onChange={(e) => setSettings({...settings, scale: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="normal">Normal (100%)</option>
              <option value="fit_width">Fit to width</option>
              <option value="fit_height">Fit to height</option>
              <option value="fit_page">Fit to page</option>
            </select>
            {settings.scale === 'fit_width' && (
              <p className="text-[11px] text-emerald-400 mt-1">Columns will be scaled to prevent cropping.</p>
            )}
          </div>

          {/* Margins */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Margins</label>
            <select 
              value={settings.margin}
              onChange={(e) => setSettings({...settings, margin: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="normal">Normal</option>
              <option value="narrow">Narrow</option>
              <option value="wide">Wide</option>
            </select>
          </div>

          <div className="h-px bg-white/5 w-full my-4"></div>

          {/* Formatting */}
          <div className="space-y-3">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Formatting</label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4">
                <input 
                  type="checkbox" 
                  checked={settings.showGridlines}
                  onChange={(e) => setSettings({...settings, showGridlines: e.target.checked})}
                  className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-transparent checked:bg-indigo-500 checked:border-indigo-500 transition-colors"
                />
                <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
              </div>
              <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">Show gridlines</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4">
                <input 
                  type="checkbox" 
                  checked={settings.showHeaders}
                  onChange={(e) => setSettings({...settings, showHeaders: e.target.checked})}
                  className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-transparent checked:bg-indigo-500 checked:border-indigo-500 transition-colors"
                />
                <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
              </div>
              <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">Repeat row headers</span>
            </label>
          </div>

        </div>

        <div className="p-6 border-t border-white/5 bg-[#141414] flex flex-col gap-3">
          <button 
            onClick={() => onPrint(settings)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[13px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-transparent hover:bg-white/5 text-white/70 font-medium text-[13px] py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
