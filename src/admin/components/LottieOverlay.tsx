import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

interface LottieOverlayProps {
  isVisible: boolean;
  animationPath: string; // e.g. "/Jason/Success.json" or "/Jason/delete.json"
  text?: string;
  onComplete?: () => void;
  duration?: number; // How long to show it before closing automatically (default: 2000)
}

export const LottieOverlay: React.FC<LottieOverlayProps> = ({
  isVisible,
  animationPath,
  text,
  onComplete,
  duration = 2000,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (isVisible && animationPath) {
      fetch(animationPath)
        .then((res) => res.json())
        .then((data) => setAnimationData(data))
        .catch((err) => console.error(`Failed to load lottie from ${animationPath}`, err));
    } else if (!isVisible) {
      // Clear data to force fresh reload next time if needed
      setAnimationData(null);
    }
  }, [isVisible, animationPath]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && animationData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              minWidth: "300px",
            }}
          >
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              style={{ width: 160, height: 160 }}
            />
            {text && (
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  marginTop: "20px",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#f8fafc",
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                }}
              >
                {text}
              </motion.h3>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
