import React from 'react';
import { FunctionSquare } from 'lucide-react';

interface FormulaBarProps {
  selectedCell: { rowId: str | null, colId: str | null } | null;
  cellValue: str;
  onCellValueChange: (val: string) => void;
}

export function FormulaBar({ selectedCell, cellValue, onCellValueChange }: FormulaBarProps) {
  
  // Calculate a generic cell address (e.g., A1, B2) just for UI visual if needed, 
  // or just show the active field name.
  const address = selectedCell?.colId ? selectedCell.colId.toUpperCase() : '';

  return (
    <div className="flex h-8 w-full shrink-0 items-center border-b border-[#333333] bg-[#0A0A0A] text-sm text-[#EAEAEA] font-sans">
      
      {/* Address Box */}
      <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-[#333333] bg-[#1A1A1A] text-[11px] font-semibold text-[#888888]">
        {address}
      </div>

      {/* fx Icon */}
      <div className="flex h-full w-8 shrink-0 items-center justify-center text-[#666666]">
        <FunctionSquare size={14} className="italic opacity-80" />
      </div>

      {/* Input Area */}
      <input
        type="text"
        value={cellValue}
        onChange={(e) => onCellValueChange(e.target.value)}
        disabled={!selectedCell?.colId}
        className="h-full flex-1 bg-transparent px-2 text-[13px] text-[#EAEAEA] outline-none disabled:opacity-50"
        placeholder={selectedCell?.colId ? "Enter value or formula..." : ""}
      />
    </div>
  );
}
