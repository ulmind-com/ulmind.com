/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — KPI Card
   Animated stat card with gradient icon background
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: number; direction: "up" | "down" };
  delay?: number;
  format?: "number" | "time" | "text";
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  gradient,
  trend,
  delay = 0,
  format = "number",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Animate number counting up
  useEffect(() => {
    if (!visible || format !== "number" || typeof value !== "number") return;

    const duration = 1200;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [visible, value, format]);

  const formatValue = () => {
    if (format === "text" || typeof value === "string") return value;
    if (format === "time") {
      const mins = Math.floor((value as number) / 60);
      const secs = (value as number) % 60;
      return `${mins}m ${secs}s`;
    }
    return displayValue.toLocaleString();
  };

  return (
    <div
      className="admin-card kpi-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: gradient,
          opacity: 0.06,
          filter: "blur(30px)",
        }}
      />

      <div className="kpi-icon" style={{ background: gradient }}>
        {icon}
      </div>

      <div className="kpi-value" style={{ color: "var(--admin-text)" }}>
        {formatValue()}
      </div>

      <div className="kpi-label">{label}</div>

      {trend && (
        <span className={`kpi-trend ${trend.direction}`}>
          {trend.direction === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {trend.value}%
        </span>
      )}
    </div>
  );
};

export default KpiCard;
