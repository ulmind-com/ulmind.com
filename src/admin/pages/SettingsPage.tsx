/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Settings Page
   Profile photo, change password, account info
   ────────────────────────────────────────────────────────────── */

import React, { useState, useRef } from "react";
import {
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  User,
  Mail,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import {
  changePasswordAPI,
  updateProfilePhotoAPI,
  deleteProfilePhotoAPI,
} from "../lib/api";

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo state
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ── Photo Upload ──────────────────────────────────────────
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File too large. Max 5MB.");
      return;
    }

    setPhotoLoading(true);
    setPhotoError("");
    setPhotoSuccess("");

    try {
      await updateProfilePhotoAPI(file);
      await refreshUser();
      setPhotoSuccess("Profile photo updated!");
      setTimeout(() => setPhotoSuccess(""), 3000);
    } catch (err: any) {
      setPhotoError(err.message || "Failed to upload photo");
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePhotoDelete = async () => {
    if (!confirm("Remove your profile photo?")) return;

    setPhotoLoading(true);
    setPhotoError("");
    setPhotoSuccess("");

    try {
      await deleteProfilePhotoAPI();
      await refreshUser();
      setPhotoSuccess("Profile photo removed!");
      setTimeout(() => setPhotoSuccess(""), 3000);
    } catch (err: any) {
      setPhotoError(err.message || "Failed to delete photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  // ── Change Password ───────────────────────────────────────
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await changePasswordAPI({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
          Settings
        </h2>
        <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
          Manage your profile and security settings
        </p>
      </div>

      {/* Must change password warning */}
      {user?.must_change_password && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AlertCircle size={20} color="#f59e0b" />
          <div>
            <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: 14 }}>Password Change Required</p>
            <p style={{ color: "var(--admin-text-muted)", fontSize: 13, marginTop: 2 }}>
              For security reasons, you must change your password before continuing.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
        {/* ── Profile Card ────────────────────────────────── */}
        <div className="admin-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--admin-text)", marginBottom: 24 }}>
            Profile
          </h3>

          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ position: "relative" }}>
              {user?.profile_photo?.url ? (
                <img
                  src={user.profile_photo.url}
                  alt="Profile"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid var(--admin-accent)",
                    boxShadow: "0 0 20px var(--admin-accent-glow)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #e11d48)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(124,58,237,0.3)",
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
              )}

              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--admin-accent)",
                  border: "2px solid var(--admin-bg-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
              >
                {photoLoading ? (
                  <Loader2 size={14} color="#fff" className="animate-spin" />
                ) : (
                  <Camera size={14} color="#fff" />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                <Camera size={14} /> Upload
              </button>
              {user?.profile_photo?.url && (
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={handlePhotoDelete}
                  disabled={photoLoading}
                  style={{ fontSize: 13, padding: "8px 16px" }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>

            {/* Photo feedback */}
            {photoError && (
              <p style={{ color: "var(--admin-rose)", fontSize: 12 }}>{photoError}</p>
            )}
            {photoSuccess && (
              <p style={{ color: "var(--admin-emerald)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <Check size={14} /> {photoSuccess}
              </p>
            )}
          </div>

          {/* Account Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
              <Mail size={16} color="var(--admin-text-dim)" />
              <div>
                <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Email
                </div>
                <div style={{ fontSize: 14, color: "var(--admin-text)", marginTop: 2 }}>
                  {user?.email || "—"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
              <Shield size={16} color="var(--admin-text-dim)" />
              <div>
                <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Role
                </div>
                <div style={{ fontSize: 14, color: "var(--admin-text)", marginTop: 2, textTransform: "capitalize" }}>
                  {user?.role || "—"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
              <User size={16} color="var(--admin-text-dim)" />
              <div>
                <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Status
                </div>
                <div style={{ fontSize: 14, marginTop: 2 }}>
                  <span className={`admin-badge ${user?.status === "Active" ? "admin-badge-success" : "admin-badge-warning"}`}>
                    {user?.status || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Change Password Card ────────────────────────── */}
        <div className="admin-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--admin-text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={18} /> Change Password
          </h3>

          {/* Password feedback */}
          {passwordError && (
            <div
              style={{
                background: "rgba(225, 29, 72, 0.1)",
                border: "1px solid rgba(225, 29, 72, 0.3)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#f87171",
              }}
            >
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#34d399",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Check size={14} /> {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Current Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Current Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  className="admin-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  className="admin-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            newPassword.length >= level * 3
                              ? level <= 1
                                ? "var(--admin-rose)"
                                : level <= 2
                                ? "var(--admin-amber)"
                                : "var(--admin-emerald)"
                              : "var(--admin-border)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>
                    {newPassword.length < 6
                      ? "Too short"
                      : newPassword.length < 8
                      ? "Fair"
                      : newPassword.length < 12
                      ? "Good"
                      : "Strong"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Confirm New Password
              </label>
              <input
                type="password"
                className="admin-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p style={{ color: "var(--admin-rose)", fontSize: 12, marginTop: 4 }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
              style={{ marginTop: 8 }}
            >
              {passwordLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Lock size={16} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
