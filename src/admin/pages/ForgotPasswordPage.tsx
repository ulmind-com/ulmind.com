/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Forgot Password Page
   3-step flow: Enter Email → Verify OTP → Set New Password
   Matches the exact glassmorphism design of LoginPage.tsx
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  forgotPasswordAPI,
  verifyOTPAPI,
  resetPasswordAPI,
} from "../lib/api";
import "../admin.css";

// ── Types ────────────────────────────────────────────────────────
type Step = "email" | "otp" | "password";

// ── Password strength helper ─────────────────────────────────────
interface StrengthResult {
  score: number;   // 0–4
  label: string;
  color: string;
}

function getPasswordStrength(pw: string): StrengthResult {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["#334155", "#e11d48", "#f59e0b", "#0ea5e9", "#10b981", "#7c3aed"];
  return { score, label: labels[score] || "", color: colors[score] };
}

// ── OTP_DURATION (seconds) ───────────────────────────────────────
const OTP_DURATION = 10 * 60; // 10 minutes

// ── Small helpers (outside component — stable references) ────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: 12, fontWeight: 600, color: "#94a3b8",
      display: "block", marginBottom: 6,
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      {children}
    </label>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      background: "rgba(225,29,72,0.1)",
      border: "1px solid rgba(225,29,72,0.3)",
      borderRadius: 12, padding: "10px 14px",
      fontSize: 13, color: "#f87171",
      textAlign: "center", animation: "adminFadeIn 0.3s ease",
    }}>
      {msg}
    </div>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)",
        background: "none", border: "none",
        color: "#64748b", cursor: "pointer", padding: 4,
      }}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
