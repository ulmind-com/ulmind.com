/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Settings Page
   Profile photo, change password, account info, and profile editor
   ────────────────────────────────────────────────────────────── */

import React, { useState, useRef, useEffect } from "react";
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
  Briefcase,
  Award,
  Linkedin,
  Github,
  Twitter,
  Plus,
  X,
  Save
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import {
  changePasswordAPI,
  updateProfilePhotoAPI,
  deleteProfilePhotoAPI,
  updateProfileAPI
} from "../lib/api";

type Tab = "profile" | "security";

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Basic Profile Edit States
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [xUrl, setXUrl] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Initialize from user effect
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPosition(user.position || "");
      setExperience(user.experience || "");
      setSpecializations(user.specialization || []);
      setLinkedinUrl(user.linkedin_url || "");
      setGithubUrl(user.github_url || "");
      setXUrl(user.x_url || "");
    }
  }, [user]);

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

  // ── Profile Editor ──────────────────────────────────────────
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      await updateProfileAPI({
        full_name: fullName,
        position,
        experience,
        specialization: specializations,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        x_url: xUrl
      });
      await refreshUser();
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const addSpecialization = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    if (specInput.trim() && !specializations.includes(specInput.trim())) {
      setSpecializations([...specializations, specInput.trim()]);
    }
    setSpecInput("");
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter(s => s !== spec));
  };

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
    if (!window.confirm("Remove your profile photo?")) return;

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

  const inputStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center"
  };
  const iconAdornment = {
    position: "absolute" as const,
    left: 14,
    color: "#64748b",
    pointerEvents: "none" as const,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
          Settings
        </h2>
        <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 6 }}>
          Manage your account profile, roles, and security protocols.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 32, borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 32 }}>
        <button 
          onClick={() => setActiveTab("profile")}
          style={{ 
            padding: "0 4px 12px", 
            background: "none", 
            border: "none", 
            borderBottom: activeTab === "profile" ? "2px solid var(--admin-accent)" : "2px solid transparent", 
            color: activeTab === "profile" ? "var(--admin-text)" : "var(--admin-text-dim)", 
            fontWeight: activeTab === "profile" ? 600 : 500, 
            fontSize: 15, 
            cursor: "pointer", 
            transition: "all 0.2s" 
          }}
        >
          Public Profile
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          style={{ 
            padding: "0 4px 12px", 
            background: "none", 
            border: "none", 
            borderBottom: activeTab === "security" ? "2px solid var(--admin-rose)" : "2px solid transparent", 
            color: activeTab === "security" ? "var(--admin-text)" : "var(--admin-text-dim)", 
            fontWeight: activeTab === "security" ? 600 : 500, 
            fontSize: 15, 
            cursor: "pointer", 
            transition: "all 0.2s" 
          }}
        >
          Security Settings
          {user?.must_change_password && <span style={{display: 'inline-block', width: 8, height: 8, background: '#f59e0b', borderRadius: '50%', marginLeft: 8}}/>}
        </button>
      </div>


      {activeTab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="md:grid-cols-[300px_1fr]">
          
          {/* Left Column: Avatar & Basic Auth Data */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="admin-card" style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              
              {/* Avatar Uploader */}
              <div style={{ position: "relative", marginBottom: 24 }}>
                {user?.profile_photo?.url ? (
                  <img
                    src={user.profile_photo.url}
                    alt="Profile"
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid var(--admin-bg)",
                      boxShadow: "0 0 0 3px var(--admin-accent), 0 10px 30px rgba(124,58,237,0.3)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #e11d48)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      fontWeight: 700,
                      color: "#fff",
                      border: "3px solid var(--admin-bg)",
                      boxShadow: "0 10px 30px rgba(124,58,237,0.2)",
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: -4,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--admin-accent)",
                    border: "3px solid var(--admin-bg-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {photoLoading ? (
                    <Loader2 size={16} color="#fff" className="animate-spin" />
                  ) : (
                    <Camera size={16} color="#fff" />
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

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                  style={{ fontSize: 13, padding: "8px 16px", background: "rgba(255,255,255,0.05)" }}
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
              
              {photoError && <p style={{ color: "var(--admin-rose)", fontSize: 12, marginTop: 12 }}>{photoError}</p>}
              {photoSuccess && <p style={{ color: "var(--admin-emerald)", fontSize: 12, marginTop: 12, display: "flex", gap: 4 }}><Check size={14} /> {photoSuccess}</p>}
            </div>

            {/* Read-only Auth Info */}
            <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
                <Mail size={16} color="var(--admin-text-dim)" />
                <div>
                  <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: 13, color: "var(--admin-text)", marginTop: 2 }}>{user?.email || "—"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
                <Shield size={16} color="var(--admin-text-dim)" />
                <div>
                  <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Role</div>
                  <div style={{ fontSize: 13, color: "var(--admin-text)", marginTop: 2, textTransform: "capitalize" }}>{user?.role || "—"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(15,22,41,0.5)", borderRadius: 12 }}>
                <User size={16} color="var(--admin-text-dim)" />
                <div>
                  <div style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Auth Status</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <span className={`admin-badge ${user?.status === "Active" ? "admin-badge-success" : "admin-badge-warning"}`}>
                      {user?.status || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deep Edit Form */}
          <form className="admin-card" onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px" }}>
            
            {/* Feedback Banners */}
            {profileError && (
              <div style={{ background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", display: "flex", gap: 8 }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }}/>
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#34d399", display: "flex", gap: 8 }}>
                <Check size={16} style={{ flexShrink: 0, marginTop: 2 }}/>
                {profileSuccess}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Full Name
                </label>
                <div style={inputStyle}>
                  <User size={16} style={iconAdornment} />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="E.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Primary Position
                </label>
                <div style={inputStyle}>
                  <Briefcase size={16} style={iconAdornment} />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="E.g. Senior Developer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Years of Experience
              </label>
              <div style={inputStyle}>
                <Award size={16} style={iconAdornment} />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="E.g. 5+ Years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ paddingLeft: 42, maxWidth: 220 }}
                />
              </div>
            </div>

            {/* Specializations (Tags) */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Specializations
              </label>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {specializations.map((spec, i) => (
                  <div key={i} style={{ 
                    display: "flex", alignItems: "center", gap: 6, 
                    background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)", 
                    padding: "6px 12px", borderRadius: 20, fontSize: 13, color: "var(--admin-text)" 
                  }}>
                    {spec}
                    <button type="button" onClick={() => removeSpecialization(spec)} style={{ background: "none", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={14} className="hover:text-rose-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, maxWidth: 400 }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Add a skill and press Enter"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  onKeyDown={addSpecialization}
                />
                <button type="button" onClick={() => addSpecialization()} className="admin-btn admin-btn-ghost" style={{ padding: "0 16px" }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,0.05)", margin: "8px 0" }} />

            {/* Social Links */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16 }}>Social Connect</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                
                <div style={inputStyle}>
                  <Linkedin size={16} style={iconAdornment} />
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="LinkedIn Profile URL"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>

                <div style={inputStyle}>
                  <Github size={16} style={iconAdornment} />
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="GitHub Profile URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>

                <div style={inputStyle}>
                  <Twitter size={16} style={iconAdornment} />
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="X / Twitter URL"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>

              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={profileLoading}
                style={{ padding: "10px 24px" }}
              >
                {profileLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}


      {activeTab === "security" && (
        <div style={{ maxWidth: 600 }}>
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

          <div className="admin-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--admin-rose)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={20} /> Update Password
            </h3>

            {/* Password feedback */}
            {passwordError && (
              <div style={{ background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#f87171" }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={14} /> {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Current Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background:
                              newPassword.length >= level * 3
                                ? level <= 1
                                  ? "var(--admin-rose)"
                                  : level <= 2
                                  ? "var(--admin-amber)"
                                  : "var(--admin-emerald)"
                                : "rgba(255,255,255,0.1)",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
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
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                  <p style={{ color: "var(--admin-rose)", fontSize: 12, marginTop: 6 }}>
                    Passwords do not match
                  </p>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  className="admin-btn"
                  disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  style={{ 
                    padding: "12px 24px", 
                    width: "100%", 
                    background: "var(--admin-rose)", 
                    color: "white", 
                    fontWeight: 600 
                  }}
                >
                  {passwordLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={16} /> Update Secure Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
