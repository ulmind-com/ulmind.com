import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
}

export function AdminTable<T extends { _id?: string; id?: string }>({ 
  columns, 
  data, 
  searchable = true, 
  searchPlaceholder = "Search...", 
  pageSize = 10 
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(row).some(val => 
      val && String(val).toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Helper to get nested object values
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="admin-glass-panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Table Header / Toolbar */}
      {searchable && (
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={16} color="#64748b" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "8px 16px 8px 36px", color: "#fff", outline: "none", fontSize: 14
              }}
            />
          </div>
        </div>
      )}

      {/* Table Body */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(15, 23, 42, 0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: "16px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <motion.tr 
                  key={row._id || row.id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}
                  className="hover:bg-white/5 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: "16px", fontSize: 14, color: "#cbd5e1" }}>
                      {col.render ? col.render(row) : (getNestedValue(row, col.key) || "—")}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.4)" }}>
        <span style={{ fontSize: 13, color: "#64748b" }}>
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button 
            disabled={safePage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: safePage === 1 ? "#475569" : "#fff", cursor: safePage === 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 600, padding: "0 8px" }}>
            Page {safePage} of {totalPages}
          </span>
          <button 
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: safePage === totalPages ? "#475569" : "#fff", cursor: safePage === totalPages ? "not-allowed" : "pointer" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
