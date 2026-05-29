import React, { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllEnterpriseModule, ModuleRegistry, ColDef, CellClassParams } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Settings, Plus, RotateCw, CheckCircle2, Columns } from 'lucide-react';
import { AddColumnModal } from './AddColumnModal';

ModuleRegistry.registerModules([AllEnterpriseModule]);

export interface SpreadsheetGridHandle {
  applyFormat: (format: string, value: any) => void;
}

interface SpreadsheetGridProps {
  sheet: any;
  onCellSelect?: (cell: { rowId: string, colId: string, value: string, styles: any }) => void;
}

export const SpreadsheetGrid = forwardRef<SpreadsheetGridHandle, SpreadsheetGridProps>(
  ({ sheet, onCellSelect }, ref) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const gridRef = useRef<AgGridReact>(null);
    const wsRef = useRef<WebSocket | null>(null);

  // WebSocket Connection
  useEffect(() => {
    if (!sheet?._id) return;
    
    const ws = new WebSocket(`ws://127.0.0.1:5000/ws/${sheet._id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'cell_update' && gridRef.current) {
          const rowNode = gridRef.current.api.getRowNode(data.rowId);
          if (rowNode) {
            rowNode.setDataValue(data.field, data.value);
            gridRef.current.api.flashCells({ rowNodes: [rowNode], columns: [data.field] });
          }
        } else if (data.type === 'schema_update' && gridRef.current) {
          // Schema changed (new column added)
          updateColumnsFromSchema(data.columns);
        } else if (data.type === 'style_update' && gridRef.current) {
          const rowNode = gridRef.current.api.getRowNode(data.rowId);
          if (rowNode) {
            const currentData = { ...rowNode.data };
            currentData._styles = data.styles;
            rowNode.setData(currentData);
            gridRef.current.api.flashCells({ rowNodes: [rowNode], columns: [data.field] });
          }
        }
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [sheet?._id]);

  const updateColumnsFromSchema = (columns: any[]) => {
    setColumnDefs([
      { 
        headerName: '',
        valueGetter: 'node.rowIndex + 1',
        width: 50,
        pinned: 'left',
        suppressHeaderMenuButton: true,
        sortable: false,
        filter: false,
        resizable: false,
        editable: false,
        cellStyle: { backgroundColor: '#161616', color: '#6B7280', borderRight: '1px solid #333333', textAlign: 'center', fontWeight: '500', fontSize: '12px' }
      },
      ...columns.map((c: any) => ({
        field: c.field,
        headerName: c.headerName,
        editable: c.editable,
        width: c.width || 200,
        // Example custom renderers based on type
        ...(c.type === 'select' ? { cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Option 1', 'Option 2'] } } : {}),
        ...(c.type === 'boolean' ? { cellEditor: 'agCheckboxCellEditor' } : {})
      }))
    ]);
  };

  useEffect(() => {
    if (sheet && sheet.columns && sheet.columns.length > 0) {
      updateColumnsFromSchema(sheet.columns);
    } else {
      setColumnDefs([
        { 
          headerName: '',
          valueGetter: 'node.rowIndex + 1',
          width: 50,
          pinned: 'left',
          suppressHeaderMenuButton: true,
          sortable: false,
          filter: false,
          resizable: false,
          editable: false,
          cellStyle: { backgroundColor: '#161616', color: '#6B7280', borderRight: '1px solid #333333', textAlign: 'center', fontWeight: '500', fontSize: '12px' }
        },
        { field: 'Name', editable: true, minWidth: 200 },
        { field: 'Status', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['To Do', 'In Progress', 'Done'] } },
        { field: 'Assignee', editable: true },
        { field: 'Due Date', editable: true, minWidth: 150 },
      ]);
    }
  }, [sheet]);

  const fetchRows = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/v1/sheets/${sheet._id}/rows`);
      if (res.ok) {
        const data = await res.json();
        const flatData = data.map((d: any) => ({ ...d.data, _rowId: d._id, _styles: d.styles || {} }));
        setRowData(flatData);
      }
    } catch (error) {
      console.error("Failed to fetch rows:", error);
    }
  };

  useEffect(() => {
    if (sheet?._id) {
      fetchRows();
    }
  }, [sheet]);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    cellStyle: (params) => {
      const rowStyles = params.data?._styles || {};
      const colStyle = rowStyles[params.colDef.field!] || {};
      return {
        fontWeight: colStyle.bold ? 'bold' : 'normal',
        fontStyle: colStyle.italic ? 'italic' : 'normal',
        textDecoration: colStyle.strikethrough ? 'line-through' : 'none',
        color: colStyle.color || undefined,
        backgroundColor: colStyle.backgroundColor || undefined,
        textAlign: colStyle.align || undefined,
        fontFamily: colStyle.fontFamily || undefined,
        fontSize: colStyle.fontSize ? `${colStyle.fontSize}px` : undefined,
      };
    }
  }), []);

  const onCellValueChanged = async (event: any) => {
    const rowId = event.data._rowId;
    const newData = { ...event.data };
    delete newData._rowId;
    const styles = newData._styles || {};
    delete newData._styles;

    setIsSaving(true);
    try {
      if (rowId) {
        // Send update via REST
        await fetch(`http://127.0.0.1:5000/api/v1/sheets/${sheet._id}/rows/${rowId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: newData, styles: styles }),
        });

        // Broadcast to WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'cell_update',
            rowId: rowId,
            field: event.colDef.field,
            value: event.newValue
          }));
        }
      }
    } catch (e) {
      console.error("Error saving row", e);
    } finally {
      setIsSaving(false);
    }
  };

  const onCellFocused = (event: any) => {
    if (event.rowIndex !== null && event.column && onCellSelect) {
      const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(event.rowIndex);
      const rowId = rowNode?.data?._rowId;
      const colId = event.column.getColId();
      const value = rowNode?.data?.[colId] || '';
      const styles = rowNode?.data?._styles?.[colId] || {};
      
      onCellSelect({ rowId, colId, value: String(value), styles });
    }
  };

  useImperativeHandle(ref, () => ({
    applyFormat: async (format: string, value: any) => {
      if (!gridRef.current) return;
      
      const selectedCells = gridRef.current.api.getCellRanges();
      if (!selectedCells || selectedCells.length === 0) return;

      const range = selectedCells[0];
      const startRow = Math.min(range.startRow!.rowIndex, range.endRow!.rowIndex);
      const endRow = Math.max(range.startRow!.rowIndex, range.endRow!.rowIndex);
      
      setIsSaving(true);
      
      for (let i = startRow; i <= endRow; i++) {
        const rowNode = gridRef.current.api.getDisplayedRowAtIndex(i);
        if (!rowNode || !rowNode.data) continue;
        
        const rowId = rowNode.data._rowId;
        const currentStyles = rowNode.data._styles || {};
        
        range.columns.forEach(col => {
          const colId = col.getColId();
          if (!currentStyles[colId]) currentStyles[colId] = {};
          
          if (value === null || value === undefined || value === false) {
            delete currentStyles[colId][format];
          } else {
            currentStyles[colId][format] = value;
          }
        });

        // 1. Update local Grid instantly
        rowNode.setData({ ...rowNode.data, _styles: currentStyles });
        
        // 2. Prepare payload
        const newData = { ...rowNode.data };
        delete newData._rowId;
        delete newData._styles;

        try {
          // 3. Save to backend
          fetch(`http://127.0.0.1:5000/api/v1/sheets/${sheet._id}/rows/${rowId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: newData, styles: currentStyles }),
          });
          
          // 4. Broadcast via WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'style_update',
              rowId: rowId,
              field: range.columns[0].getColId(),
              styles: currentStyles
            }));
          }
        } catch (e) {
          console.error("Format save error", e);
        }
      }
      
      // Update our external state if only one cell was selected
      if (startRow === endRow && range.columns.length === 1) {
        const rowNode = gridRef.current.api.getDisplayedRowAtIndex(startRow);
        const colId = range.columns[0].getColId();
        const value = rowNode?.data?.[colId] || '';
        const styles = rowNode?.data?._styles?.[colId] || {};
        onCellSelect?.({ rowId: rowNode?.data?._rowId, colId, value: String(value), styles });
      }

      setIsSaving(false);
      gridRef.current.api.redrawRows();
    }
  }));

  const handleAddRow = async () => {
    setIsSaving(true);
    try {
      const emptyData: Record<string, string> = {};
      const res = await fetch(`http://127.0.0.1:5000/api/v1/sheets/${sheet._id}/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: emptyData }),
      });
      if (res.ok) {
        const newRow = await res.json();
        setRowData([...rowData, { ...newRow.data, _rowId: newRow._id }]);
      }
    } catch (e) {
      console.error("Error adding row", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddColumn = async (newCol: any) => {
    setIsSaving(true);
    try {
      const updatedColumns = [...(sheet.columns || []), newCol];
      
      const res = await fetch(`http://127.0.0.1:5000/api/v1/sheets/${sheet._id}/columns`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedColumns),
      });
      
      if (res.ok) {
        updateColumnsFromSchema(updatedColumns);
        setShowAddColumn(false);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'schema_update',
            columns: updatedColumns
          }));
        }
      }
    } catch (e) {
      console.error("Error adding column", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col relative bg-[#0A0A0A]">
      <style>{`
        .ulmind-sheets-theme {
          --ag-background-color: #0A0A0A;
          --ag-header-background-color: #161616;
          --ag-odd-row-background-color: #0E0E0E;
          --ag-border-color: #262626;
          --ag-row-border-color: #262626;
          --ag-header-column-separator-color: #333333;
          --ag-font-family: 'Inter', system-ui, -apple-system, sans-serif;
          --ag-font-size: 13px;
          --ag-row-hover-color: rgba(255, 255, 255, 0.03);
          --ag-selected-row-background-color: rgba(99, 102, 241, 0.08);
          --ag-cell-horizontal-padding: 12px;
          --ag-header-foreground-color: #9CA3AF;
          --ag-data-color: #F3F4F6;
          --ag-range-selection-border-color: #818CF8;
          --ag-range-selection-border-style: solid;
        }
        .ulmind-sheets-theme .ag-header {
          border-bottom: 1px solid #333333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .ulmind-sheets-theme .ag-header-cell-label {
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ulmind-sheets-theme .ag-cell {
          border-right: 1px solid #262626;
          border-bottom: 1px solid #262626;
          display: flex;
          align-items: center;
          transition: background-color 0.15s ease;
        }
        /* Active Cell Blue Outline - Ultra Premium */
        .ulmind-sheets-theme .ag-cell:focus {
          border: 2px solid #818CF8 !important;
          box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.2), 0 0 0 2px rgba(129, 140, 248, 0.1) !important;
          outline: none;
          z-index: 99;
          background-color: rgba(129, 140, 248, 0.05);
        }
        .ulmind-sheets-theme .ag-ltr .ag-cell {
          border-right: 1px solid #262626;
        }
        /* Hide AG Grid Enterprise Watermark */
        .ag-watermark {
          display: none !important;
          opacity: 0 !important;
        }
      `}</style>
      
      {/* Grid Container */}
      <div className="flex-1 w-full ag-theme-quartz-dark ulmind-sheets-theme">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          onCellFocused={onCellFocused}
          animateRows={false}
          cellSelection={true}
          rowSelection={{ mode: 'multiRow', enableClickSelection: false }}
          theme="legacy"
          rowHeight={36}
          headerHeight={40}
          getRowId={(params) => params.data._rowId}
        />
      </div>

      {/* Footer Add Row / Status */}
      <div className="h-12 border-t border-white/[0.08] bg-[#0A0A0A] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors group"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 group-hover:bg-white/10 transition-colors">
              <Plus size={12} />
            </div>
            Add New Row
          </button>
          
          <button
            onClick={() => setShowAddColumn(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors group"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 group-hover:bg-white/10 transition-colors">
              <Columns size={12} />
            </div>
            Add Column
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          {isSaving ? (
            <span className="flex items-center gap-1 text-indigo-400"><RotateCw size={10} className="animate-spin" /> Saving...</span>
          ) : (
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> All changes saved</span>
          )}
          <span className="px-2">|</span>
          <span>{rowData.length} records</span>
        </div>
      </div>

      <AddColumnModal 
        isOpen={showAddColumn} 
        onClose={() => setShowAddColumn(false)} 
        onAdd={handleAddColumn} 
      />
    </div>
  );
});
