import { HyperFormula } from "hyperformula";

import React, { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllEnterpriseModule, ModuleRegistry, ColDef, CellClassParams } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Settings, Plus, RotateCw, CheckCircle2, Columns, Minus } from 'lucide-react';
import { AddColumnModal } from './AddColumnModal';
import { getBaseUrl, getWsBaseUrl } from '../../lib/api';

// Suppress AG Grid Enterprise License console errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (args.length > 0 && typeof args[0] === 'string' && (args[0].includes('AG Grid Enterprise') || args[0].includes('License Key Not Found') || args[0].includes('trial license key') || args[0].includes('All AG Grid Enterprise features are unlocked'))) {
    return; // Ignore AG Grid Enterprise license errors
  }
  originalConsoleError.apply(console, args as any);
};

ModuleRegistry.registerModules([AllEnterpriseModule]);

export interface SpreadsheetGridHandle {
  applyFormat: (format: string, value: any) => void;
  updateCellValue: (rowId: string, colId: string, value: string) => void;
  undo: () => void;
  redo: () => void;
  copy: () => void;
  paste: () => void;
  exportToCsv: () => void;
  setZoom: (zoom: number) => void;
  insertFunction: (funcName: string) => void;
  performAction: (action: string) => void;
  toggleFilter: () => void;
  protectRange: () => void;
  sortSheet: (order: 'asc' | 'desc') => void;
  applyDataValidation: (validationRule: any) => void;
  performPrint: (settings: any) => void;
}

interface SpreadsheetGridProps {
  sheet: any;
  onCellSelect?: (cell: { rowId: string, colId: string, value: string, styles: any }) => void;
  onSheetUpdate?: (sheet: any) => void;
}

