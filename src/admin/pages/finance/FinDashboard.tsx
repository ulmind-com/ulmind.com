import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Wallet, RefreshCw, Loader2,
  ArrowUpRight, ArrowDownRight, Clock, Zap, FileSpreadsheet,
  IndianRupee, PieChart, Activity, Eye, BarChart3,
  CircleDot
} from "lucide-react";
import { getBaseUrl } from "../../lib/api";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMATED COUNTER — counts up from 0 to target value
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const AnimatedCounter: React.FC<{ value: number; duration?: number; prefix?: string }> = ({
  value, duration = 1800, prefix = "₹"
}) => {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const startVal = prevRef.current;
    const diff = value - startVal;
    if (diff === 0) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + diff * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
      else prevRef.current = value;
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  const formatted = Math.abs(display).toLocaleString("en-IN");
  return (
    <span>{prefix}{display < 0 ? `-${formatted}` : formatted}</span>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PULSE DOT — live indicator
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PulseDot: React.FC<{ color?: string }> = ({ color = "#10b981" }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
    <span style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: color, opacity: 0.5,
      animation: "fcc-pulse 1.8s ease-in-out infinite",
    }} />
    <span style={{
      position: "relative", width: 10, height: 10, borderRadius: "50%",
      background: color,
    }} />
  </span>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SPARKLINE — tiny inline chart
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data, color, width = 200, height = 36
}) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HELPERS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const AMOUNT_KEYWORDS = ["amount", "total", "price", "cost", "profit", "revenue", "income", "payment", "salary", "charge", "fee", "budget", "value", "earning", "net_income", "received"];
const SKIP_KEYWORDS = ["mode", "status", "type", "method", "category", "name", "invoice", "approval", "vendor", "shop", "spender"];
const DATE_KEYWORDS = ["date", "created", "timestamp", "day", "month"];

function isAmountField(field: string): boolean {
  const lower = field.toLowerCase();
  // Skip fields that contain disqualifying words (e.g., payment_mode, approval_status)
  if (SKIP_KEYWORDS.some(k => lower.includes(k))) return false;
  return AMOUNT_KEYWORDS.some(k => lower.includes(k));
}

function isDateField(field: string): boolean {
  const lower = field.toLowerCase();
  return DATE_KEYWORDS.some(k => lower.includes(k));
}

