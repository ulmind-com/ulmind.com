/* ──────────────────────────────────────────────────────────────
   QR Scanner — Premium QR Scanner + Manual Login for Cinematic Login
   Left: QR Camera Scanner  |  Right: Manual Email/Password Login
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Camera, Loader2, Wifi, WifiOff, CheckCircle, AlertTriangle, Scan, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { useCamera } from '../../../hooks/useCamera';
import { qrLogin, manualHWLogin } from '../../../admin/lib/hw-api';
import { playSuccessBeep } from '../../../admin/lib/beep';
import { speechService } from '../../../services/SpeechService';

// Dynamic import for jsQR
let jsQR: any = null;
import('jsqr').then(mod => { jsQR = mod.default || mod; });

export interface QRLoginResult {
  token: string;
  admin_token?: string;
  session_id: string;
  employee: {
    name: string;
    email: string;
    employee_id: string;
    designation: string;
    _id: string;
    department?: string;
    phone?: string;
    profile_photo?: string;
    gender?: string;
  };
  session_start: string;
  session_type: string;
  session_schedule: any;
  message?: string;
}

interface QRScannerProps {
  onSuccess: (result: QRLoginResult) => void;
  onError: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onError }) => {
  const { videoRef, error: cameraError, isLoading: cameraLoading, isCameraOn, startCamera, stopCamera } = useCamera();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [scanMessage, setScanMessage] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Manual login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const scanLockRef = useRef(false);

  // Internet status
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // QR Scanner loop
  const scanQR = useCallback(() => {
    if (!videoRef.current || !jsQR || scanLockRef.current || !isCameraOn) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    if (!scanCanvasRef.current) {
      scanCanvasRef.current = document.createElement('canvas');
    }
    const canvas = scanCanvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      scanLockRef.current = true;
      handleQRDetected(code.data);
    } else {
      animFrameRef.current = requestAnimationFrame(scanQR);
    }
  }, [isCameraOn]);

  // Start scanning when camera is ready
  useEffect(() => {
    if (isCameraOn && !loginLoading && !scanResult) {
      setScanning(true);
      animFrameRef.current = requestAnimationFrame(scanQR);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraOn, scanQR, loginLoading, scanResult]);

  const handleQRDetected = async (data: string) => {
    setLoginLoading(true);
    try {
      let payload = data;
      try {
        JSON.parse(data);
      } catch {
        throw new Error('Invalid QR code format');
      }

      playSuccessBeep();
      speechService.speak("Access Granted");

      setScanResult('success');
      setScanMessage('QR Code verified! Initializing secure access...');

      const result = await qrLogin(payload);

      if (result.status === 'success') {
        // Store admin token using existing mechanism
        if (result.admin_token) {
          localStorage.setItem('ulmind_admin_token', result.admin_token);
        }
        localStorage.setItem('ulmind_hw_token', result.token);

        setScanMessage(result.message || 'Identity confirmed. Welcome.');
        
        // Pass the full result to parent after a brief visual delay
        setTimeout(() => {
          onSuccess(result as QRLoginResult);
        }, 800);
      } else {
        throw new Error(result.message || 'Verification failed');
      }
    } catch (err: any) {
      setScanResult('error');
      const errorMessage = err.message || 'Authentication failed. Please try again.';
      setScanMessage(errorMessage);
      onError(errorMessage);

      setTimeout(() => {
        setScanResult(null);
        setScanMessage('');
        scanLockRef.current = false;
        setLoginLoading(false);
      }, 3000);
    }
  };

  // Manual login handler
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setManualError('Please fill in all fields');
      return;
    }

    setManualLoading(true);
    setManualError('');

    try {
      const result = await manualHWLogin(email.trim(), password);

      if (result.status === 'success') {
        if (result.admin_token) {
          localStorage.setItem('ulmind_admin_token', result.admin_token);
        }
        localStorage.setItem('ulmind_hw_token', result.token);

        playSuccessBeep();
        speechService.speak("Access Granted");
        setManualSuccess(true);

        // Pass the full result to parent
        setTimeout(() => {
          onSuccess(result as QRLoginResult);
        }, 800);
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (err: any) {
      setManualError(err.message || 'Invalid credentials. Please try again.');
      onError(err.message || 'Manual login failed');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <motion.div
      className="cinematic-qr-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Internet Status */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px', borderRadius: 12,
        background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.15)',
        border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        color: isOnline ? '#10b981' : '#ef4444',
        fontSize: 12, fontWeight: 600,
      }}>
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        {isOnline ? 'Online' : 'Offline'}
      </div>

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div className="cinematic-split-layout">

        {/* ── LEFT: QR Scanner ── */}
        <div className="cinematic-split-left">
          <div className="cinematic-qr-inner">
            <div className="cinematic-qr-accent" />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 56, height: 56, borderRadius: 18, margin: '0 auto 14px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <Shield size={28} color="#fff" strokeWidth={1.5} />
              </motion.div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4,
                letterSpacing: '-0.03em', fontFamily: "'Outfit', 'Inter', sans-serif",
              }}>
                ULMiND Access
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                Scan your security badge to enter
              </p>
            </div>

            {/* Camera Viewfinder */}
            <div className="cinematic-qr-viewfinder">
              <video
                ref={videoRef as React.RefObject<HTMLVideoElement>}
                autoPlay
                playsInline
                muted
              />

              {/* Scanning overlay */}
              {isCameraOn && !scanResult && (
                <>
                  <div className="cinematic-corner cinematic-corner--tl" />
                  <div className="cinematic-corner cinematic-corner--tr" />
                  <div className="cinematic-corner cinematic-corner--bl" />
                  <div className="cinematic-corner cinematic-corner--br" />
                  <div className="cinematic-scan-line" />
                </>
              )}

              {/* Success overlay */}
              <AnimatePresence>
                {scanResult === 'success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(16, 185, 129, 0.12)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    >
                      <CheckCircle size={64} color="#10b981" strokeWidth={1.5} />
                    </motion.div>
                    <p style={{ color: '#10b981', fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                      Identity Verified
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error overlay */}
              <AnimatePresence>
                {scanResult === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(239, 68, 68, 0.12)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    >
                      <AlertTriangle size={64} color="#ef4444" strokeWidth={1.5} />
                    </motion.div>
                    <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, marginTop: 12 }}>
                      Access Denied
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Camera loading */}
              {(cameraLoading || !isCameraOn) && !cameraError && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.85)',
                }}>
                  <div className="cinematic-spinner" />
                  <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 16, fontWeight: 500 }}>
                    Initializing camera...
                  </p>
                </div>
              )}

              {/* Camera error */}
              {cameraError && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.92)',
                  padding: 20, textAlign: 'center',
                }}>
                  <Camera size={36} color="#ef4444" />
                  <p style={{ color: '#fca5a5', fontSize: 14, fontWeight: 700, marginTop: 12 }}>
                    Camera Access Required
                  </p>
                  <p style={{ color: '#64748b', fontSize: 11, marginTop: 6 }}>{cameraError}</p>
                  <button
                    onClick={startCamera}
                    style={{
                      marginTop: 16, padding: '8px 20px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: '#fff', border: 'none', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.3s',
                    }}
                  >
                    Retry Camera
                  </button>
                </div>
              )}
            </div>

            {/* Status message */}
            <AnimatePresence mode="wait">
              {scanMessage && (
                <motion.div
                  key={scanMessage}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: 'center', padding: '10px 16px', borderRadius: 12,
                    marginBottom: 12,
                    background: scanResult === 'success' ? 'rgba(16, 185, 129, 0.08)' : scanResult === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                    border: `1px solid ${scanResult === 'success' ? 'rgba(16, 185, 129, 0.25)' : scanResult === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                    color: scanResult === 'success' ? '#10b981' : scanResult === 'error' ? '#fca5a5' : '#93c5fd',
                    fontSize: 12, fontWeight: 600,
                  }}
                >
                  {scanMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning indicator */}
            {scanning && !scanResult && !loginLoading && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 12,
              }}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Scan size={16} color="#3b82f6" />
                </motion.div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                  Scanning for QR code...
                </span>
              </div>
            )}

            {/* Loading during login */}
            {loginLoading && !scanResult && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 12,
              }}>
                <div className="cinematic-spinner" />
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                  Authenticating...
                </span>
              </div>
            )}

            {/* Instructions */}
            <div style={{
              background: 'rgba(0,0,0,0.2)', borderRadius: 14,
              padding: '12px 16px', border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#94a3b8' }}>Instructions:</strong> Hold your QR badge in front of the camera.
                The system will automatically detect and verify your identity.
              </p>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="cinematic-split-divider">
          <div className="cinematic-split-divider-line" />
          <span className="cinematic-split-divider-text">OR</span>
          <div className="cinematic-split-divider-line" />
        </div>

        {/* ── RIGHT: Manual Login ── */}
        <div className="cinematic-split-right">
          <div className="cinematic-qr-inner">
            <div className="cinematic-qr-accent" style={{
              background: 'linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, #8b5cf6, transparent)',
            }} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 56, height: 56, borderRadius: 18, margin: '0 auto 14px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <KeyRound size={28} color="#fff" strokeWidth={1.5} />
              </motion.div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4,
                letterSpacing: '-0.03em', fontFamily: "'Outfit', 'Inter', sans-serif",
              }}>
                Manual Login
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                Sign in with your credentials
              </p>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {manualSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '48px 0',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle size={72} color="#10b981" strokeWidth={1.5} />
                  </motion.div>
                  <p style={{ color: '#10b981', fontSize: 18, fontWeight: 700, marginTop: 16 }}>
                    Identity Verified
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
                    Initializing secure access...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            {!manualSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Error */}
                <AnimatePresence>
                  {manualError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        marginBottom: 18,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#fca5a5',
                        textAlign: 'center',
                      }}
                    >
                      {manualError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Email */}
                  <div>
                    <label style={{
                      fontSize: 10, fontWeight: 700, color: '#94a3b8',
                      display: 'block', marginBottom: 6,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        size={16}
                        color={focusedField === 'email' ? '#8b5cf6' : '#475569'}
                        style={{
                          position: 'absolute', left: 14, top: '50%',
                          transform: 'translateY(-50%)', transition: 'color 0.3s',
                        }}
                      />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="email"
                        style={{
                          width: '100%', paddingLeft: 40, paddingRight: 14, height: 46,
                          background: 'rgba(0,0,0,0.35)',
                          border: focusedField === 'email'
                            ? '1px solid rgba(139, 92, 246, 0.5)'
                            : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 14, color: '#fff', fontSize: 14,
                          outline: 'none', transition: 'all 0.3s',
                          boxShadow: focusedField === 'email'
                            ? '0 0 0 3px rgba(139, 92, 246, 0.1)'
                            : 'none',
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{
                      fontSize: 10, fontWeight: 700, color: '#94a3b8',
                      display: 'block', marginBottom: 6,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={16}
                        color={focusedField === 'password' ? '#8b5cf6' : '#475569'}
                        style={{
                          position: 'absolute', left: 14, top: '50%',
                          transform: 'translateY(-50%)', transition: 'color 0.3s',
                        }}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="current-password"
                        style={{
                          width: '100%', paddingLeft: 40, paddingRight: 42, height: 46,
                          background: 'rgba(0,0,0,0.35)',
                          border: focusedField === 'password'
                            ? '1px solid rgba(139, 92, 246, 0.5)'
                            : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 14, color: '#fff', fontSize: 14,
                          outline: 'none', transition: 'all 0.3s',
                          boxShadow: focusedField === 'password'
                            ? '0 0 0 3px rgba(139, 92, 246, 0.1)'
                            : 'none',
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute', right: 12, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none',
                          color: showPassword ? '#8b5cf6' : '#475569',
                          cursor: 'pointer', padding: 4,
                          transition: 'color 0.3s',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(139, 92, 246, 0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={manualLoading}
                    style={{
                      marginTop: 6,
                      height: 46,
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 14,
                      cursor: manualLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.2s',
                      opacity: manualLoading ? 0.7 : 1,
                      fontFamily: "'Inter', system-ui, sans-serif",
                    }}
                  >
                    {manualLoading ? (
                      <div className="cinematic-spinner" />
                    ) : (
                      <>Sign In <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </form>

                {/* Info */}
                <div style={{
                  background: 'rgba(0,0,0,0.2)', borderRadius: 14,
                  padding: '12px 16px', border: '1px solid rgba(255,255,255,0.04)',
                  marginTop: 18,
                }}>
                  <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    <strong style={{ color: '#94a3b8' }}>Note:</strong> Use the same email and password
                    as your admin dashboard login.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <p style={{
              textAlign: 'center', fontSize: 9, color: '#334155',
              marginTop: 20, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700,
            }}>
              ULMiND Security System
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRScanner;