//  Component
// ════════════════════════════════════════════════════════════════
const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // ── Step state ────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("email");

  // ── Email step ────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // ── OTP step (single hidden input pattern) ────────────────────
  const [otpValue, setOtpValue] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  // ── Password step ─────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  // ── Mount animation ──────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Timer logic ───────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(OTP_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (step === "otp") {
      startTimer();
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, startTimer]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── OTP single-input handler ──────────────────────────────────
  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpValue(val);
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setEmailError("Please enter your email address"); return; }
    setEmailLoading(true);
    setEmailError("");
    try {
      await forgotPasswordAPI(email.trim());
      setStep("otp");
    } catch (err: any) {
      setEmailError(err.message || "Failed to send OTP");
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = async () => {
    if (timeLeft > 0 || resendLoading) return;
    setResendLoading(true);
    setOtpError("");
    try {
      await forgotPasswordAPI(email.trim());
      setOtpValue("");
      setResendCooldown(true);
      startTimer();
      setTimeout(() => setResendCooldown(false), 2000);
    } catch (err: any) {
      setOtpError(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) { setOtpError("Please enter the complete 6-digit OTP"); return; }
    setOtpLoading(true);
    setOtpError("");
    try {
      const data = await verifyOTPAPI(email.trim(), otpValue);
      setResetToken(data.reset_token);
      if (timerRef.current) clearInterval(timerRef.current);
      setStep("password");
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setPwError("Please enter a new password"); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords do not match"); return; }
    if (strength.score < 4) {
      setPwError("Password is too weak. Include uppercase, lowercase, number and special character.");
      return;
    }
    setPwLoading(true);
    setPwError("");
    try {
      await resetPasswordAPI(resetToken, newPassword);
      setPwSuccess(true);
      setTimeout(() => navigate("/admin/login", { replace: true }), 2500);
    } catch (err: any) {
      setPwError(err.message || "Password reset failed");
    } finally {
      setPwLoading(false);
    }
  };

  // ── Step metadata ──────────────────────────────────────────────
  const stepMeta = {
    email:    { icon: <Mail size={26} color="#fff" />,       title: "Forgot Password",   sub: "Enter your email to receive an OTP" },
    otp:      { icon: <KeyRound size={26} color="#fff" />,   title: "Verify OTP",        sub: `Code sent to ${email}` },
    password: { icon: <Lock size={26} color="#fff" />,        title: "New Password",      sub: "Set your new admin password" },
  };

  const meta = stepMeta[step];

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className="admin-root"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs — identical to LoginPage */}
      <div style={{
        position: "absolute", top: "20%", left: "30%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        filter: "blur(60px)", animation: "adminPulseGlow 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "25%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)",
        filter: "blur(60px)", animation: "adminPulseGlow 5s ease-in-out infinite 1s",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Card */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: step === "otp" ? 460 : 420,
        padding: "0 20px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Step indicator dots */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 8, marginBottom: 16,
        }}>
          {(["email", "otp", "password"] as Step[]).map((s, i) => (
            <div key={s} style={{
              width: step === s ? 24 : 8,
              height: 8, borderRadius: 4,
              background: step === s
                ? "linear-gradient(90deg, #7c3aed, #e11d48)"
                : i < (["email", "otp", "password"].indexOf(step))
                  ? "#7c3aed"
                  : "#1e293b",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <div style={{
          background: "rgba(17, 24, 39, 0.7)",
          border: "1px solid rgba(30, 41, 59, 0.8)",
          borderRadius: 24,
          padding: "40px 36px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top gradient line */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
            background: "linear-gradient(90deg, transparent, #7c3aed, #e11d48, transparent)",
            borderRadius: "0 0 2px 2px",
          }} />

          {/* Icon + Title */}
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", marginBottom: 28,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #7c3aed, #e11d48)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 8px 30px rgba(124,58,237,0.3)",
            }}>
              {meta.icon}
            </div>
            <h1 style={{
              fontSize: 22, fontWeight: 700, color: "#f1f5f9",
              marginBottom: 4, fontFamily: "'Inter', sans-serif",
            }}>
              {meta.title}
            </h1>
            <p style={{
              fontSize: 13, color: "#64748b",
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
            }}>
              {meta.sub}
            </p>
          </div>

          {/* ═══════════════ STEP: EMAIL ═══════════════ */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {emailError && <ErrorBox msg={emailError} />}
              <div>
                <Label>Email Address</Label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="admin@ulmind.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={emailLoading}
                style={{ marginTop: 8, height: 48, fontSize: 15, fontWeight: 700 }}
              >
                {emailLoading ? <Loader2 size={20} className="animate-spin" /> : <><ArrowRight size={18} /> Send OTP</>}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                style={{
                  background: "none", border: "none",
                  color: "#64748b", fontSize: 13,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", gap: 6, justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </form>
          )}

          {/* ═══════════════ STEP: OTP ═══════════════ */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {otpError && <ErrorBox msg={otpError} />}

              {/* OTP: single hidden input + visual display boxes */}
              <div>
                <Label>Enter 6-Digit OTP</Label>
                <div
                  style={{ display: "flex", gap: 8, justifyContent: "space-between", position: "relative", cursor: "text" }}
                  onClick={() => otpInputRef.current?.focus()}
                >
                  {/* Hidden real input that captures all keystrokes */}
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpValue}
                    onChange={handleOtpInput}
                    maxLength={6}
                    autoFocus
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                      caretColor: "transparent",
                      fontSize: 22,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />
                  {/* 6 visual display boxes */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={`otp-display-${i}`}
                      style={{
                        width: 48,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        fontWeight: 700,
                        background: "#111827",
                        border: `2px solid ${otpValue[i] ? "#7c3aed" : i === otpValue.length ? "#0ea5e9" : "#1e293b"}`,
                        borderRadius: 12,
                        color: "#f1f5f9",
                        transition: "border-color 0.2s",
                        fontFamily: "monospace",
                        flex: 1,
                        userSelect: "none",
                      }}
                    >
                      {otpValue[i] || ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer + Resend */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: 13, color: timeLeft > 0 ? "#0ea5e9" : "#64748b",
                  fontWeight: 600, fontFamily: "monospace",
                }}>
                  {timeLeft > 0 ? `⏱ ${formatTime(timeLeft)}` : "OTP expired"}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0 || resendLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "none", border: "none",
                    color: timeLeft > 0 ? "#334155" : "#7c3aed",
                    cursor: timeLeft > 0 ? "not-allowed" : "pointer",
                    fontSize: 13, fontWeight: 600,
                    padding: "4px 8px", borderRadius: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {resendLoading
                    ? <Loader2 size={14} className="animate-spin" />
                    : <RefreshCw size={14} />}
                  {resendCooldown ? "OTP Resent!" : "Resend OTP"}
                </button>
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={otpLoading || otpValue.length !== 6}
                style={{ height: 48, fontSize: 15, fontWeight: 700 }}
              >
                {otpLoading ? <Loader2 size={20} className="animate-spin" /> : <>Verify OTP <ArrowRight size={18} /></>}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setOtpValue(""); setOtpError(""); }}
                style={{
                  background: "none", border: "none", color: "#64748b",
                  fontSize: 13, cursor: "pointer", display: "flex",
                  alignItems: "center", gap: 6, justifyContent: "center",
                }}
              >
                <ArrowLeft size={14} /> Change email
              </button>
            </form>
          )}

          {/* ═══════════════ STEP: PASSWORD ═══════════════ */}
          {step === "password" && (
            <>
              {pwSuccess ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(16,185,129,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <CheckCircle2 size={36} color="#10b981" />
                  </div>
                  <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    Password Updated!
                  </h3>
                  <p style={{ color: "#64748b", fontSize: 13 }}>
                    Redirecting you to login…
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {pwError && <ErrorBox msg={pwError} />}

                  {/* New Password */}
                  <div>
                    <Label>New Password</Label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNewPw ? "text" : "password"}
                        className="admin-input"
                        placeholder="Create a strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoFocus
                        style={{ paddingRight: 44 }}
                      />
                      <EyeToggle show={showNewPw} onToggle={() => setShowNewPw(!showNewPw)} />
                    </div>

                    {/* Strength bar */}
                    {newPassword && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{
                          display: "flex", gap: 4, marginBottom: 4,
                        }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{
                              flex: 1, height: 4, borderRadius: 2,
                              background: i <= strength.score ? strength.color : "#1e293b",
                              transition: "background 0.3s",
                            }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label>Confirm Password</Label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPw ? "text" : "password"}
                        className="admin-input"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          paddingRight: 44,
                          borderColor: confirmPassword && confirmPassword !== newPassword ? "#e11d48" : undefined,
                        }}
                      />
                      <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>Passwords do not match</p>
                    )}
                  </div>

                  {/* Policy hints */}
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                      { ok: newPassword.length >= 8,       text: "At least 8 characters" },
                      { ok: /[A-Z]/.test(newPassword),       text: "Uppercase letter" },
                      { ok: /[a-z]/.test(newPassword),       text: "Lowercase letter" },
                      { ok: /\d/.test(newPassword),          text: "Number" },
                      { ok: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), text: "Special character" },
                    ].map((rule) => (
                      <li key={rule.text} style={{
                        fontSize: 12, display: "flex", alignItems: "center", gap: 6,
                        color: rule.ok ? "#10b981" : "#475569",
                        transition: "color 0.2s",
                      }}>
                        <ShieldCheck size={12} color={rule.ok ? "#10b981" : "#475569"} />
                        {rule.text}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={pwLoading}
                    style={{ marginTop: 8, height: 48, fontSize: 15, fontWeight: 700 }}
                  >
                    {pwLoading ? <Loader2 size={20} className="animate-spin" /> : <>Update Password <ArrowRight size={18} /></>}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Footer */}
          <p style={{
            textAlign: "center", fontSize: 11, color: "#475569",
            marginTop: 24, textTransform: "uppercase",
            letterSpacing: "0.1em", fontWeight: 600,
          }}>
            ULMiND Internal Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