function parseAmount(val: any): number {
  if (val === null || val === undefined || val === "") return 0;
  const str = String(val).replace(/[₹,\s]/g, "").trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function parseDate(val: any): Date | null {
  if (!val) return null;
  const str = String(val).trim();
  const ddmm = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (ddmm) {
    const [, d, m, y] = ddmm;
    const year = y.length === 2 ? 2000 + parseInt(y) : parseInt(y);
    return new Date(year, parseInt(m) - 1, parseInt(d));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface SheetData {
  id: string;
  name: string;
  type: "profit" | "cost";
  total: number;
  rowCount: number;
  amountField: string;
  monthlyData: Record<string, number>;
  recentEntries: any[];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN DASHBOARD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const FinDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [sheetsData, setSheetsData] = useState<SheetData[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<any>(null);

  const BASE = getBaseUrl();

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      // 1. Fetch all sheets
      const sheetsRes = await fetch(`${BASE}/sheets/`);
      if (!sheetsRes.ok) throw new Error("Failed to fetch sheets");
      const allSheets: any[] = await sheetsRes.json();

      // 2. Classify sheets by name
      const classified: { sheet: any; type: "profit" | "cost" }[] = [];
      for (const s of allSheets) {
        const lower = (s.name || "").toLowerCase();
        if (lower.includes("profit")) {
          classified.push({ sheet: s, type: "profit" });
        } else if (lower.includes("cost") || lower.includes("expense")) {
          classified.push({ sheet: s, type: "cost" });
        }
      }

      // 3. Fetch rows for each classified sheet
      const results: SheetData[] = [];
      for (const { sheet, type } of classified) {
        try {
          const rowsRes = await fetch(`${BASE}/sheets/${sheet._id}/rows`);
          if (!rowsRes.ok) continue;
          const rows: any[] = await rowsRes.json();

          // Auto-detect amount column
          const columns = sheet.columns || [];
          let amountField = "";

          // First: try to find column with amount keywords
          for (const col of columns) {
            if (isAmountField(col.field) || isAmountField(col.headerName || "")) {
              amountField = col.field;
              break;
            }
          }

          // Fallback: find the column that has the most numeric values
          if (!amountField && columns.length > 0) {
            let bestCol = "";
            let bestNumericCount = 0;
            for (const col of columns) {
              if (isDateField(col.field)) continue;
              const field = col.field;
              let numCount = 0;
              for (const row of rows.slice(0, 20)) {
                const val = row.data?.[field];
                if (val !== undefined && val !== "" && !isNaN(parseFloat(String(val).replace(/[₹,\s]/g, "")))) {
                  numCount++;
                }
              }
              if (numCount > bestNumericCount) {
                bestNumericCount = numCount;
                bestCol = field;
              }
            }
            amountField = bestCol;
          }

          // Auto-detect date column
          let dateField = "";
          for (const col of columns) {
            if (isDateField(col.field) || isDateField(col.headerName || "")) {
              dateField = col.field;
              break;
            }
          }

          // Calculate total and monthly breakdown
          let total = 0;
          const monthlyData: Record<string, number> = {};
          const recentEntries: any[] = [];

          for (const row of rows) {
            const amount = parseAmount(row.data?.[amountField]);
            total += amount;

            // Monthly grouping
            if (dateField && row.data?.[dateField]) {
              const date = parseDate(row.data[dateField]);
              if (date) {
                const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
                monthlyData[key] = (monthlyData[key] || 0) + amount;
              }
            }

            // Collect recent entries
            const descField = columns.find((c: any) =>
              !isAmountField(c.field) && !isDateField(c.field) && c.field !== "sl_no" && c.field !== "sl no" && c.field.toLowerCase() !== "sl_no"
            )?.field;

            recentEntries.push({
              amount,
              date: row.data?.[dateField] || "",
              description: row.data?.[descField || ""] || row.data?.[columns[1]?.field] || "",
              detail: row.data?.[columns[columns.length > 3 ? 3 : columns.length - 1]?.field] || "",
            });
          }

          results.push({
            id: sheet._id,
            name: sheet.name,
            type,
            total,
            rowCount: rows.length,
            amountField: columns.find((c: any) => c.field === amountField)?.headerName || amountField,
            monthlyData,
            recentEntries: recentEntries.slice(-10).reverse(),
          });
        } catch {
          // Skip individual sheet errors
        }
      }

      setSheetsData(results);
      const profitTotal = results.filter(s => s.type === "profit").reduce((a, b) => a + b.total, 0);
      const costTotal = results.filter(s => s.type === "cost").reduce((a, b) => a + b.total, 0);
      setTotalProfit(profitTotal);
      setTotalCost(costTotal);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [BASE]);

  // Initial fetch
  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  // Auto-refresh polling
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchDashboardData(true), 30000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchDashboardData]);

  const balance = totalProfit - totalCost;
  const profitMargin = totalProfit > 0 ? ((balance / totalProfit) * 100).toFixed(1) : "0.0";

  // Monthly data aggregation for chart
  const allMonths = new Set<string>();
  sheetsData.forEach(s => Object.keys(s.monthlyData).forEach(m => allMonths.add(m)));
  const sortedMonths = Array.from(allMonths).sort((a, b) => {
    const [am, ay] = a.split(" ");
    const [bm, by] = b.split(" ");
    const aDate = new Date(parseInt(ay), MONTH_NAMES.indexOf(am));
    const bDate = new Date(parseInt(by), MONTH_NAMES.indexOf(bm));
    return aDate.getTime() - bDate.getTime();
  });

  const monthlyProfit = sortedMonths.map(m =>
    sheetsData.filter(s => s.type === "profit").reduce((a, s) => a + (s.monthlyData[m] || 0), 0)
  );
  const monthlyCost = sortedMonths.map(m =>
    sheetsData.filter(s => s.type === "cost").reduce((a, s) => a + (s.monthlyData[m] || 0), 0)
  );

  // All recent transactions
  const allTransactions = sheetsData.flatMap(s =>
    s.recentEntries.map(e => ({ ...e, type: s.type, sheetName: s.name }))
  ).slice(0, 12);

  const profitSheets = sheetsData.filter(s => s.type === "profit");
  const costSheets = sheetsData.filter(s => s.type === "cost");

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "60vh", gap: 20,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} color="#6366f1" />
        </motion.div>
        <p style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Loading financial data from sheets...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <style>{`
        @keyframes fcc-pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(2); opacity: 0; } }
        .fcc-card { position: relative; overflow: hidden; border-radius: 24px; padding: 28px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .fcc-card:hover { transform: translateY(-4px); }
        .fcc-card::before { content: ''; position: absolute; inset: 0; border-radius: 24px; padding: 1px; background: var(--border-gradient); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
        .fcc-refresh-spin { animation: fcc-spin 0.8s linear infinite; }
        @keyframes fcc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fcc-transaction-row:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {/* ═══════ HEADER ═══════ */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 32, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h2 style={{
              fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em",
              fontFamily: "'Outfit', 'Inter', sans-serif",
            }}>
              Financial Command Center
            </h2>
            <PulseDot color="#10b981" />
          </div>
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>
            Auto-synced with your database sheets &bull; {sheetsData.length} sheet{sheetsData.length !== 1 ? "s" : ""} connected
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastRefreshed && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 12,
              color: "#64748b", fontWeight: 500,
            }}>
              <Clock size={13} />
              {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          )}

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 12, border: "none",
              background: autoRefresh ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.05)",
              color: autoRefresh ? "#10b981" : "#64748b",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Zap size={14} />
            {autoRefresh ? "Auto-sync ON" : "Auto-sync OFF"}
          </button>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 12, border: "none",
              background: "rgba(99, 102, 241, 0.1)",
              color: "#818cf8",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "fcc-refresh-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ═══════ ERROR BANNER ═══════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: "14px 20px", borderRadius: 16, marginBottom: 24,
              background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#fca5a5", fontSize: 13, fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ KPI CARDS ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 28 }}>

        {/* TOTAL PROFIT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="fcc-card"
          style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 46, 22, 0.15) 100%)",
            "--border-gradient": "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.05))",
            boxShadow: "0 8px 40px rgba(16, 185, 129, 0.08)",
          } as any}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
            }}>
              <TrendingUp size={22} color="#fff" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(16, 185, 129, 0.15)" }}>
              <ArrowUpRight size={14} color="#10b981" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Profit</span>
            </div>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Total Profit
          </p>
          <h3 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            <AnimatedCounter value={totalProfit} />
          </h3>
          <div style={{ marginTop: 14 }}>
            <Sparkline data={monthlyProfit.length ? monthlyProfit : [0]} color="#10b981" />
          </div>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
            From {profitSheets.length} sheet{profitSheets.length !== 1 ? "s" : ""} &bull; {profitSheets.reduce((a, b) => a + b.rowCount, 0)} entries
          </p>
        </motion.div>

        {/* TOTAL COST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fcc-card"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(68, 10, 10, 0.15) 100%)",
            "--border-gradient": "linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.05))",
            boxShadow: "0 8px 40px rgba(239, 68, 68, 0.08)",
          } as any}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
            }}>
              <TrendingDown size={22} color="#fff" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(239, 68, 68, 0.15)" }}>
              <ArrowDownRight size={14} color="#ef4444" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>Cost</span>
            </div>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Total Cost
          </p>
          <h3 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            <AnimatedCounter value={totalCost} />
          </h3>
          <div style={{ marginTop: 14 }}>
            <Sparkline data={monthlyCost.length ? monthlyCost : [0]} color="#ef4444" />
          </div>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
            From {costSheets.length} sheet{costSheets.length !== 1 ? "s" : ""} &bull; {costSheets.reduce((a, b) => a + b.rowCount, 0)} entries
          </p>
        </motion.div>

        {/* REMAINING BALANCE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fcc-card"
          style={{
            background: balance >= 0
              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(30, 14, 68, 0.15) 100%)"
              : "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(68, 30, 10, 0.15) 100%)",
            "--border-gradient": balance >= 0
              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.05))"
              : "linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.05))",
            boxShadow: balance >= 0 ? "0 8px 40px rgba(99, 102, 241, 0.08)" : "0 8px 40px rgba(249, 115, 22, 0.08)",
          } as any}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: balance >= 0
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: balance >= 0 ? "0 8px 24px rgba(99, 102, 241, 0.3)" : "0 8px 24px rgba(249, 115, 22, 0.3)",
            }}>
              <Wallet size={22} color="#fff" />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20,
              background: balance >= 0 ? "rgba(99, 102, 241, 0.15)" : "rgba(249, 115, 22, 0.15)",
            }}>
              {balance >= 0 ? <ArrowUpRight size={14} color="#818cf8" /> : <ArrowDownRight size={14} color="#f97316" />}
              <span style={{ fontSize: 12, fontWeight: 700, color: balance >= 0 ? "#818cf8" : "#f97316" }}>{profitMargin}%</span>
            </div>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Remaining Balance
          </p>
          <h3 style={{
            fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em",
            fontFamily: "'Outfit', 'Inter', sans-serif",
            color: balance >= 0 ? "#a5b4fc" : "#fdba74",
          }}>
            <AnimatedCounter value={balance} />
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginTop: 14,
            fontSize: 12, color: "#64748b", fontWeight: 500,
          }}>
            <Activity size={14} />
            <span>Profit {balance >= 0 ? "exceeds" : "is less than"} costs by <strong style={{ color: "#fff" }}>{Math.abs(parseFloat(profitMargin))}%</strong></span>
          </div>
        </motion.div>
      </div>

      {/* ═══════ MONTHLY TREND BAR CHART + SHEET BREAKDOWN ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: sortedMonths.length ? "2fr 1fr" : "1fr", gap: 20, marginBottom: 28 }}>

        {/* Monthly Trend */}
        {sortedMonths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="admin-glass-panel" style={{ padding: 28 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <BarChart3 size={18} color="#818cf8" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Monthly Trend</h3>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: "#10b981" }} />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Profit</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: "#ef4444" }} />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Cost</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, paddingBottom: 30, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, bottom: 28, top: 0, width: 1, background: "rgba(255,255,255,0.05)" }} />
              {sortedMonths.map((month, i) => {
                const pVal = monthlyProfit[i] || 0;
                const cVal = monthlyCost[i] || 0;
                const maxVal = Math.max(...monthlyProfit, ...monthlyCost, 1);
                const pHeight = (pVal / maxVal) * 140;
                const cHeight = (cVal / maxVal) * 140;
                return (
                  <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 140 }}>
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: pHeight }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                        style={{
                          width: 16, borderRadius: "6px 6px 2px 2px",
                          background: "linear-gradient(to top, #059669, #10b981)",
                          boxShadow: "0 0 12px rgba(16, 185, 129, 0.2)",
                        }}
                        title={`Profit: ₹${pVal.toLocaleString("en-IN")}`}
                      />
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: cHeight }}
                        transition={{ delay: 0.5 + i * 0.05 + 0.1, duration: 0.6, ease: "easeOut" }}
                        style={{
                          width: 16, borderRadius: "6px 6px 2px 2px",
                          background: "linear-gradient(to top, #dc2626, #ef4444)",
                          boxShadow: "0 0 12px rgba(239, 68, 68, 0.2)",
                        }}
                        title={`Cost: ₹${cVal.toLocaleString("en-IN")}`}
                      />
                    </div>
                    <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginTop: 4 }}>{month.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Sheet Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="admin-glass-panel" style={{ padding: 28 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <PieChart size={18} color="#a78bfa" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Connected Sheets</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sheetsData.length === 0 && (
              <p style={{ color: "#64748b", fontSize: 13 }}>No profit or cost sheets found. Create sheets with "Profit" or "Cost" in the name.</p>
            )}
            {sheetsData.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 16,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: s.type === "profit" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <FileSpreadsheet size={16} color={s.type === "profit" ? "#10b981" : "#ef4444"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b" }}>
                    {s.rowCount} rows &bull; {s.amountField || "auto-detected"}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 700,
                    color: s.type === "profit" ? "#10b981" : "#ef4444",
                  }}>
                    ₹{s.total.toLocaleString("en-IN")}
                  </p>
                  <span style={{
                    fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: s.type === "profit" ? "#10b981" : "#ef4444",
                    opacity: 0.7,
                  }}>
                    {s.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════ RECENT TRANSACTIONS ═══════ */}
      {allTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="admin-glass-panel" style={{ padding: 28 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IndianRupee size={18} color="#fbbf24" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Recent Transactions</h3>
            </div>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
              Latest from all sheets
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "44px 1fr 1fr 120px 100px",
              gap: 14, padding: "8px 18px",
              fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              <span></span>
              <span>Description</span>
              <span>Sheet</span>
              <span>Date</span>
              <span style={{ textAlign: "right" }}>Amount</span>
            </div>

            {allTransactions.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.03 }}
                className="fcc-transaction-row"
                style={{
                  display: "grid", gridTemplateColumns: "44px 1fr 1fr 120px 100px",
                  gap: 14, alignItems: "center",
                  padding: "14px 18px", borderRadius: 16,
                  transition: "background 0.2s ease", cursor: "default",
                  borderBottom: i < allTransactions.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: tx.type === "profit" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {tx.type === "profit"
                    ? <ArrowUpRight size={16} color="#10b981" />
                    : <ArrowDownRight size={16} color="#ef4444" />
                  }
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tx.description || tx.detail || "—"}
                  </p>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tx.sheetName}
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                  {tx.date || "—"}
                </p>
                <p style={{
                  fontSize: 14, fontWeight: 700, textAlign: "right",
                  color: tx.type === "profit" ? "#10b981" : "#ef4444",
                }}>
                  {tx.type === "profit" ? "+" : "−"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════ EMPTY STATE ═══════ */}
      {sheetsData.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="admin-glass-panel"
          style={{
            padding: 60, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center",
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: "rgba(99, 102, 241, 0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <FileSpreadsheet size={36} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            No Financial Sheets Found
          </h3>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 420, lineHeight: 1.6 }}>
            Create sheets in the <strong style={{ color: "#94a3b8" }}>Database</strong> section with
            <strong style={{ color: "#10b981" }}> "Profit"</strong> or
            <strong style={{ color: "#ef4444" }}> "Cost"</strong> in the name.
            The dashboard will automatically detect and aggregate your financial data.
          </p>
        </motion.div>
      )}

      {/* ═══════ FOOTER INFO ═══════ */}
      <div style={{
        marginTop: 28, padding: "16px 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#475569" }}>
          <Eye size={13} />
          <span>Data sourced from Database sheets &bull; Auto-refreshes every 30s</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#475569" }}>
          <CircleDot size={12} color={autoRefresh ? "#10b981" : "#64748b"} />
          <span>{autoRefresh ? "Live" : "Paused"}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FinDashboard;
