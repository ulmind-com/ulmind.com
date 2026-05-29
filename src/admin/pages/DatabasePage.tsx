import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Bell, Settings, Star, Clock, UserPlus, FileSpreadsheet, 
  ChevronDown, Filter, Columns, Hash, Zap, Sparkles, Folder, Command 
} from "lucide-react";
import { SpreadsheetGrid, SpreadsheetGridHandle } from "../components/spreadsheet/SpreadsheetGrid";
import { SpreadsheetToolbar } from "../components/spreadsheet/SpreadsheetToolbar";
import { FormulaBar } from "../components/spreadsheet/FormulaBar";
import { AiSidebar } from "../components/spreadsheet/AiSidebar";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from 'xlsx';
import { useRef } from 'react';

export default function DatabasePage() {
  const [sheets, setSheets] = useState<any[]>([]);
  const [activeSheet, setActiveSheet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, any>>({});
  const [selectedCell, setSelectedCell] = useState<{rowId: string | null, colId: string | null, value: string, styles?: any} | null>(null);
  const gridRef = useRef<SpreadsheetGridHandle>(null);
  const [showAi, setShowAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchSheets = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/sheets/");
      if (res.ok) {
        const data = await res.json();
        setSheets(data);
        if (data.length > 0 && !activeSheet) {
          setActiveSheet(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sheets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  const handleCreateSheet = async () => {
    if (!newSheetName) return;
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/sheets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSheetName, description: "", columns: [] }),
      });
      if (res.ok) {
        const data = await res.json();
        setSheets([...sheets, data]);
        setActiveSheet(data);
        setNewSheetName("");
        setShowCreate(false);
      }
    } catch (error) {
      console.error("Failed to create sheet:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Recalculate range in case the file's !ref is broken or truncated
        let max_c = 0, max_r = 0;
        for (const key in ws) {
          if (key[0] === '!') continue;
          const cell = XLSX.utils.decode_cell(key);
          if (cell.c > max_c) max_c = cell.c;
          if (cell.r > max_r) max_r = cell.r;
        }
        ws['!ref'] = XLSX.utils.encode_range({s: {c:0, r:0}, e: {c:max_c, r:max_r}});
        
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (data.length > 0) {
          // Find the true header row (the one with the most columns, within the first 30 rows)
          let headerRowIndex = 0;
          let maxCols = 0;
          for (let i = 0; i < Math.min(30, data.length); i++) {
            const rowCols = (data[i] || []).filter(c => {
              if (c === undefined || c === null) return false;
              if (typeof c === 'string' && c.replace(/\s+/g, '') === '') return false;
              return true;
            }).length;
            if (rowCols > maxCols) {
              maxCols = rowCols;
              headerRowIndex = i;
            }
          }

          const rawHeaders = data[headerRowIndex] || [];
          const headerIndices: number[] = [];
          const headers: string[] = [];
          
          for (let colIdx = 0; colIdx < rawHeaders.length; colIdx++) {
            const h = rawHeaders[colIdx];
            if (h !== undefined && h !== null) {
              const headerStr = String(h).trim();
              if (headerStr !== '') {
                // Ensure unique header names if there are duplicates
                let finalHeader = headerStr;
                let counter = 1;
                while (headers.includes(finalHeader)) {
                  finalHeader = `${headerStr} ${counter}`;
                  counter++;
                }
                headers.push(finalHeader);
                headerIndices.push(colIdx);
              }
            }
          }

          const columns = headers.map((h: string) => ({
            field: h.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'column_' + Math.random().toString(36).substr(2, 5),
            headerName: h,
            type: 'text',
            editable: true,
            width: 150
          }));

          // 1. Create Sheet
          const sheetRes = await fetch("http://127.0.0.1:5000/api/v1/sheets/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name.replace(/\.[^/.]+$/, ""), columns }),
          });
          
          if (sheetRes.ok) {
            const newSheet = await sheetRes.json();
            
            // 2. Prepare Bulk Rows
            const rowsData = [];
            for (let i = headerRowIndex + 1; i < data.length; i++) {
              const row = data[i];
              if (!row || row.length === 0) continue;
              
              const rowObj: Record<string, any> = {};
              headers.forEach((h, idx) => {
                const originalColIdx = headerIndices[idx];
                const field = columns[idx].field;
                rowObj[field] = row[originalColIdx] !== undefined ? row[originalColIdx] : "";
              });
              
              // Only insert rows that actually have some content
              if (Object.values(rowObj).some(val => val !== "")) {
                rowsData.push({ data: rowObj });
              }
            }

            // 3. Bulk Insert
            if (rowsData.length > 0) {
              await fetch(`http://127.0.0.1:5000/api/v1/sheets/${newSheet._id}/rows/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowsData),
              });
            }

            // Reload sheets
            await fetchSheets();
            setActiveSheet(newSheet);
          }
        }
      } catch (error) {
        console.error("Error importing file", error);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex h-[calc(100vh-112px)] w-full overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] shadow-2xl font-sans text-[#EAEAEA]">
      {/* ─── LEFT SIDEBAR (Notion/Linear Inspired) ─── */}
      <motion.div 
        initial={{ width: 260 }}
        animate={{ width: isSidebarCollapsed ? 0 : 260 }}
        className="flex flex-col border-r border-white/[0.08] bg-[#111111] overflow-hidden relative shrink-0"
      >
        <div className="flex items-center justify-between p-4 px-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={14} className="text-white" />
            </div>
            Workspaces
          </div>
          <button className="text-white/40 hover:text-white transition">
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Global Search Button */}
        <div className="px-4 pb-4">
          <button className="flex w-full items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2 text-xs text-white/50 hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-white/30 tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
              <Command size={10}/> K
            </div>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-6">
          
          {/* Favorites */}
          <div>
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-white/30 flex items-center justify-between">
              Favorites
            </div>
            <div className="space-y-0.5 mt-1">
              {sheets.slice(0, 2).map((sheet) => (
                <button
                  key={`fav-${sheet._id}`}
                  onClick={() => setActiveSheet(sheet)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    activeSheet?._id === sheet._id
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Star size={14} className={activeSheet?._id === sheet._id ? "fill-indigo-400" : ""} />
                  <span className="truncate">{sheet.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All Sheets */}
          <div>
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-white/30 flex items-center justify-between group">
              All Sheets
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="hover:text-white p-1" title="Import Excel">
                  <Folder size={13} />
                </button>
                <button onClick={() => setShowCreate(true)} className="hover:text-white p-1" title="New Sheet">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-0.5 mt-1">
              {loading ? (
                <div className="px-3 py-2 text-xs text-white/30">Loading...</div>
              ) : (
                sheets.map((sheet) => (
                  <button
                    key={sheet._id}
                    onClick={() => setActiveSheet(sheet)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                      activeSheet?._id === sheet._id
                        ? "bg-white/[0.08] text-white shadow-sm"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileSpreadsheet size={14} className={activeSheet?._id === sheet._id ? "text-indigo-400" : "text-white/30"} />
                      <span className="truncate">{sheet.name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User / Setting Bottom */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
          <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
            <div className="flex-1 text-left">
              <div className="text-[13px] font-medium text-white">My Workspace</div>
              <div className="text-[11px] text-white/40">Free Plan</div>
            </div>
            <Settings size={14} className="text-white/40" />
          </button>
        </div>
      </motion.div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 flex-col overflow-hidden relative bg-[#0A0A0A]">
        
        {/* TOPBAR */}
        {activeSheet && (
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-5 bg-[#0A0A0A]/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
                <FileSpreadsheet size={16} className="text-indigo-400" />
                {activeSheet.name}
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex gap-1">
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition">
                  <Columns size={14} /> Group
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Active Users (Presence Mock) */}
              <div className="flex -space-x-2 mr-2">
                <div className="h-7 w-7 rounded-full border-2 border-[#0A0A0A] bg-blue-500 z-30" />
                <div className="h-7 w-7 rounded-full border-2 border-[#0A0A0A] bg-emerald-500 z-20" />
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-white/10 text-[10px] font-bold text-white z-10">+2</div>
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all shadow-sm disabled:opacity-50"
              >
                <Folder size={14} />
                {isImporting ? 'Importing...' : 'Import Excel'}
              </button>
              
              <button 
                onClick={() => setShowAi(true)}
                className="flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all shadow-sm"
              >
                <Sparkles size={14} />
                Ask AI
              </button>
              
              <button className="flex items-center gap-1.5 rounded-md bg-white text-black px-3 py-1.5 text-xs font-bold hover:bg-gray-200 transition-all shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                Share
              </button>
            </div>
          </div>
        )}

        {/* SPREADSHEET CANVAS */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeSheet ? (
            <>
              <SpreadsheetToolbar 
                activeFormats={activeFormats} 
                selectedCell={selectedCell} 
                onFormatChange={(f, v) => {
                  setActiveFormats({...activeFormats, [f]: v});
                  gridRef.current?.applyFormat(f, v);
                }} 
              />
              <FormulaBar 
                selectedCell={selectedCell}
                cellValue={selectedCell?.value || ""}
                onCellValueChange={(val) => {
                  setSelectedCell(prev => prev ? {...prev, value: val} : null);
                  // Optional: trigger grid update logic if we want real-time formula bar typing to update grid
                }}
              />
              <SpreadsheetGrid 
                ref={gridRef}
                key={activeSheet._id} 
                sheet={activeSheet} 
                onCellSelect={(cell) => {
                  setSelectedCell(cell);
                  setActiveFormats(cell.styles || {});
                }}
              />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-white/30 gap-6">
              <div className="h-24 w-24 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-2xl">
                <FileSpreadsheet size={40} className="opacity-20" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">No Sheet Selected</h3>
                <p className="text-sm">Create a new spreadsheet from the sidebar or import data to get started.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-gray-200 shadow-xl shadow-white/5"
                >
                  <Plus size={16} /> Create Sheet
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex items-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-5 py-2.5 text-sm font-bold transition-all hover:bg-indigo-500/20 shadow-xl shadow-indigo-500/5 disabled:opacity-50"
                >
                  <Folder size={16} /> {isImporting ? 'Importing...' : 'Import Excel'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global File Input for Import */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".xlsx, .xls, .csv" 
          hidden 
        />

        {/* AI Sidebar */}
        <AiSidebar 
          isOpen={showAi} 
          onClose={() => setShowAi(false)} 
          sheetId={activeSheet?._id || null} 
        />
      </div>

      {/* CREATE MODAL (Premium Glassmorphism) */}
      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Create Workspace Sheet</h2>
                    <p className="text-[13px] text-white/40">Start a new blank database</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium uppercase tracking-wider text-white/50 mb-1.5 block">Sheet Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sales Pipeline Q3"
                      value={newSheetName}
                      onChange={(e) => setNewSheetName(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-[14px] text-white placeholder-white/20 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/[0.02]"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateSheet()}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/[0.08] bg-white/[0.02] p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSheet}
                  className="rounded-lg bg-white px-5 py-2 text-[13px] font-bold text-black hover:bg-gray-200 transition-all shadow-[0_2px_15px_rgba(255,255,255,0.1)]"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
