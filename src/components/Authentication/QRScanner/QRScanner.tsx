/* ──────────────────────────────────────────────────────────────
   QR Scanner — Premium QR Scanner for Cinematic Login
   Reuses existing useCamera hook and hw-api qrLogin
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Camera, Loader2, Wifi, WifiOff, CheckCircle, AlertTriangle, Scan } from 'lucide-react';
import { useCamera } from '../../../hooks/useCamera';
import { qrLogin } from '../../../admin/lib/hw-api';
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

      <div className="cinematic-qr-card">
        <div className="cinematic-qr-inner">
          <div className="cinematic-qr-accent" />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <Shield size={32} color="#fff" strokeWidth={1.5} />
            </motion.div>
            <h1 style={{
              fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6,
              letterSpacing: '-0.03em', fontFamily: "'Outfit', 'Inter', sans-serif",
            }}>
              ULMiND Access
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
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
                    <CheckCircle size={72} color="#10b981" strokeWidth={1.5} />
                  </motion.div>
                  <p style={{ color: '#10b981', fontSize: 18, fontWeight: 700, marginTop: 12 }}>
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
                    <AlertTriangle size={72} color="#ef4444" strokeWidth={1.5} />
                  </motion.div>
                  <p style={{ color: '#ef4444', fontSize: 16, fontWeight: 700, marginTop: 12 }}>
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
                <Camera size={40} color="#ef4444" />
                <p style={{ color: '#fca5a5', fontSize: 15, fontWeight: 700, marginTop: 12 }}>
                  Camera Access Required
                </p>
                <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>{cameraError}</p>
                <button
                  onClick={startCamera}
                  style={{
                    marginTop: 20, padding: '10px 24px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
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
                  textAlign: 'center', padding: '12px 18px', borderRadius: 14,
                  marginBottom: 16,
                  background: scanResult === 'success' ? 'rgba(16, 185, 129, 0.08)' : scanResult === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                  border: `1px solid ${scanResult === 'success' ? 'rgba(16, 185, 129, 0.25)' : scanResult === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                  color: scanResult === 'success' ? '#10b981' : scanResult === 'error' ? '#fca5a5' : '#93c5fd',
                  fontSize: 13, fontWeight: 600,
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
              gap: 10, marginBottom: 16,
            }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Scan size={18} color="#3b82f6" />
              </motion.div>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                Scanning for QR code...
              </span>
            </div>
          )}

          {/* Loading during login */}
          {loginLoading && !scanResult && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, marginBottom: 16,
            }}>
              <div className="cinematic-spinner" />
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                Authenticating...
              </span>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            background: 'rgba(0,0,0,0.2)', borderRadius: 16,
            padding: '14px 20px', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#94a3b8' }}>Instructions:</strong> Hold your QR badge in front of the camera.
              The system will automatically detect and verify your identity.
            </p>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: 'center', fontSize: 10, color: '#334155',
            marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700,
          }}>
            ULMiND Security System
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QRScanner;
