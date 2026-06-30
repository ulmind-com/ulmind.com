import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { registerActionFx, ActionFxType } from '../lib/actionFx';

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

const LOTTIE_SRC: Record<Kind, string> = {
  save: '/Lottie/verification.json',
  edit: '/Lottie/Success.json',
  delete: '/Lottie/delete.json',
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
      const res = await fetch(LOTTIE_SRC[kind]);
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

  // Expose the trigger to the (non-React) API layer for global auto-FX.
  useEffect(() => {
    registerActionFx((t: ActionFxType) => triggerActionAnimation(t));
    return () => registerActionFx(null);
  }, [triggerActionAnimation]);

  return (
    <AdminActionContext.Provider value={{ triggerActionAnimation }}>
      {children}
      {showAnimation && (
        <div className="admin-action-overlay admin-animate-fade">
          <div className={`admin-action-lottie-container ${currentKind}`}>
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
        </div>
      )}
    </AdminActionContext.Provider>
  );
};
