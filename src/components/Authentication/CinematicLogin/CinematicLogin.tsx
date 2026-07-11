/* ──────────────────────────────────────────────────────────────
   ULMIND Cinematic Login — Main Orchestrator (Lottie Version)
   
   Flow:
   Landing → QR Scan → Verification → Fullscreen → Door Lottie Opens 
   → Woman Lottie Appears → Voice Greeting → Dashboard Transition
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, SkipForward, Volume2, VolumeX } from 'lucide-react';
import Lottie from 'lottie-react';
import { Howl } from 'howler';

import QRScanner, { QRLoginResult } from '../QRScanner/QRScanner';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { speechService } from '../../../services/SpeechService';
import { audioService } from '../../../services/AudioService';
import { getGreeting } from '../../../utils/timeGreeting';
import { useHW } from '../../../admin/context/hw-context';
import '../cinematic-login.css';

type CinematicPhase =
  | 'LANDING'
  | 'QR_SCANNING'
  | 'AUTH_SUCCESS'
  | 'DOOR_OPENING'
  | 'VOICE_GREETING'
  | 'DASHBOARD_APPEARS'
  | 'COMPLETE';

const CinematicLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setSession } = useHW();
  const { enterFullscreen } = useFullscreen();

  // State
  const [phase, setPhase] = useState<CinematicPhase>('LANDING');
  const [user, setUser] = useState<QRLoginResult['employee'] | null>(null);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('ulmind_audio_muted') === 'true');
  const [greetingText, setGreetingText] = useState('');
  
  // Animation Data
  const [doorAnimData, setDoorAnimData] = useState<any>(null);
  const [womanAnimData, setWomanAnimData] = useState<any>(null);

  // Audio setup
  const doorAudioRef = useRef<Howl | null>(null);

  // Load Lottie JSONs and Audio
  useEffect(() => {
    fetch('/Lottie/woman hello.json')
      .then(r => r.json())
      .then(data => setWomanAnimData(data))
      .catch(e => console.error("Error loading woman lottie:", e));

    doorAudioRef.current = new Howl({
      src: ['/dragon-studio-opening-door-450444.mp3'],
      volume: 0.8,
    });
  }, []);

  // Redirect if already logged in initially, but don't interrupt the cinematic flow
  useEffect(() => {
    if (isLoggedIn && phase === 'LANDING') {
      navigate('/admin/hardware', { replace: true });
    }
  }, [isLoggedIn, navigate, phase]);

  // Initial landing delay
  useEffect(() => {
    if (phase === 'LANDING' && !isLoggedIn) {
      const timer = setTimeout(() => setPhase('QR_SCANNING'), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, isLoggedIn]);

  // Handle QR Success
  const handleQRSuccess = useCallback((result: QRLoginResult) => {
    setUser(result.employee);
    // Setting session makes isLoggedIn true, but our useEffect won't redirect because phase will change
    setSession({
      token: result.token,
      session_id: result.session_id,
      employee: result.employee,
      session_start: result.session_start,
      session_type: result.session_type,
      session_schedule: result.session_schedule,
    });
    
    // Play the access beep that was missing
    audioService.playAccessBeep();

    enterFullscreen();
    setPhase('AUTH_SUCCESS');
    
    // Greeting
    const firstName = result.employee.name.split(' ')[0];
    setGreetingText(getGreeting(firstName) + " Welcome to ULMIND.");

    // Start Cinematic Flow
    setTimeout(() => {
      setPhase('DOOR_OPENING');
      if (!isMuted && doorAudioRef.current) {
        doorAudioRef.current.play();
      }
      
      // Show receptionist immediately with door open
      setTimeout(() => {
        setPhase('VOICE_GREETING');
      }, 500); // 0.5s after door starts opening
      
    }, 1500); // delay to show auth success
  }, [enterFullscreen, setSession, isMuted]);

  // Handle Voice Greeting Phase
  useEffect(() => {
    if (phase === 'VOICE_GREETING') {
      if (!isMuted) {
        speechService.speak(greetingText);
      }
      
      // Video plays for 9 seconds. We wait 8.5 seconds here (since it started 0.5s after door)
      const timer = setTimeout(() => {
        setPhase('DASHBOARD_APPEARS');
        setTimeout(() => {
          setPhase('COMPLETE');
          navigate('/admin/hardware', { replace: true });
        }, 1000);
      }, 8500);
      
      return () => clearTimeout(timer);
    }
  }, [phase, greetingText, isMuted, navigate]);

  const handleSkip = () => {
    if (doorAudioRef.current) doorAudioRef.current.stop();
    setPhase('COMPLETE');
    navigate('/admin/hardware', { replace: true });
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    localStorage.setItem('ulmind_audio_muted', String(newMute));
    speechService.toggleMute();
    if (newMute && doorAudioRef.current) doorAudioRef.current.stop();
  };

  return (
    <div className="cinematic-root" style={{ background: '#030712', overflow: 'hidden' }}>
      
      {/* LANDING */}
      <AnimatePresence>
        {phase === 'LANDING' && (
          <motion.div
            className="cinematic-logo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 100, pointerEvents: 'none' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)', marginBottom: 24,
            }}>
              <Shield size={40} color="#fff" />
            </div>
            <h1 className="cinematic-logo-text">ULMiND</h1>
            <p className="cinematic-logo-sub">Smart Office Access</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR SCANNER */}
      <AnimatePresence>
        {phase === 'QR_SCANNING' && (
          <QRScanner onSuccess={handleQRSuccess} onError={(err) => console.log(err)} />
        )}
      </AnimatePresence>

      {/* AUTH SUCCESS */}
      <AnimatePresence>
        {phase === 'AUTH_SUCCESS' && (
          <motion.div
            className="cinematic-logo-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ zIndex: 50 }}
          >
            <h1 className="cinematic-logo-text" style={{ fontSize: 64 }}>ULMiND</h1>
            <p className="cinematic-logo-sub" style={{ color: '#10b981' }}>Access Granted</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOTTIE ANIMATIONS */}
      {['DOOR_OPENING', 'VOICE_GREETING', 'DASHBOARD_APPEARS'].includes(phase) && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* DOOR VIDEO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <video 
              src="/door_opening_video.mp4"
              autoPlay
              muted={isMuted}
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </motion.div>

          {/* WOMAN RECEPTIONIST LOTTIE */}
          <AnimatePresence>
            {phase === 'VOICE_GREETING' && womanAnimData && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ 
                  position: 'absolute', 
                  bottom: '10%', 
                  right: '10%', 
                  width: 300, 
                  height: 300,
                  zIndex: 20
                }}
              >
                <Lottie 
                  animationData={womanAnimData} 
                  loop={true} 
                  style={{ width: '100%', height: '100%' }}
                />
                
                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-100px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '12px 20px',
                    borderRadius: '16px 16px 0 16px',
                    color: 'white',
                    maxWidth: 250,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                    {greetingText}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* DASHBOARD TRANSITION */}
      <AnimatePresence>
        {phase === 'DASHBOARD_APPEARS' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 100,
              background: '#030712', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div className="cinematic-spinner" style={{ marginBottom: 16 }} />
            <p style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
              Preparing your workspace...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROLS */}
      {['DOOR_OPENING', 'VOICE_GREETING'].includes(phase) && (
        <div className="cinematic-controls" style={{ zIndex: 150 }}>
          <button className="cinematic-control-btn" onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button className="cinematic-control-btn" onClick={handleSkip}>
            <SkipForward size={16} /> Skip
          </button>
        </div>
      )}
    </div>
  );
};

export default CinematicLogin;
