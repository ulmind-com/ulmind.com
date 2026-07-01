import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerActionFx, installFetchFx, uninstallFetchFx, ActionFxType } from '../lib/actionFx';

// 'success' is kept as a backward-compatible alias for 'save'.
export type ActionAnimationType = 'save' | 'edit' | 'delete' | 'success';

interface AdminActionContextType {
  triggerActionAnimation: (type?: ActionAnimationType) => void;
}

const AdminActionContext = createContext<AdminActionContextType | undefined>(undefined);

export const useAdminAction = () => {
  const context = useContext(AdminActionContext);
  if (!context) {
    throw new Error('useAdminAction must be used within an AdminActionProvider');
  }
  return context;
};

// Normalise legacy 'success' → 'save', then resolve the Lottie file + glow theme.
type Kind = 'save' | 'edit' | 'delete';
const normalize = (t: ActionAnimationType): Kind => (t === 'success' ? 'save' : t);

// Any edit or save shows the verified-icon animation; delete shows the wrong/cross.
const LOTTIE_SRC: Record<Kind, string> = {
  save: '/Lottie/Verified Icon Animation.json',
  edit: '/Lottie/Verified Icon Animation.json',
  delete: '/Lottie/Wrong.json',
};

// Premium caption + accent shown with the animation, per action kind.
const META: Record<Kind, { title: string; sub: string; accent: string }> = {
  save: { title: 'Saved Successfully', sub: 'Your changes are secured', accent: '#f43f5e' },
  edit: { title: 'Changes Updated', sub: 'Everything is up to date', accent: '#8b5cf6' },
  delete: { title: 'Removed', sub: 'The item has been deleted', accent: '#ef4444' },
};

export const AdminActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentKind, setCurrentKind] = useState<Kind>('save');
  const animDataRef = useRef<Record<Kind, any>>({ save: null, edit: null, delete: null });
  const [activeAnimData, setActiveAnimData] = useState<any>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLottie = async (kind: Kind) => {
    if (animDataRef.current[kind]) return animDataRef.current[kind];
    try {
      const res = await fetch(encodeURI(LOTTIE_SRC[kind]));
      const data = await res.json();
      animDataRef.current[kind] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load ${kind} lottie animation:`, err);
      return null;
    }
  };

  const triggerActionAnimation = useCallback(async (type: ActionAnimationType = 'save') => {
    const kind = normalize(type);
    setCurrentKind(kind);
    let data = animDataRef.current[kind];
    if (!data) data = await loadLottie(kind);
    setActiveAnimData(data);
    setShowAnimation(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowAnimation(false), 2200);
  }, []);

  // Expose the trigger to the (non-React) API layer and install a global
  // fetch interceptor so ANY mutation across the admin panel fires the overlay.
  useEffect(() => {
    registerActionFx((t: ActionFxType) => triggerActionAnimation(t));
    installFetchFx();
    return () => {
      registerActionFx(null);
      uninstallFetchFx();
    };
  }, [triggerActionAnimation]);

  const meta = META[currentKind];

  return (
    <AdminActionContext.Provider value={{ triggerActionAnimation }}>
      {children}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            className="admin-action-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ ['--fx-accent' as any]: meta.accent }}
          >
            <motion.div
              className={`admin-action-card ${currentKind}`}
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {/* animated gradient border ring */}
              <span className="admin-action-ring" aria-hidden />
              {/* sheen sweep */}
              <span className="admin-action-sheen" aria-hidden />

              {/* floating sparkle particles */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="admin-action-spark"
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -40 - i * 6, scale: [0.5, 1, 0.4] }}
                  transition={{ duration: 1.6, delay: 0.15 + i * 0.12, ease: 'easeOut' }}
                  style={{ left: `${18 + i * 12}%` }}
                />
              ))}

              <div className="admin-action-lottie-halo">
                {activeAnimData ? (
                  <Lottie
                    key={currentKind}
                    animationData={activeAnimData}
                    loop={false}
                    autoplay={true}
                    className="admin-action-lottie"
                  />
                ) : null}
              </div>

              <motion.h3
                className="admin-action-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                {meta.title}
              </motion.h3>
              <motion.p
                className="admin-action-sub"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                {meta.sub}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminActionContext.Provider>
  );
};
