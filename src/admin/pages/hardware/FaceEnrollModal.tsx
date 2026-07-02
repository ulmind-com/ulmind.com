/* ──────────────────────────────────────────────────────────────
   Face Enrollment Modal — capture an employee's reference face
   ----------------------------------------------------------------
   Opens the camera, computes a 128-d descriptor via face-api and
   sends it to the backend. The reference vector is stored server-
   side and used to block anyone logging in with a stolen QR badge.
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, ScanFace, CheckCircle, AlertTriangle, Loader2, Camera } from "lucide-react";
import { computeFaceDescriptor, loadFaceModels } from "../../lib/faceRecognition";
import { enrollFace } from "../../lib/hw-api";

interface Props {
  employee: { _id: string; name: string; employee_id: string; face_enrolled?: boolean };
  onClose: () => void;
  onEnrolled: () => void;
}

type Phase = "loading" | "ready" | "capturing" | "success" | "error";

const FaceEnrollModal: React.FC<Props> = ({ employee, onClose, onEnrolled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState("Loading face models…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadFaceModels();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setPhase("ready");
        setMessage("Center the employee's face, then capture.");
      } catch (err: any) {
        setPhase("error");
        setMessage(err?.message?.includes("Permission") || err?.name === "NotAllowedError"
          ? "Camera permission denied."
          : "Could not start camera / load models.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    setPhase("capturing");
    setMessage("Detecting face…");
    try {
      const descriptor = await computeFaceDescriptor(videoRef.current);
      if (!descriptor) {
        setPhase("ready");
        setMessage("No clear single face detected. Improve lighting and try again.");
        return;
      }
      await enrollFace(employee._id, descriptor);
      setPhase("success");
      setMessage("Face enrolled successfully!");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setTimeout(() => {
        onEnrolled();
        onClose();
      }, 1200);
    } catch (err: any) {
      setPhase("error");
      setMessage(err?.message || "Enrollment failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(3,7,18,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 460, background: "#0b1220",
          border: "1px solid rgba(148,163,184,0.15)", borderRadius: 20,
          padding: 24, color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ScanFace size={22} color="#3b82f6" />
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Enroll Face</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
          {employee.name} • {employee.employee_id}
          {employee.face_enrolled ? " — re-enrolling will replace the current face" : ""}
        </p>

        <div style={{
          position: "relative", width: "100%", aspectRatio: "4/3",
          background: "#000", borderRadius: 14, overflow: "hidden", marginBottom: 16,
        }}>
          <video
            ref={videoRef}
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
          />
          {(phase === "loading" || phase === "capturing") && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", background: "rgba(0,0,0,0.4)",
            }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={40} color="#3b82f6" />
              </motion.div>
            </div>
          )}
          {phase === "success" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", background: "rgba(16,185,129,0.2)",
            }}>
              <CheckCircle size={56} color="#10b981" />
            </div>
          )}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
          fontSize: 13,
          color: phase === "error" ? "#f87171" : phase === "success" ? "#34d399" : "#cbd5e1",
        }}>
          {phase === "error" && <AlertTriangle size={16} />}
          <span>{message}</span>
        </div>

        <button
          onClick={handleCapture}
          disabled={phase !== "ready"}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12, border: "none",
            background: phase === "ready" ? "#3b82f6" : "#1e293b",
            color: phase === "ready" ? "#fff" : "#64748b",
            fontWeight: 700, fontSize: 14, cursor: phase === "ready" ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Camera size={16} /> Capture &amp; Enroll
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FaceEnrollModal;