export const SpreadsheetGrid = forwardRef<SpreadsheetGridHandle, SpreadsheetGridProps>(
  ({ sheet, onCellSelect, onSheetUpdate }, ref) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const gridRef = useRef<AgGridReact>(null);
    const wsRef = useRef<WebSocket | null>(null);

  // WebSocket Connection
  useEffect(() => {
    if (!sheet?._id) return;
    
    const ws = new WebSocket(`${getWsBaseUrl()}/${sheet._id}`);
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

  const hfInstance = useRef<HyperFormula | null>(null);

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
      ...columns.map((c: any, i: number) => ({
        field: c.field,
        headerName: c.headerName,
        editable: (params: any) => {
          if (c.editable === false) return false;
          if (params.data?._styles?.[c.field]?.protected) return false;
          return true;
        },
        colSpan: (params: any) => params.data?._styles?.[c.field]?.colSpan || 1,
        rowSpan: (params: any) => params.data?._styles?.[c.field]?.rowSpan || 1,
        width: c.width || 200,
        hfColIndex: i, // Store hyperformula column index
        valueGetter: (params: any) => {
          return params.data?.[c.field];
        },
        valueSetter: (params: any) => {
          const newVal = params.newValue;
          params.data[c.field] = newVal;
          if (hfInstance.current && params.node.rowIndex !== null) {
            hfInstance.current.setCellContents({ sheet: 0, col: i, row: params.node.rowIndex }, [[newVal]]);
            setTimeout(() => params.api.refreshCells(), 0);
          }
          return true;
        },
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
      const res = await fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows`);
      if (res.ok) {
        const data = await res.json();
        const flatData = data.map((d: any) => ({ ...d.data, _rowId: d._id, _styles: d.styles || {} }));
        setRowData(flatData);

        // Initialize HyperFormula
        const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
        hf.addSheet('Sheet1');
        
        const hfData = flatData.map((row: any) => {
          if (!sheet.columns) return [];
          return sheet.columns.map((c: any) => row[c.field] || '');
        });
        
        hf.setCellContents({ sheet: 0, col: 0, row: 0 }, hfData);
        hfInstance.current = hf;
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
    minWidth: 100,
    valueFormatter: (params) => {
      const rowStyles = params.data?._styles || {};
      const colStyle = rowStyles[params.colDef.field!] || {};
      const format = colStyle.numberFormat;
      let val = params.value;
      
      // Compute HyperFormula value if it's a formula
      if (typeof val === 'string' && val.startsWith('=') && hfInstance.current && params.node?.rowIndex !== null && params.node?.rowIndex !== undefined) {
         try {
            const hfColIndex = params.colDef.hfColIndex;
            if (hfColIndex !== undefined) {
               const computed = hfInstance.current.getCellValue({ sheet: 0, col: hfColIndex, row: params.node.rowIndex });
               if (computed !== undefined && computed !== null && typeof computed !== 'object') {
                  val = computed;
               }
            }
         } catch (e) {}
      }

      if (val === undefined || val === null || val === '') return '';
      if (typeof val === 'string' && isNaN(Number(val))) return val;
      const num = Number(val);
      
      const isDateColumn = params.colDef.field?.toLowerCase().includes('date') || params.colDef.headerName?.toLowerCase().includes('date');
      const isExcelDateRange = num > 30000 && num < 80000;
      const effectiveFormat = format || (isDateColumn && isExcelDateRange ? 'date' : null);

      if (effectiveFormat === 'date' || effectiveFormat === 'datetime' || effectiveFormat === 'time') {
        const date = new Date(Math.round((num - 25569) * 86400 * 1000));
        if (effectiveFormat === 'date') return date.toLocaleDateString('en-GB');
        if (effectiveFormat === 'datetime') return date.toLocaleString('en-GB');
        if (effectiveFormat === 'time') return date.toLocaleTimeString('en-GB');
      }

      const decimals = colStyle.decimals !== undefined ? colStyle.decimals : (effectiveFormat ? 2 : 0);
      if (effectiveFormat === 'currency') return `£${num.toFixed(decimals)}`;
      if (effectiveFormat === 'percent') return `${(num * 100).toFixed(decimals)}%`;
      if (effectiveFormat === 'accounting') return `£ ${num.toFixed(decimals)}`;
      if (effectiveFormat === 'financial') return `${num.toFixed(decimals)}`;
      if (effectiveFormat === 'number' || colStyle.decimals !== undefined) return num.toFixed(decimals);
      return val;
    },
    cellStyle: (params) => {
      const rowStyles = params.data?._styles || {};
      const colStyle = rowStyles[params.colDef.field!] || {};
      
      const borderColor = colStyle.borderColor || 'rgba(255,255,255,0.3)';
      const borderConfig = `1px solid ${borderColor}`;
      
      let borderStyle: any = {};
      if (colStyle.border === 'all') borderStyle = { border: borderConfig };
      else if (colStyle.border === 'outer') borderStyle = { border: borderConfig }; 
      else if (colStyle.border === 'inner') borderStyle = { border: borderConfig }; 
      else if (colStyle.border === 'horizontal') borderStyle = { borderTop: borderConfig, borderBottom: borderConfig };
      else if (colStyle.border === 'vertical') borderStyle = { borderLeft: borderConfig, borderRight: borderConfig };
      else if (colStyle.border === 'left') borderStyle = { borderLeft: borderConfig };
      else if (colStyle.border === 'right') borderStyle = { borderRight: borderConfig };
      else if (colStyle.border === 'top') borderStyle = { borderTop: borderConfig };
      else if (colStyle.border === 'bottom') borderStyle = { borderBottom: borderConfig };
      else if (colStyle.border === 'none') borderStyle = { border: 'none' };

      let transformStyle = '';
      if (colStyle.textRotation === 'tilt-up') transformStyle = 'rotate(-45deg)';
      else if (colStyle.textRotation === 'tilt-down') transformStyle = 'rotate(45deg)';
      else if (colStyle.textRotation === 'rotate-up') transformStyle = 'rotate(-90deg)';
      else if (colStyle.textRotation === 'rotate-down') transformStyle = 'rotate(90deg)';

      let displayStyle = 'flex';
      let alignItems = 'center';
      if (colStyle.verticalAlign === 'top') alignItems = 'flex-start';
      else if (colStyle.verticalAlign === 'bottom') alignItems = 'flex-end';
      
      return {
        ...borderStyle,
        fontWeight: colStyle.bold ? 'bold' : 'normal',
        fontStyle: colStyle.italic ? 'italic' : 'normal',
        textDecoration: [
          colStyle.strikethrough ? 'line-through' : '',
          colStyle.underline ? 'underline' : ''
        ].filter(Boolean).join(' ') || 'none',
        color: colStyle.color || undefined,
        backgroundColor: colStyle.backgroundColor || undefined,
        textAlign: colStyle.align || undefined,
        fontFamily: colStyle.fontFamily || undefined,
        fontSize: colStyle.fontSize ? `${colStyle.fontSize}px` : undefined,
        transform: transformStyle || undefined,
        display: displayStyle,
        alignItems: alignItems,
        whiteSpace: colStyle.wrapText === 'wrap' ? 'normal' : (colStyle.wrapText === 'clip' ? 'nowrap' : 'pre'),
        overflow: colStyle.wrapText === 'clip' ? 'hidden' : 'visible'
      };
    }
  }), [zoomLevel]);

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
        await fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows/${rowId}`, {
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

  const onColumnResized = async (event: any) => {
    if (event.finished && sheet?.columns) {
      const resizedCols = event.columns || (event.column ? [event.column] : []);
      if (resizedCols.length === 0) return;
      
      let updated = false;
      const updatedColumns = sheet.columns.map((col: any) => {
        const resizedCol = resizedCols.find((c: any) => c.getColId() === col.field);
        if (resizedCol) {
          const newWidth = Math.round(resizedCol.getActualWidth());
          if (col.width !== newWidth) {
            updated = true;
            return { ...col, width: newWidth };
          }
        }
        return col;
      });

      if (updated) {
        setIsSaving(true);
        try {
          const res = await fetch(`${getBaseUrl()}/sheets/${sheet._id}/columns`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedColumns),
          });
          if (res.ok) {
            if (onSheetUpdate) {
              onSheetUpdate({ ...sheet, columns: updatedColumns });
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'schema_update',
                columns: updatedColumns
              }));
            }
          }
        } catch (e) {
          console.error("Error saving column width", e);
        } finally {
          setIsSaving(false);
        }
      }
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
        
        range.columns.forEach((col, colIndex) => {
          const colId = col.getColId();
          if (!currentStyles[colId]) currentStyles[colId] = {};
          
          if (format === 'merge') {
            if (value === null) {
              delete currentStyles[colId].colSpan;
              delete currentStyles[colId].rowSpan;
            } else {
              const isTopLeft = i === startRow && colIndex === 0;
              if (isTopLeft) {
                if (value === 'all') {
                  currentStyles[colId].colSpan = range.columns.length;
                  currentStyles[colId].rowSpan = endRow - startRow + 1;
                } else if (value === 'horizontal') {
                  currentStyles[colId].colSpan = range.columns.length;
                  currentStyles[colId].rowSpan = 1;
                } else if (value === 'vertical') {
                  currentStyles[colId].colSpan = 1;
                  currentStyles[colId].rowSpan = endRow - startRow + 1;
                }
              } else {
                // Not top left, maybe we should clear spans or mark as spanned
                delete currentStyles[colId].colSpan;
                delete currentStyles[colId].rowSpan;
              }
            }
          } else {
            if (value === null || value === undefined || value === false) {
              delete currentStyles[colId][format];
            } else {
              currentStyles[colId][format] = value;
            }
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
          fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows/${rowId}`, {
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
    },
    updateCellValue: (rowId: string, colId: string, value: string) => {
      const rowNode = gridRef.current?.api.getRowNode(rowId);
      if (rowNode) {
        rowNode.setDataValue(colId, value);
      }
    },
    undo: () => {
      gridRef.current?.api.undoCellEditing();
    },
    redo: () => {
      gridRef.current?.api.redoCellEditing();
    },
    copy: () => {
      gridRef.current?.api.copySelectedRangeToClipboard();
    },
    paste: () => {
      gridRef.current?.api.pasteFromClipboard();
    },
    exportToCsv: () => {
      gridRef.current?.api.exportDataAsCsv();
    },
    setZoom: (zoom: number) => {
      setZoomLevel(zoom);
    },
    insertFunction: (funcName: string) => {
      const selectedCells = gridRef.current?.api.getCellRanges();
      if (!selectedCells || selectedCells.length === 0) return;
      const range = selectedCells[0];
      const startRow = Math.min(range.startRow!.rowIndex, range.endRow!.rowIndex);
      const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(startRow);
      if (rowNode) {
        const colId = range.columns[0].getColId();
        rowNode.setDataValue(colId, `=${funcName}()`);
        gridRef.current?.api.startEditingCell({ rowIndex: startRow, colKey: colId });
      }
    },
    performPrint: (settings: any) => {
      if (!gridRef.current?.api) return;
      
      const api = gridRef.current.api;
      
      // 1. Calculate optimal scale for Fit to Width
      let scale = 1;
      if (settings.scale === 'fit_width' || settings.scale === 'fit_page') {
         let totalGridWidth = 0;
         const allColumns = api.getAllDisplayedColumns();
         if (allColumns) {
           allColumns.forEach((col: any) => {
             totalGridWidth += col.getActualWidth();
           });
         }
         
         // Base paper width in pixels (~96 DPI)
         let pageWidth = 1122; // default A4 Landscape
         if (settings.paperSize === 'A4') pageWidth = settings.orientation === 'landscape' ? 1122 : 794;
         if (settings.paperSize === 'A3') pageWidth = settings.orientation === 'landscape' ? 1587 : 1122;
         if (settings.paperSize === 'Letter') pageWidth = settings.orientation === 'landscape' ? 1056 : 816;
         if (settings.paperSize === 'Legal') pageWidth = settings.orientation === 'landscape' ? 1344 : 816;
         
         // Subtract margins
         if (settings.margin === 'normal') pageWidth -= 80;
         if (settings.margin === 'wide') pageWidth -= 160;
         if (settings.margin === 'narrow') pageWidth -= 40;
         
         if (totalGridWidth > pageWidth && totalGridWidth > 0) {
           scale = pageWidth / totalGridWidth;
         }
      } else if (settings.scale === 'normal') {
        scale = 1; // 100%
      }
      
      // 2. Inject Dynamic Print Stylesheet
      const styleId = 'dynamic-print-style';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      let paperCSS = settings.paperSize === 'Letter' || settings.paperSize === 'Legal' 
                     ? settings.paperSize 
                     : settings.paperSize.toLowerCase();
                     
      styleEl.innerHTML = `
        @media print {
          @page {
            size: ${paperCSS} ${settings.orientation};
            margin: ${settings.margin === 'narrow' ? '0.3cm' : settings.margin === 'wide' ? '2.5cm' : '1.2cm'};
          }
          
          .ulmind-sheets-theme-wrapper {
             transform: scale(${scale}) !important;
             transform-origin: top left !important;
             /* Expand width to counteract scale shrink so it fills the page */
             width: ${100 / scale}% !important;
          }
          
          ${!settings.showGridlines ? '.ag-cell, .ag-header-cell { border: none !important; }' : ''}
          ${!settings.showHeaders ? '.ag-header { display: none !important; }' : ''}
        }
      `;
      
      // 3. Prepare AG Grid for printing
      api.setGridOption('domLayout', 'print');
      
      // 4. Trigger print and cleanup
      setTimeout(() => {
        window.print();
        api.setGridOption('domLayout', 'normal');
        setTimeout(() => {
          if (document.getElementById(styleId)) {
            document.getElementById(styleId)?.remove();
          }
        }, 1000);
      }, 800);
    },
    performAction: async (action: string) => {
      if (action === 'search') gridRef.current?.api.setQuickFilter(prompt('Search grid:') || '');
      else if (action === 'undo') gridRef.current?.api.undoCellEditing();
      else if (action === 'redo') gridRef.current?.api.redoCellEditing();
      else if (action === 'print') {
        if (gridRef.current?.api) {
          gridRef.current.api.setGridOption('domLayout', 'print');
          setTimeout(() => {
            window.print();
            gridRef.current?.api.setGridOption('domLayout', 'normal');
          }, 800);
        } else {
          window.print();
        }
      }
      else if (action === 'increase_decimal' || action === 'decrease_decimal') {
        const selectedCells = gridRef.current?.api.getCellRanges();
        if (!selectedCells || selectedCells.length === 0) return;
        const range = selectedCells[0];
        const startRow = Math.min(range.startRow!.rowIndex, range.endRow!.rowIndex);
        const endRow = Math.max(range.startRow!.rowIndex, range.endRow!.rowIndex);
        setIsSaving(true);
        for (let i = startRow; i <= endRow; i++) {
          const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);
          if (!rowNode || !rowNode.data) continue;
          const currentStyles = rowNode.data._styles || {};
          range.columns.forEach(col => {
            const colId = col.getColId();
            if (!currentStyles[colId]) currentStyles[colId] = {};
            let currentDecimals = currentStyles[colId].decimals || (currentStyles[colId].numberFormat ? 2 : 0);
            if (action === 'increase_decimal') currentDecimals += 1;
            else if (action === 'decrease_decimal') currentDecimals = Math.max(0, currentDecimals - 1);
            currentStyles[colId].decimals = currentDecimals;
            // Also enforce number format if not set
            if (!currentStyles[colId].numberFormat) currentStyles[colId].numberFormat = 'number';
          });
          rowNode.setDataValue('_styles', currentStyles);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
             wsRef.current.send(JSON.stringify({ type: 'style_update', rowId: rowNode.data._rowId, styles: currentStyles }));
          }
          await fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows/${rowNode.data._rowId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ styles: currentStyles })
          });
        }
        setIsSaving(false);
        gridRef.current?.api.redrawRows();
      } else if (action === 'edit_cut') {
        gridRef.current?.api.copySelectedRangeToClipboard();
        const selectedCells = gridRef.current?.api.getCellRanges();
        if (selectedCells && selectedCells.length > 0) {
          const range = selectedCells[0];
          const startRow = Math.min(range.startRow!.rowIndex, range.endRow!.rowIndex);
          const endRow = Math.max(range.startRow!.rowIndex, range.endRow!.rowIndex);
          for (let i = startRow; i <= endRow; i++) {
            const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);
            if (!rowNode) continue;
            range.columns.forEach(col => rowNode.setDataValue(col.getColId(), ''));
          }
        }
      } else if (action === 'edit_find') {
        const query = prompt('Find:');
        if (query) gridRef.current?.api.setQuickFilter(query);
      } else if (action === 'view_freeze_rows') {
        const selectedCells = gridRef.current?.api.getCellRanges();
        if (selectedCells && selectedCells.length > 0) {
          const range = selectedCells[0];
          const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(range.startRow!.rowIndex);
          if (rowNode && rowNode.data) {
             gridRef.current?.api.updateGridOptions({ pinnedTopRowData: [rowNode.data] });
          }
        }
      } else if (action === 'view_freeze_cols') {
        const selectedCells = gridRef.current?.api.getCellRanges();
        if (selectedCells && selectedCells.length > 0) {
          const range = selectedCells[0];
          range.columns.forEach(col => {
             gridRef.current?.api.setColumnPinned(col.getColId(), 'left');
          });
        }
      } else if (action === 'insert_rows') {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent?.includes('Add New Row'));
        if (btn) btn.click();
        else alert('Please use the "Add New Row" button at the bottom.');
      } else if (action === 'insert_columns') {
         const btns = Array.from(document.querySelectorAll('button'));
         const btn = btns.find(b => b.textContent?.includes('Add Column'));
         if (btn) btn.click();
         else alert('Please use the "Add Column" button at the bottom.');
      } else {
        alert(`${action} is an advanced pro feature and will be available in future updates!`);
      }
    },
    toggleFilter: () => {
      if (!gridRef.current) return;
      const currentFilterState = gridRef.current.api.isAdvancedFilterPresent();
      // Wait AG grid advanced filter or column filters?
      // Native column filters are usually toggled via defaultColDef { filter: true }.
      // If we want to show floating filters:
      const floatingFilters = gridRef.current.api.getGridOption('floatingFiltersHeight');
      gridRef.current.api.updateGridOptions({ floatingFilter: true });
    },
    protectRange: async () => {
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
        const currentStyles = rowNode.data._styles || {};
        range.columns.forEach(col => {
          const colId = col.getColId();
          if (!currentStyles[colId]) currentStyles[colId] = {};
          currentStyles[colId].protected = !currentStyles[colId].protected; // toggle
        });
        rowNode.setDataValue('_styles', currentStyles);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'style_update', rowId: rowNode.data._rowId, styles: currentStyles }));
        }
        await fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows/${rowNode.data._rowId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ styles: currentStyles })
        });
      }
      setIsSaving(false);
      gridRef.current.api.redrawRows();
    },
    sortSheet: (order: 'asc' | 'desc') => {
      const selectedCells = gridRef.current?.api.getCellRanges();
      if (!selectedCells || selectedCells.length === 0) return;
      const colId = selectedCells[0].columns[0].getColId();
      gridRef.current?.api.applyColumnState({
        state: [{ colId: colId, sort: order }],
        defaultState: { sort: null }
      });
    },
    applyDataValidation: (validationRule: any) => {
       // handled via Modal in parent
    }
  }));

  const handleAddRow = async () => {
    setIsSaving(true);
    try {
      const emptyData: Record<string, string> = {};
      const res = await fetch(`${getBaseUrl()}/sheets/${sheet._id}/rows`, {
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
      
      const res = await fetch(`${getBaseUrl()}/sheets/${sheet._id}/columns`, {
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
        .ulmind-sheets-theme-wrapper {
          transform: scale(${zoomLevel});
          transform-origin: top left;
          width: ${100 / zoomLevel}%;
          height: ${100 / zoomLevel}%;
        }
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
      <div className="flex-1 w-full overflow-hidden relative">
        <div className="ulmind-sheets-theme-wrapper ag-theme-quartz-dark ulmind-sheets-theme absolute top-0 left-0">
          <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          onCellFocused={onCellFocused}
          onColumnResized={onColumnResized}
          animateRows={false}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          cellSelection={true}
          rowSelection={{ mode: 'multiRow', enableClickSelection: false }}
          enableFillHandle={true}
          fillHandleDirection="xy"
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          theme="legacy"
          rowHeight={36}
          headerHeight={40}
          getRowId={(params) => params.data._rowId}
        />
        </div>
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
        
        <div className="flex items-center gap-4 text-[11px] text-white/40">
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-indigo-400"><RotateCw size={10} className="animate-spin" /> Saving...</span>
            ) : (
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> All changes saved</span>
            )}
            <span className="px-2">|</span>
            <span>{rowData.length} records</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
            <button 
              onClick={() => {
                const newZoom = Math.max(0.1, zoomLevel - 0.1);
                setZoomLevel(newZoom);
              }}
              className="flex h-5 w-5 items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <Minus size={10} />
            </button>
            <input 
              type="range" 
              min="10" 
              max="200" 
              value={Math.round(zoomLevel * 100)} 
              onChange={(e) => {
                const newZoom = Number(e.target.value) / 100;
                setZoomLevel(newZoom);
              }}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              style={{ WebkitAppearance: 'none' }}
            />
            <button 
              onClick={() => {
                const newZoom = Math.min(2, zoomLevel + 0.1);
                setZoomLevel(newZoom);
              }}
              className="flex h-5 w-5 items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Zoom In"
            >
              <Plus size={10} />
            </button>
            <span 
              className="w-9 text-right font-medium cursor-pointer hover:text-white transition-colors" 
              onClick={() => {
                setZoomLevel(1);
              }}
              title="Reset Zoom to 100%"
            >
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
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
