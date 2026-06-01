/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Login Page
   Premium glassmorphism login card at /admin/login
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Shield, Eye, EyeOff, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../admin.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      if (result.mustChangePassword) {
        navigate("/admin/settings", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-root"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#030712", // Very dark sleek bg
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 1) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220, 38, 38, 1) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)"
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          padding: "0 20px",
          zIndex: 10
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            borderRadius: 32,
            padding: "48px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top glowing accent line */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2, 
              background: "linear-gradient(90deg, transparent, #ef4444, #dc2626, transparent)",
            }}
          />

          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: "linear-gradient(135deg, #ef4444, #991b1b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
                position: "relative"
              }}
            >
              <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)" }} />
              <Shield size={34} color="#fff" strokeWidth={1.5} />
            </motion.div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
              Admin Panel
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
              Secure system access
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: "rgba(225, 29, 72, 0.1)",
                  border: "1px solid rgba(225, 29, 72, 0.3)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  marginBottom: 24,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fca5a5",
                  textAlign: "center",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color={focusedField === "email" ? "#f87171" : "#64748b"} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", transition: "color 0.3s" }} />
                <input
                  type="email"
                  placeholder="admin@ulmind.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  autoFocus
                  style={{ 
                    width: "100%", paddingLeft: 46, paddingRight: 16, height: 52, 
                    background: "rgba(0,0,0,0.3)", 
                    border: focusedField === "email" ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: 16, color: "#fff", fontSize: 15,
                    outline: "none", transition: "all 0.3s",
                    boxShadow: focusedField === "email" ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color={focusedField === "password" ? "#f87171" : "#64748b"} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", transition: "color 0.3s" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  style={{ 
                    width: "100%", paddingLeft: 46, paddingRight: 46, height: 52, 
                    background: "rgba(0,0,0,0.3)", 
                    border: focusedField === "password" ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: 16, color: "#fff", fontSize: 15,
                    outline: "none", transition: "all 0.3s",
                    boxShadow: focusedField === "password" ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: showPassword ? "#f87171" : "#64748b",
                    cursor: "pointer",
                    padding: 4,
                    transition: "color 0.3s"
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 15px 35px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                marginTop: 16,
                height: 52,
                width: "100%",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.03em",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                transition: "all 0.2s",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#475569",
              marginTop: 32,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
            }}
          >
            ULMiND Internal Dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

